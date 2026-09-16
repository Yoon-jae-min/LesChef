/**
 * KAMIS API 헬퍼
 * #15 productInfo + #17 periodRetailProductList (+ #16 periodProductList 폴백)
 */

import https from 'https';
import {
    CACHE_TTL,
    KAMIS_DEFAULT_PARAMS,
    KAMIS_SEARCH_ALIASES,
    MAX_SEARCH_PRICE_ITEMS,
} from '../../constants';
import cache from '../system/cache';
import logger from '../system/logger';

const KAMIS_API_BASE_URL =
    process.env.KAMIS_API_BASE_URL || 'https://www.kamis.or.kr/service/price/xml.do';

export interface KamisItem {
    name: string;
    price: number;
    unit: string;
    change: number;
    changeRate: number;
    date?: string;
    kindName?: string;
    categoryName?: string;
    /** 소매(#17) 우선, 없으면 도매(#16) 폴백 */
    source?: 'retail' | 'wholesale';
}

export interface KamisProductCode {
    categoryCode: string;
    categoryName: string;
    itemCode: string;
    itemName: string;
    kindCode: string;
    kindName: string;
    retailUnit: string;
    retailUnitSize: string;
    retailRankCode: string;
}

interface KamisProductInfoRow {
    itemcategorycode?: string;
    itemcategoryname?: string;
    itemcode?: string;
    itemname?: string;
    kindcode?: string;
    kindname?: string;
    retail_unit?: string;
    retail_unitsize?: string;
    retail_productrankcode?: string;
    wholesale_unit?: string;
    wholesale_unitsize?: string;
    whole_productrankcode?: string;
}

interface KamisRetailPriceRow {
    itemname?: string;
    kindname?: string;
    countyname?: string;
    marketname?: string;
    yyyy?: string;
    regday?: string;
    price?: string;
}

function parsePrice(priceStr: string | undefined): number {
    if (!priceStr) return 0;
    const cleaned = String(priceStr).replace(/,/g, '').trim();
    if (!cleaned || cleaned === '-' || cleaned === '–') return 0;
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeText(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '');
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
        req.setTimeout(20000, () => {
            req.destroy(new Error('KAMIS API 요청 시간 초과'));
        });
    });
}

function normalizeUnitField(value: unknown): string {
    if (Array.isArray(value)) return '';
    return String(value ?? '').trim();
}

function extractItemArray(jsonData: unknown): unknown[] {
    if (!jsonData || typeof jsonData !== 'object') return [];
    const root = jsonData as Record<string, unknown>;

    if (Array.isArray(root.info)) return root.info;

    const data = root.data;
    if (Array.isArray(data)) {
        if (data.length > 0 && data[0] && typeof data[0] === 'object') {
            const first = data[0] as Record<string, unknown>;
            if (Array.isArray(first.item)) return first.item;
        }
        return data;
    }
    if (data && typeof data === 'object') {
        const nested = data as Record<string, unknown>;
        if (Array.isArray(nested.item)) return nested.item;
        if (nested.item && typeof nested.item === 'object') return [nested.item];
    }

    if (Array.isArray(root.item)) return root.item;
    if (Array.isArray(root.price)) return root.price;
    return [];
}

function formatRetailDate(yyyy?: string, regday?: string): string {
    if (!regday) return '';
    const dayPart = String(regday).replace(/[./]/g, '-');
    if (!yyyy) return dayPart;
    return `${yyyy}-${dayPart}`;
}

function getCertParams(): { certKey: string; certId: string } | null {
    const certKey = process.env.KAMIS_CERT_KEY?.trim() || '';
    const certId = process.env.KAMIS_CERT_ID?.trim() || '';
    if (!certKey || !certId) return null;
    return { certKey, certId };
}

function buildUrl(action: string, params: Record<string, string>): string {
    const search = new URLSearchParams({ action, ...params });
    return `${KAMIS_API_BASE_URL}?${search.toString()}`;
}

function splitRankCodes(raw: string, fallback: string[] = ['04', '05']): string[] {
    const codes = [
        ...new Set(
            raw
                .split(',')
                .map((code) => code.trim())
                .filter(Boolean)
        ),
    ];
    return codes.length > 0 ? codes : fallback;
}

