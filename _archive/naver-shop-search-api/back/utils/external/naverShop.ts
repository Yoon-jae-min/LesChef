/**
 * 네이버 쇼핑 검색 (식품/음식 상품)
 * https://openapi.naver.com/v1/search/shop.json
 */

import https from 'https';
import logger from '../system/logger';

const NAVER_SHOP_SEARCH_URL = 'https://openapi.naver.com/v1/search/shop.json';

export interface NaverShopItem {
    title: string;
    link: string;
    image: string;
    lprice: number;
    hprice: number;
    mallName: string;
    productId: string;
    productType: string;
    brand: string;
    maker: string;
    category1: string;
    category2: string;
    category3: string;
    category4: string;
}

export interface NaverShopSearchResult {
    query: string;
    total: number;
    start: number;
    display: number;
    items: NaverShopItem[];
}

function getNaverSearchCredentials(): { clientId: string; clientSecret: string } | null {
    // 검색 전용 키가 있으면 우선, 없으면 네아로와 동일 앱 키 사용
    const clientId =
        process.env.NAVER_SEARCH_CLIENT_ID?.trim() ||
        process.env.NAVER_CLIENT_ID?.trim() ||
        '';
    const clientSecret =
        process.env.NAVER_SEARCH_CLIENT_SECRET?.trim() ||
        process.env.NAVER_CLIENT_SECRET?.trim() ||
        '';
    if (!clientId || !clientSecret) return null;
    return { clientId, clientSecret };
}

function stripHtml(value: string): string {
    return value.replace(/<\/?[^>]+(>|$)/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

function fetchJson(url: string, headers: Record<string, string>): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers }, (response) => {
            let data = '';
            response.on('data', (chunk: Buffer) => {
                data += chunk.toString();
            });
            response.on('end', () => {
                if (
                    !response.statusCode ||
                    response.statusCode < 200 ||
                    response.statusCode >= 300
                ) {
                    reject(
                        new Error(
                            `네이버 검색 API 오류 (${response.statusCode}): ${data.slice(0, 200)}`
                        )
                    );
                    return;
                }
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(15000, () => {
            req.destroy(new Error('네이버 검색 API 요청 시간 초과'));
        });
    });
}

interface NaverShopApiResponse {
    total?: number;
    start?: number;
    display?: number;
    items?: Array<{
        title?: string;
        link?: string;
        image?: string;
        lprice?: string;
        hprice?: string;
        mallName?: string;
        productId?: string;
        productType?: string;
        brand?: string;
        maker?: string;
        category1?: string;
        category2?: string;
        category3?: string;
        category4?: string;
    }>;
}

/**
 * 네이버 쇼핑에서 식품/상품 검색
 */
export async function searchNaverShop(
    query: string,
    options?: { display?: number; start?: number; sort?: 'sim' | 'date' | 'asc' | 'dsc' }
): Promise<NaverShopSearchResult> {
    const q = query.trim();
    if (!q) {
        return { query: '', total: 0, start: 1, display: 0, items: [] };
    }

    const creds = getNaverSearchCredentials();
    if (!creds) {
        throw new Error('NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 이 설정되지 않았습니다.');
    }

    const display = Math.min(Math.max(options?.display ?? 10, 1), 100);
    const start = Math.min(Math.max(options?.start ?? 1, 1), 1000);
    const sort = options?.sort ?? 'sim';

    const params = new URLSearchParams({
        query: q,
        display: String(display),
        start: String(start),
        sort,
    });

    const url = `${NAVER_SHOP_SEARCH_URL}?${params.toString()}`;
    const json = (await fetchJson(url, {
        'X-Naver-Client-Id': creds.clientId,
        'X-Naver-Client-Secret': creds.clientSecret,
    })) as NaverShopApiResponse;

    const items: NaverShopItem[] = (json.items || []).map((item) => ({
        title: stripHtml(item.title || ''),
        link: item.link || '',
        image: item.image || '',
        lprice: Number(item.lprice || 0) || 0,
        hprice: Number(item.hprice || 0) || 0,
        mallName: item.mallName || '',
        productId: item.productId || '',
        productType: item.productType || '',
        brand: item.brand || '',
        maker: item.maker || '',
        category1: item.category1 || '',
        category2: item.category2 || '',
        category3: item.category3 || '',
        category4: item.category4 || '',
    }));

    return {
        query: q,
        total: Number(json.total || 0),
        start: Number(json.start || start),
        display: Number(json.display || items.length),
        items,
    };
}

export function hasNaverSearchCredentials(): boolean {
    return getNaverSearchCredentials() !== null;
}

export function logNaverSearchWarningIfNeeded(): void {
    if (!hasNaverSearchCredentials()) {
        logger.warn('네이버 검색 API 키가 없습니다. NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 을 설정하세요.');
    }
}
