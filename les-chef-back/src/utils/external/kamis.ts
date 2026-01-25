/**
 * KAMIS API 헬퍼 함수
 * KAMIS API 호출 및 파싱 로직
 */

import https from "https";
import { MAX_INGREDIENT_ITEMS, MAIN_INGREDIENTS, PRICE_DIRECTION } from "../../constants/kamis/kamis";
import logger from "../system/logger";

/**
 * 쉼표가 포함된 가격 문자열을 숫자로 변환하는 헬퍼 함수
 * @param priceStr - 쉼표가 포함될 수 있는 가격 문자열 (예: "62,505")
 * @returns 변환된 숫자, 변환 실패 시 0
 */
function parsePrice(priceStr: string | undefined): number {
    if (!priceStr) return 0;
    // 쉼표 제거 후 숫자로 변환
    const cleaned = String(priceStr).replace(/,/g, '');
    const parsed = Number(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

interface KamisItem {
    name: string;
    price: number;
    unit: string;
    change: number;
    changeRate: number;
    date?: string;
}

// KAMIS API 최근일자 도·소매가격정보 응답 필드
interface KamisPriceItem {
    condition?: string;
    price?: string;
    product_cls_code?: string; // 01:소매, 02:도매
    product_cls_name?: string;
    category_code?: string;
    category_name?: string;
    productno?: string;
    lastest_date?: string;
    productName?: string;
    item_name?: string;
    unit?: string;
    day1?: string; // 최근 조사일자
    dpr1?: string; // 최근 조사일자 가격
    day2?: string; // 1일전 일자
    dpr2?: string; // 1일전 가격
    day3?: string; // 1개월전 일자
    dpr3?: string; // 1개월전 가격
    day4?: string; // 1년전 일자
    dpr4?: string; // 1년전 가격
    direction?: string; // 0:가격하락 1:가격상승 2:등락없음
    value?: string; // 등락율
    result_code?: string;
}

interface KamisResponse {
    data?: KamisPriceItem[];
    price?: KamisPriceItem[];
    [key: string]: unknown;
}

/**
 * HTTPS를 통한 KAMIS API 호출
 * Node.js의 https 모듈을 사용하여 외부 API에 요청을 보내고 응답을 문자열로 반환
 * @param url - 호출할 KAMIS API URL
 * @returns API 응답 본문 (문자열)
 * @throws HTTP 상태 코드가 200-299 범위가 아닌 경우 에러 발생
 */
function fetchWithHttps(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk: Buffer) => {
                data += chunk.toString();
            });

            response.on('end', () => {
                if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`KAMIS API 응답 코드: ${response.statusCode}`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

/**
 * 주요 식재료 목록에 포함되는지 필터링
 * @param item - KAMIS API 응답 아이템
 * @returns 주요 식재료에 포함되면 true
 */
function isMainIngredient(item: KamisPriceItem): boolean {
    const itemName = item.productName || item.item_name || '';
    return MAIN_INGREDIENTS.some(ing => itemName.includes(ing));
}

/**
 * 가격 변동 계산
 * 
 * 1개월전 가격과 1년전 가격을 비교하여 가격 변동액을 계산합니다.
 * 
 * 계산식: currentPrice - previousPrice
 * 
 * 반환값 의미:
 * - 양수: 가격 상승 (1개월전 가격이 1년전보다 높음)
 * - 음수: 가격 하락 (1개월전 가격이 1년전보다 낮음)
 * - 0: 가격 변동 없음
 * 
 * @param currentPrice - 현재 가격으로 사용할 가격 (dpr3: 1개월전 가격)
 * @param previousPrice - 비교 기준 가격 (dpr4: 1년전 가격)
 * @returns 가격 변동액 (양수: 상승, 음수: 하락, 0: 변동없음)
 */
function calculatePriceChange(currentPrice: number, previousPrice: number): number {
    return currentPrice - previousPrice;
}

/**
 * 등락율 계산 (방향에 따라 부호 결정)
 * 
 * KAMIS API의 value 필드는 절댓값만 제공하므로, direction 필드를 사용하여
 * 실제 가격 변동 방향(상승/하락)에 맞는 부호를 적용합니다.
 * 
 * 예시:
 * - direction이 '0' (하락)이고 value가 '2.5'인 경우 → -2.5 반환
 * - direction이 '1' (상승)이고 value가 '2.5'인 경우 → 2.5 반환
 * - direction이 '2' (등락없음)인 경우 → 0 반환
 * 
 * @param changeRate - 원본 등락율 값 (절댓값, KAMIS API의 value 필드)
 * @param direction - 가격 변동 방향 (PRICE_DIRECTION.DOWN: '0', UP: '1', SAME: '2')
 * @returns 부호가 적용된 등락율 (음수: 하락, 양수: 상승, 0: 등락없음)
 */
function calculateChangeRate(changeRate: number, direction: string): number {
    if (direction === PRICE_DIRECTION.DOWN) {
        // 가격 하락: 음수로 변환 (예: 2.5 → -2.5)
        return -Math.abs(changeRate);
    } else if (direction === PRICE_DIRECTION.UP) {
        // 가격 상승: 양수로 변환 (예: 2.5 → 2.5)
        return Math.abs(changeRate);
    }
    // 등락 없음: 0 반환
    return 0;
}

/**
 * KAMIS API 응답 아이템을 KamisItem으로 변환
 * 
 * 가격 비교 기준:
 * - currentPrice: dpr3 (1개월전 가격) - 현재 시점에서 비교 가능한 최근 가격
 * - previousPrice: dpr4 (1년전 가격) - 장기 추이를 파악하기 위한 기준 가격
 * - change: 1개월전 대비 1년전 가격 차이 (currentPrice - previousPrice)
 * 
 * 등락율은 API에서 제공하는 value와 direction을 조합하여 계산합니다.
 * 
 * @param item - KAMIS API 응답 아이템
 * @returns 변환된 KamisItem (프론트엔드에서 사용할 형식)
 */
function transformKamisItem(item: KamisPriceItem): KamisItem {
    // 가격 파싱: 쉼표가 포함된 문자열을 숫자로 변환
    // dpr3: 1개월전 가격 (현재 가격으로 사용)
    const currentPrice = parsePrice(item.dpr3);
    // dpr4: 1년전 가격 (비교 기준 가격)
    const previousPrice = parsePrice(item.dpr4);
    // 가격 변동액 계산 (1개월전 대비 1년전 가격 차이)
    const change = calculatePriceChange(currentPrice, previousPrice);
    
    // 등락율 계산: API의 value는 절댓값이므로 direction과 조합하여 부호 결정
    const changeRate = Number(item.value || 0);
    const direction = item.direction || PRICE_DIRECTION.SAME;
    const finalChangeRate = calculateChangeRate(changeRate, direction);
    
    return {
        name: item.productName || item.item_name || '알 수 없음',
        price: currentPrice, // 1개월전 가격을 현재 가격으로 표시
        unit: item.unit || 'kg',
        change: change, // 1개월전 대비 1년전 가격 차이
        changeRate: finalChangeRate, // 방향이 적용된 등락율
        date: item.day1 || item.lastest_date // 최근 조사일자
    };
}

/**
 * KAMIS API 응답 데이터 처리 및 변환
 * @param jsonData - KAMIS API JSON 응답
 * @returns 변환된 KamisItem 배열
 */
function processKamisResponse(jsonData: KamisResponse): KamisItem[] {
    // 최근일자 도·소매가격정보 API 응답 처리
    const items = (jsonData.data || jsonData.price || []) as KamisPriceItem[];

    if (items.length === 0) {
        return [];
    }

    // 주요 식재료 필터링 및 변환
    const filteredItems = items
        .filter(isMainIngredient)
        .slice(0, MAX_INGREDIENT_ITEMS)
        .map(transformKamisItem);

    return filteredItems;
}

/**
 * KAMIS API 호출 및 데이터 처리
 * @param url - KAMIS API URL
 * @returns 변환된 식재료 가격 정보 배열
 */
export async function fetchKamisAPI(url: string): Promise<KamisItem[]> {
    try {
        // API 호출 및 JSON 파싱
        const rawBody = await fetchWithHttps(url);
        const jsonData = JSON.parse(rawBody) as KamisResponse;

        // 응답 데이터 처리 및 변환
        const filteredItems = processKamisResponse(jsonData);

        if (filteredItems.length > 0) {
            return filteredItems;
        }

        // 필터링된 데이터가 없는 경우 경고 로그
        const items = (jsonData.data || jsonData.price || []) as KamisPriceItem[];
        logger.warn("KAMIS API 응답 형식이 예상과 다르거나 필터링된 데이터가 없습니다:", { 
            dataLength: items.length,
            sampleItem: items[0] 
        });
        
        return getMockData();
    } catch (error) {
        logger.error("KAMIS API 호출/파싱 오류", { error });
        return getMockData();
    }
}


/**
 * 오늘 날짜를 YYYYMMDD 형식의 문자열로 반환
 * KAMIS API 요청 시 날짜 파라미터로 사용
 * @returns YYYYMMDD 형식의 날짜 문자열 (예: "20260123")
 */
export function getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    // 월은 0부터 시작하므로 +1 필요
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

/**
 * KAMIS API 호출 실패 시 사용할 목업 데이터
 * 개발 및 테스트 환경에서 API 오류 발생 시 대체 데이터로 사용
 * @returns 하드코딩된 식재료 가격 정보 배열
 */
export function getMockData(): KamisItem[] {
    const baseDate = getTodayDateString();
    
    return [
        { name: '쌀', price: 18000, unit: '20kg', change: -500, changeRate: -2.7, date: baseDate },
        { name: '돼지고기', price: 8500, unit: '100g', change: 200, changeRate: 2.4, date: baseDate },
        { name: '닭고기', price: 3200, unit: '100g', change: -100, changeRate: -3.0, date: baseDate },
        { name: '계란', price: 8500, unit: '30개', change: 0, changeRate: 0, date: baseDate },
        { name: '소고기', price: 15000, unit: '100g', change: 500, changeRate: 3.4, date: baseDate },
        { name: '양파', price: 2500, unit: '1kg', change: -300, changeRate: -10.7, date: baseDate },
        { name: '마늘', price: 8000, unit: '1kg', change: 500, changeRate: 6.7, date: baseDate },
        { name: '배추', price: 3500, unit: '1포기', change: -200, changeRate: -5.4, date: baseDate }
    ];
}