function toProductCodes(row: KamisProductInfoRow): KamisProductCode[] {
    const itemCode = (row.itemcode || '').trim();
    const itemName = (row.itemname || '').trim();
    if (!itemCode || !itemName) return [];

    const retailRankRaw = normalizeUnitField(row.retail_productrankcode);
    const wholesaleRankRaw = normalizeUnitField(row.whole_productrankcode);
    // 소매 등급이 없어도 도매 등급/기본값으로 조회 후보에 포함
    const rankCodes = splitRankCodes(retailRankRaw || wholesaleRankRaw);

    const retailUnit = normalizeUnitField(row.retail_unit);
    const retailUnitSize = normalizeUnitField(row.retail_unitsize);
    const wholesaleUnit = normalizeUnitField(row.wholesale_unit);
    const wholesaleUnitSize = normalizeUnitField(row.wholesale_unitsize);
    const unit = retailUnit || wholesaleUnit || 'kg';
    const unitSize = retailUnitSize || wholesaleUnitSize;

    const base = {
        categoryCode: (row.itemcategorycode || '').trim(),
        categoryName: (row.itemcategoryname || '').trim(),
        itemCode,
        itemName,
        kindCode: (row.kindcode || '').trim() || '00',
        kindName: (row.kindname || '').trim(),
        retailUnit: unit,
        retailUnitSize: unitSize,
    };

    return rankCodes.map((retailRankCode) => ({
        ...base,
        retailRankCode,
    }));
}

/**
 * #15 품목·등급 코드표 조회 (캐시 24시간)
 */
export async function fetchProductCatalog(): Promise<KamisProductCode[]> {
    const cacheKey = 'kamis:productInfo:v2';
    const cached = cache.get<KamisProductCode[]>(cacheKey);
    if (cached) return cached;

    const cert = getCertParams();
    if (!cert) {
        logger.warn('KAMIS 인증키가 없어 목업 품목 코드표를 사용합니다.');
        return getMockCatalog();
    }

    try {
        const url = buildUrl('productInfo', {
            p_cert_key: cert.certKey,
            p_cert_id: cert.certId,
            p_returntype: 'json',
        });
        const rawBody = await fetchWithHttps(url);
        const jsonData = JSON.parse(rawBody) as unknown;
        const rows = extractItemArray(jsonData) as KamisProductInfoRow[];
        const catalog = rows.flatMap(toProductCodes);

        if (catalog.length === 0) {
            logger.warn('KAMIS productInfo 결과가 비어 목업 코드표를 사용합니다.');
            return getMockCatalog();
        }

        cache.set(cacheKey, catalog, CACHE_TTL.KAMIS_PRODUCT_CATALOG);
        return catalog;
    } catch (error) {
        logger.error('KAMIS productInfo 호출 실패', { error });
        return getMockCatalog();
    }
}

function expandSearchTerms(query: string): string[] {
    const q = normalizeText(query);
    if (!q) return [];

    const terms = new Set<string>([q]);
    for (const [alias, targets] of Object.entries(KAMIS_SEARCH_ALIASES)) {
        const aliasNorm = normalizeText(alias);
        const targetNorms = targets.map(normalizeText);
        if (aliasNorm === q || aliasNorm.includes(q) || q.includes(aliasNorm)) {
            targetNorms.forEach((t) => terms.add(t));
        }
        if (targetNorms.some((t) => t === q || t.includes(q) || q.includes(t))) {
            terms.add(aliasNorm);
            targetNorms.forEach((t) => terms.add(t));
        }
    }
    return [...terms];
}

function scoreProductMatch(item: KamisProductCode, terms: string[]): number {
    const itemName = normalizeText(item.itemName);
    const kindName = normalizeText(item.kindName);
    const haystack = `${itemName}${kindName}`;

    let best = 0;
    for (const q of terms) {
        let score = 0;
        if (itemName === q) score = 100;
        else if (itemName.startsWith(q)) score = 80;
        else if (itemName.includes(q)) score = 60;
        else if (kindName.includes(q)) score = 40;
        else if (haystack.includes(q)) score = 20;
        if (score > best) best = score;
    }
    return best;
}

/**
 * 이름(품목/품종)으로 코드표 검색
 */
