/**
 * KAMIS API 헬퍼 함수
 * KAMIS API 호출 및 파싱 로직
 */

const https = require("https");
const { MAX_INGREDIENT_ITEMS, MAIN_INGREDIENTS } = require("../../constants/kamis");
const logger = require("../logger");
const isDev = process.env.NODE_ENV !== 'production';

function fetchWithHttps(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
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

async function fetchKamisAPI(url) {
    try {
        const rawBody = await fetchWithHttps(url);
        const jsonData = JSON.parse(rawBody);

        if (jsonData.data && Array.isArray(jsonData.data)) {
            const items = jsonData.data;

            const filteredItems = items
                .filter(item => {
                    const itemName = item.item_name || item.prdlstNm || item.itemName || '';
                    return MAIN_INGREDIENTS.some(ing => itemName.includes(ing));
                })
                .slice(0, MAX_INGREDIENT_ITEMS)
                .map(item => ({
                    name: item.item_name || item.prdlstNm || item.itemName || '알 수 없음',
                    price: Number(item.dpr1 || item.price || item.amtdprc || 0),
                    unit: item.unit || item.stdUnit || item.stdUnitNew || 'kg',
                    change: Number(item.dpr2 || item.prcFlcAmt || item.change || 0),
                    changeRate: Number(item.dpr3 || item.prcFlcRt || item.changeRate || 0)
                }));

            if (filteredItems.length > 0) {
                return filteredItems;
            }
            return getMockData();
        }

        if (jsonData.price) {
            return parseAlternativeFormat(jsonData);
        }

        if (isDev) {
            logger.warn("KAMIS API 응답 형식이 예상과 다릅니다:", { jsonData });
        }
        return getMockData();
    } catch (error) {
        if (isDev) {
            logger.error("KAMIS API 호출/파싱 오류:", { error });
        }
        return getMockData();
    }
}

function parseAlternativeFormat(jsonData) {
    try {
        if (jsonData.price && Array.isArray(jsonData.price)) {
            return jsonData.price.slice(0, MAX_INGREDIENT_ITEMS).map(item => ({
                name: item.item_name || item.name || '알 수 없음',
                price: Number(item.dpr1 || item.price || 0),
                unit: item.unit || 'kg',
                change: Number(item.dpr2 || item.change || 0),
                changeRate: Number(item.dpr3 || item.changeRate || 0)
            }));
        }
    } catch (error) {
        if (isDev) {
            logger.error("대체 형식 파싱 오류:", { error });
        }
    }
    
    return getMockData();
}

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function getMockData() {
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

module.exports = {
    fetchKamisAPI,
    getTodayDateString,
    getMockData,
};

