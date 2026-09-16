/**
 * 큐레이션 식재료 시세
 * - 검증된 코드만 사용
 * - 6시간 스냅샷 캐시
 * - 소매 우선, 지정 채널이 wholesale이면 도매
 */

import https from 'https';
import {
    CACHE_TTL,
    CURATED_INGREDIENTS,
    KAMIS_DEFAULT_PARAMS,
    type CuratedIngredient,
} from '../../constants';
import cache from '../system/cache';
import logger from '../system/logger';
import type { KamisItem } from './kamis';

const KAMIS_API_BASE_URL =
    process.env.KAMIS_API_BASE_URL || 'https://www.kamis.or.kr/service/price/xml.do';

/** curated(기본) | search(기존 자유검색) — 롤백용 */
export function getIngredientPriceMode(): 'curated' | 'search' {
    const mode = (process.env.INGREDIENT_PRICE_MODE || 'curated').trim().toLowerCase();
    return mode === 'search' ? 'search' : 'curated';
}

export interface CuratedPriceItem extends KamisItem {
    id: string;
    source: 'retail' | 'wholesale';
}

interface PriceRow {
    itemname?: string;
    kindname?: string;
    countyname?: string;
    yyyy?: string;
    regday?: string;
    price?: string;
}

function getCertParams(): { certKey: string; certId: string } | null {
    const certKey = process.env.KAMIS_CERT_KEY?.trim() || '';
    const certId = process.env.KAMIS_CERT_ID?.trim() || '';
    if (!certKey || !certId) return null;
    return { certKey, certId };
}

function parsePrice(priceStr: string | undefined): number {
    if (!priceStr) return 0;
    const cleaned = String(priceStr).replace(/,/g, '').trim();
    if (!cleaned || cleaned === '-' || cleaned === '–') return 0;
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDateYmd(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatRowDate(yyyy?: string, regday?: string): string {
    if (!regday) return '';
    const dayPart = String(regday).replace(/[./]/g, '-');
    if (!yyyy) return dayPart;
    return `${yyyy}-${dayPart}`;
}

function getLookupRange(): { start: string; end: string } {
    const end = new Date();
    const start = new Date();
    // 큐레이션은 빈 구간을 줄이기 위해 60일
    start.setDate(end.getDate() - 59);
    return { start: formatDateYmd(start), end: formatDateYmd(end) };
}

function fetchWithHttps(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk: Buffer) => {
                data += chunk.toString();
            });
            response.on('end', () => {
                if (
                    response.statusCode &&
                    response.statusCode >= 200 &&
                    response.statusCode < 300
                ) {
                    resolve(data);
                } else {
                    reject(new Error(`KAMIS API 응답 코드: ${response.statusCode}`));
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(15000, () => {
            req.destroy(new Error('KAMIS API 요청 시간 초과'));
        });
    });
}

function extractRows(jsonData: unknown): PriceRow[] {
    if (!jsonData || typeof jsonData !== 'object') return [];
    const root = jsonData as Record<string, unknown>;
    const data = root.data;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
        const nested = data as Record<string, unknown>;
        if (Array.isArray(nested.item)) return nested.item as PriceRow[];
        if (nested.item && typeof nested.item === 'object') return [nested.item as PriceRow];
    }
    if (Array.isArray(data) && data[0] && typeof data[0] === 'object') {
        const first = data[0] as Record<string, unknown>;
        if (Array.isArray(first.item)) return first.item as PriceRow[];
    }
    return [];
}

function pickLatest(rows: PriceRow[]): { price: number; date: string; change: number; changeRate: number } | null {
    const priced = rows
        .map((row) => ({
            price: parsePrice(row.price),
            date: formatRowDate(row.yyyy, row.regday),
            county: row.countyname || '',
        }))
        .filter((row) => row.price > 0);

    if (priced.length === 0) return null;

    const preferAverage = priced.filter((row) => row.county.includes('평균'));
    const pool = preferAverage.length > 0 ? preferAverage : priced;
    pool.sort((a, b) => String(b.date).localeCompare(String(a.date)));

    const latest = pool[0];
    const previous = pool[1];
    const change = previous ? latest.price - previous.price : 0;
    const changeRate =
        previous && previous.price > 0
            ? Number((((latest.price - previous.price) / previous.price) * 100).toFixed(1))
            : 0;

    return { price: latest.price, date: latest.date, change, changeRate };
}