export async function searchProductCodes(query: string): Promise<KamisProductCode[]> {
    const terms = expandSearchTerms(query);
    if (terms.length === 0) return [];

    const catalog = await fetchProductCatalog();
    const scored = catalog
        .map((item) => ({ item, score: scoreProductMatch(item, terms) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);

    const seen = new Set<string>();
    const unique: KamisProductCode[] = [];
    for (const entry of scored) {
        const key = `${entry.item.itemCode}:${entry.item.kindCode}:${entry.item.retailRankCode}`;
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(entry.item);
        if (unique.length >= MAX_SEARCH_PRICE_ITEMS) break;
    }
    return unique;
}

function formatDateYmd(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getLookupDateRange(): { start: string; end: string } {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (KAMIS_DEFAULT_PARAMS.retailLookupDays - 1));
    return { start: formatDateYmd(start), end: formatDateYmd(end) };
}

function unitLabel(product: KamisProductCode): string {
    if (product.retailUnitSize && product.retailUnit) {
        return `${product.retailUnitSize}${product.retailUnit}`;
    }
    return product.retailUnit || '단위';
}

function displayName(product: KamisProductCode): string {
    if (product.kindName && product.kindName !== product.itemName) {
        return `${product.itemName} (${product.kindName})`;
    }
    return product.itemName;
}

function pickLatestPrice(rows: KamisRetailPriceRow[], product: KamisProductCode): KamisItem | null {
    const priced = rows
        .map((row) => {
            const price = parsePrice(row.price);
            const date = formatRetailDate(row.yyyy, row.regday);
            return {
                price,
                date,
                county: row.countyname || '',
                kindName: row.kindname || product.kindName,
            };
        })
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

    return {
        name: displayName(product),
        price: latest.price,
        unit: unitLabel(product),
        change,
        changeRate,
        date: latest.date,
        kindName: latest.kindName,
        categoryName: product.categoryName,
    };
}

async function fetchPeriodPriceRows(
    action: 'periodRetailProductList' | 'periodProductList',
    product: KamisProductCode,
    options: { rankCode: string; withCountry: boolean }
): Promise<KamisRetailPriceRow[]> {
    const cert = getCertParams();
    if (!cert) return [];

    const { start, end } = getLookupDateRange();
    const params: Record<string, string> = {
        p_cert_key: cert.certKey,
        p_cert_id: cert.certId,
        p_returntype: 'json',
        p_startday: start,
        p_endday: end,
        p_itemcategorycode: product.categoryCode,
        p_itemcode: product.itemCode,
        p_kindcode: product.kindCode,
        p_productrankcode: options.rankCode,
        p_convert_kg_yn: KAMIS_DEFAULT_PARAMS.convertKgYn,
    };
    if (options.withCountry) {
        params.p_countrycode = KAMIS_DEFAULT_PARAMS.countryCode;
    }

    const url = buildUrl(action, params);
    const rawBody = await fetchWithHttps(url);
    const jsonData = JSON.parse(rawBody) as unknown;
    return extractItemArray(jsonData) as KamisRetailPriceRow[];
}

function rankCandidates(product: KamisProductCode): string[] {
    return [
        ...new Set(
            [product.retailRankCode, '04', '05', '00', '01'].filter((code) => Boolean(code))
        ),
    ];
}

/**
 * #17 소매 우선 → 지역 완화 → #16 도매 폴백
 */
export async function fetchRetailPriceForProduct(
    product: KamisProductCode
): Promise<KamisItem | null> {
    const cert = getCertParams();
    if (!cert) return null;

    const { end } = getLookupDateRange();
    const cacheKey = [
        'kamis:price:v2',
        product.itemCode,
        product.kindCode,
        product.retailRankCode,
        end,
    ].join(':');

    const cached = cache.get<KamisItem>(cacheKey);
    if (cached) return cached;

    try {
        const ranks = rankCandidates(product);

        for (const rankCode of ranks) {
            const retailRows = await fetchPeriodPriceRows('periodRetailProductList', product, {
                rankCode,
                withCountry: true,
            });
            const retail = pickLatestPrice(retailRows, product);
            if (retail) {
                const item = { ...retail, source: 'retail' as const };
                cache.set(cacheKey, item, CACHE_TTL.KAMIS_API);
                return item;
            }
        }

        for (const rankCode of ranks) {
            const retailAll = await fetchPeriodPriceRows('periodRetailProductList', product, {
                rankCode,
                withCountry: false,
            });
            const retail = pickLatestPrice(retailAll, product);
            if (retail) {
                const item = { ...retail, source: 'retail' as const };
                cache.set(cacheKey, item, CACHE_TTL.KAMIS_API);
                return item;
            }
        }

        for (const rankCode of ranks) {
            const wholesaleRows = await fetchPeriodPriceRows('periodProductList', product, {
                rankCode,
                withCountry: false,
            });
            const wholesale = pickLatestPrice(wholesaleRows, product);
            if (wholesale) {
                const item = {
                    ...wholesale,
                    source: 'wholesale' as const,
                    name: `${wholesale.name} (도매시세)`,
                };
                cache.set(cacheKey, item, CACHE_TTL.KAMIS_API);
                return item;
            }
        }

        return null;
    } catch (error) {
        logger.error('KAMIS 가격 조회 실패', {
            error,
            itemCode: product.itemCode,
            itemName: product.itemName,
        });
        return null;
    }
}

/**
 * 식재료 이름 검색 → 코드 매칭 → 소매가(없으면 도매) 조회
 */
export async function searchIngredientPrices(
    query: string,
    matchedProducts?: KamisProductCode[]
): Promise<KamisItem[]> {
    const products = matchedProducts ?? (await searchProductCodes(query));
    if (products.length === 0) return [];

    const cert = getCertParams();
    if (!cert) {
        const q = normalizeText(query);
        return getMockData().filter((item) => normalizeText(item.name).includes(q));
    }

    // 같은 품목·품종은 등급만 다른 중복 호출을 줄임 (첫 등급 성공 시 충분)
    const seenKind = new Set<string>();
    const deduped: KamisProductCode[] = [];
    for (const product of products) {
        const key = `${product.itemCode}:${product.kindCode}`;
        if (seenKind.has(key)) continue;
        seenKind.add(key);
        deduped.push(product);
    }

    const results = await Promise.all(deduped.map((product) => fetchRetailPriceForProduct(product)));
    return results.filter((item): item is KamisItem => item !== null);
}

/** @deprecated 기존 호출 호환 — 검색 API만 사용 */
export async function fetchKamisAPI(_url?: string): Promise<KamisItem[]> {
    return getMockData();
}

export function getTodayDateString(): string {
    return formatDateYmd(new Date());
}

function getMockCatalog(): KamisProductCode[] {
    return [
        {
            categoryCode: '100',
            categoryName: '식량작물',
            itemCode: '111',
            itemName: '쌀',
            kindCode: '01',
            kindName: '일반계',
            retailUnit: 'kg',
            retailUnitSize: '20',
            retailRankCode: '04',
        },
        {
            categoryCode: '200',
            categoryName: '채소류',
            itemCode: '151',
            itemName: '고구마',
            kindCode: '00',
            kindName: '밤고구마',
            retailUnit: 'kg',
            retailUnitSize: '1',
            retailRankCode: '04',
        },
        {
            categoryCode: '500',
            categoryName: '축산물',
            itemCode: '411',
            itemName: '계란',
            kindCode: '00',
            kindName: '특란',
            retailUnit: '개',
            retailUnitSize: '10',
            retailRankCode: '04',
        },
        {
            categoryCode: '200',
            categoryName: '채소류',
            itemCode: '245',
            itemName: '양파',
            kindCode: '00',
            kindName: '양파',
            retailUnit: 'kg',
            retailUnitSize: '1',
            retailRankCode: '04',
        },
    ];
}

export function getMockData(): KamisItem[] {
    const baseDate = getTodayDateString();
    return [
        { name: '쌀 (일반계)', price: 18000, unit: '20kg', change: -500, changeRate: -2.7, date: baseDate },
        { name: '돼지고기', price: 8500, unit: '100g', change: 200, changeRate: 2.4, date: baseDate },
        { name: '닭고기', price: 3200, unit: '100g', change: -100, changeRate: -3.0, date: baseDate },
        { name: '계란 (특란)', price: 8500, unit: '30개', change: 0, changeRate: 0, date: baseDate },
        { name: '소고기', price: 15000, unit: '100g', change: 500, changeRate: 3.4, date: baseDate },
        { name: '양파', price: 2500, unit: '1kg', change: -300, changeRate: -10.7, date: baseDate },
        { name: '마늘', price: 8000, unit: '1kg', change: 500, changeRate: 6.7, date: baseDate },
        { name: '배추', price: 3500, unit: '1포기', change: -200, changeRate: -5.4, date: baseDate },
        { name: '고구마 (밤고구마)', price: 4200, unit: '1kg', change: 100, changeRate: 2.4, date: baseDate },
        { name: '감자', price: 2800, unit: '1kg', change: -50, changeRate: -1.8, date: baseDate },
    ];
}
