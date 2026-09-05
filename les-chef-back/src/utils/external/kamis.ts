/**
 * KAMIS API 헬퍼
 * #15 productInfo (품목·등급 코드표) + #17 periodRetailProductList (소매가)
 */

import https from 'https';
import {
    CACHE_TTL,
    KAMIS_DEFAULT_PARAMS,
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

function extractItemArray(jsonData: unknown): unknown[] {
    if (!jsonData || typeof jsonData !== 'object') return [];
    const root = jsonData as Record<string, unknown>;

    const data = root.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
        const nested = data as Record<string, unknown>;
        if (Array.isArray(nested.item)) return nested.item;
        if (nested.item && typeof nested.item === 'object') return [nested.item];
    }

    if (Array.isArray(root.item)) return root.item;
    if (Array.isArray(root.price)) return root.price;
    return [];
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

function toProductCode(row: KamisProductInfoRow): KamisProductCode | null {
    const itemCode = (row.itemcode || '').trim();
    const itemName = (row.itemname || '').trim();
    if (!itemCode || !itemName) return null;

    return {
        categoryCode: (row.itemcategorycode || '').trim(),
        categoryName: (row.itemcategoryname || '').trim(),
        itemCode,
        itemName,
        kindCode: (row.kindcode || '').trim() || '00',
        kindName: (row.kindname || '').trim(),
        retailUnit: (row.retail_unit || row.wholesale_unit || '단위').trim(),
        retailUnitSize: (row.retail_unitsize || row.wholesale_unitsize || '').trim(),
        retailRankCode: (row.retail_productrankcode || '04').trim() || '04',
    };
}

/**
 * #15 품목·등급 코드표 조회 (캐시 24시간)
 */
export async function fetchProductCatalog(): Promise<KamisProductCode[]> {
    const cacheKey = 'kamis:productInfo';
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
        const catalog = rows
            .map(toProductCode)
            .filter((item): item is KamisProductCode => item !== null);

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

/**
 * 이름(품목/품종)으로 코드표 검색
 */
export async function searchProductCodes(query: string): Promise<KamisProductCode[]> {
    const q = normalizeText(query);
    if (!q) return [];

    const catalog = await fetchProductCatalog();
    const scored = catalog
        .map((item) => {
            const itemName = normalizeText(item.itemName);
            const kindName = normalizeText(item.kindName);
            const haystack = `${itemName}${kindName}`;
            let score = 0;
            if (itemName === q) score = 100;
            else if (itemName.startsWith(q)) score = 80;
            else if (itemName.includes(q)) score = 60;
            else if (kindName.includes(q)) score = 40;
            else if (haystack.includes(q)) score = 20;
            return { item, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);

    // 같은 품목코드는 품종별로 남기되, 상위 N개만
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

function getRetailDateRange(): { start: string; end: string } {
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

/**
 * #17 일별 품목별 소매 가격 조회
 */
export async function fetchRetailPriceForProduct(
    product: KamisProductCode
): Promise<KamisItem | null> {
    const cert = getCertParams();
    if (!cert) return null;

    const { start, end } = getRetailDateRange();
    const cacheKey = [
        'kamis:retail',
        product.itemCode,
        product.kindCode,
        product.retailRankCode,
        end,
    ].join(':');

    const cached = cache.get<KamisItem>(cacheKey);
    if (cached) return cached;

    try {
        const params: Record<string, string> = {
            p_cert_key: cert.certKey,
            p_cert_id: cert.certId,
            p_returntype: 'json',
            p_startday: start,
            p_endday: end,
            p_itemcategorycode: product.categoryCode,
            p_itemcode: product.itemCode,
            p_kindcode: product.kindCode,
            p_productrankcode: product.retailRankCode,
            p_countrycode: KAMIS_DEFAULT_PARAMS.countryCode,
            p_convert_kg_yn: KAMIS_DEFAULT_PARAMS.convertKgYn,
        };

        const url = buildUrl('periodRetailProductList', params);
        const rawBody = await fetchWithHttps(url);
        const jsonData = JSON.parse(rawBody) as unknown;
        const rows = extractItemArray(jsonData) as KamisRetailPriceRow[];

        // 평균 우선, 없으면 서울/첫 유효 가격
        const priced = rows
            .map((row) => {
                const price = parsePrice(row.price);
                const date =
                    row.yyyy && row.regday
                        ? `${row.yyyy}-${String(row.regday).replace(/\./g, '-')}`
                        : row.regday || '';
                return {
                    price,
                    date,
                    county: row.countyname || '',
                    kindName: row.kindname || product.kindName,
                    itemName: row.itemname || product.itemName,
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

        const item: KamisItem = {
            name: displayName(product),
            price: latest.price,
            unit: unitLabel(product),
            change,
            changeRate,
            date: latest.date,
            kindName: latest.kindName,
            categoryName: product.categoryName,
        };

        cache.set(cacheKey, item, CACHE_TTL.KAMIS_API);
        return item;
    } catch (error) {
        logger.error('KAMIS periodRetailProductList 호출 실패', {
            error,
            itemCode: product.itemCode,
            itemName: product.itemName,
        });
        return null;
    }
}

/**
 * 식재료 이름 검색 → 코드 매칭 → 소매가 조회
 */
export async function searchIngredientPrices(query: string): Promise<KamisItem[]> {
    const products = await searchProductCodes(query);
    if (products.length === 0) return [];

    const cert = getCertParams();
    if (!cert) {
        const q = normalizeText(query);
        return getMockData().filter((item) => normalizeText(item.name).includes(q));
    }

    const results = await Promise.all(products.map((product) => fetchRetailPriceForProduct(product)));
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