async function fetchChannelPrice(
    ingredient: CuratedIngredient,
    channel: 'retail' | 'wholesale'
): Promise<CuratedPriceItem | null> {
    const cert = getCertParams();
    if (!cert) return null;

    const { start, end } = getLookupRange();
    const action = channel === 'retail' ? 'periodRetailProductList' : 'periodProductList';
    const params: Record<string, string> = {
        action,
        p_cert_key: cert.certKey,
        p_cert_id: cert.certId,
        p_returntype: 'json',
        p_startday: start,
        p_endday: end,
        p_itemcategorycode: ingredient.categoryCode,
        p_itemcode: ingredient.itemCode,
        p_kindcode: ingredient.kindCode,
        p_productrankcode: ingredient.rankCode,
        p_convert_kg_yn: KAMIS_DEFAULT_PARAMS.convertKgYn,
    };
    if (channel === 'retail') {
        params.p_countrycode = KAMIS_DEFAULT_PARAMS.countryCode;
    }

    const url = `${KAMIS_API_BASE_URL}?${new URLSearchParams(params).toString()}`;
    const raw = await fetchWithHttps(url);
    const json = JSON.parse(raw) as unknown;
    const picked = pickLatest(extractRows(json));
    if (!picked) return null;

    const unitLabel =
        ingredient.unitSize && ingredient.unit
            ? `${ingredient.unitSize}${ingredient.unit}`
            : ingredient.unit || '단위';

    return {
        id: ingredient.id,
        name: ingredient.displayName,
        price: picked.price,
        unit: unitLabel,
        change: picked.change,
        changeRate: picked.changeRate,
        date: picked.date,
        kindName: ingredient.kindName,
        categoryName: ingredient.categoryName,
        source: channel,
    };
}

async function fetchCuratedItemPrice(ingredient: CuratedIngredient): Promise<CuratedPriceItem | null> {
    try {
        if (ingredient.channel === 'wholesale') {
            return await fetchChannelPrice(ingredient, 'wholesale');
        }
        const retail = await fetchChannelPrice(ingredient, 'retail');
        if (retail) return retail;
        return await fetchChannelPrice(ingredient, 'wholesale');
    } catch (error) {
        logger.warn('큐레이션 품목 가격 조회 실패', {
            id: ingredient.id,
            error: error instanceof Error ? error.message : error,
        });
        return null;
    }
}

function normalize(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '');
}

function matchesQuery(ingredient: CuratedIngredient, query: string): boolean {
    const q = normalize(query);
    if (!q) return true;
    const haystack = [ingredient.displayName, ingredient.itemName, ingredient.kindName, ...ingredient.aliases]
        .map(normalize)
        .join('|');
    return haystack.includes(q) || ingredient.aliases.some((alias) => normalize(alias) === q);
}

/**
 * 큐레이션 전체 스냅샷 (6시간 캐시)
 */
export async function getCuratedPriceSnapshot(): Promise<{
    data: CuratedPriceItem[];
    date: string;
    cached: boolean;
}> {
    const cacheKey = 'kamis:curated-snapshot:v1';
    const cached = cache.get<CuratedPriceItem[]>(cacheKey);
    if (cached) {
        return { data: cached, date: formatDateYmd(new Date()), cached: true };
    }

    const cert = getCertParams();
    if (!cert) {
        return { data: [], date: formatDateYmd(new Date()), cached: false };
    }

    const results = await Promise.all(CURATED_INGREDIENTS.map((item) => fetchCuratedItemPrice(item)));
    const data = results.filter((item): item is CuratedPriceItem => item !== null);
    cache.set(cacheKey, data, CACHE_TTL.KAMIS_CURATED);

    return { data, date: formatDateYmd(new Date()), cached: false };
}

export async function searchCuratedPrices(query: string): Promise<{
    data: CuratedPriceItem[];
    date: string;
    message?: string;
}> {
    const snapshot = await getCuratedPriceSnapshot();
    const q = query.trim();
    const data = q
        ? snapshot.data.filter((item) => {
              const meta = CURATED_INGREDIENTS.find((c) => c.id === item.id);
              return meta ? matchesQuery(meta, q) : normalize(item.name).includes(normalize(q));
          })
        : snapshot.data;

    return {
        data,
        date: snapshot.date,
        message:
            data.length === 0
                ? '등록된 주요 식재료에서 일치하는 항목이 없습니다.'
                : undefined,
    };
}

export function getCuratedDisclaimer(): string {
    return 'KAMIS 공시 시세(참고용)입니다. 마트·온라인 판매가와 다를 수 있습니다.';
}
