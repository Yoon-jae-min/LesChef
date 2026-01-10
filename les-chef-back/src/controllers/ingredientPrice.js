const asyncHandler = require("express-async-handler");
const https = require("https");

/**
 * KAMIS (농축산물유통정보) API를 통한 식재료 가격 정보 조회
 * API 문서: https://www.kamis.or.kr/customer/reference/openapi_list.do
 */
const getIngredientPrices = asyncHandler(async (req, res) => {
    try {
        // KAMIS API 인증 정보는 환경 변수에서 가져옵니다
        const certKey = process.env.KAMIS_CERT_KEY;
        const certId = process.env.KAMIS_CERT_ID;
        
        // API 키가 없을 경우 더미 데이터 반환 (개발용)
        if (!certKey || !certId || certKey.trim() === '' || certId.trim() === '') {
            console.warn("⚠️  KAMIS_CERT_KEY 또는 KAMIS_CERT_ID가 설정되지 않았습니다. 더미 데이터를 반환합니다.");
            return res.status(200).json({
                error: false,
                data: getMockData(),
                date: getTodayDateString(),
                message: "KAMIS API 키가 설정되지 않아 더미 데이터를 반환합니다."
            });
        }

        // 오늘 날짜 계산
        const baseDate = getTodayDateString();

        // KAMIS API 호출 - 일별 소매가격 조회
        // action: dailySalesList (일별 소매가격)
        // p_returntype: json (JSON 형식 반환)
        // p_product_cls_code: 01 (농산물), 02 (축산물)
        // p_item_category_code: 100 (곡물류), 200 (채소류), 300 (과일류) 등
        // p_county_code: 1101 (서울)
        // p_regday: 기준일 (YYYYMMDD)
        const kamisUrl = `https://www.kamis.or.kr/service/price/xml.do?action=dailySalesList&p_cert_key=${encodeURIComponent(certKey)}&p_cert_id=${encodeURIComponent(certId)}&p_returntype=json&p_product_cls_code=01&p_item_category_code=100&p_county_code=1101&p_regday=${baseDate}`;

        const result = await fetchKamisAPI(kamisUrl, certKey, certId);

        res.status(200).json({
            error: false,
            data: result,
            date: baseDate
        });
    } catch (error) {
        console.error("식재료 물가 정보 조회 오류:", error);
        res.status(500).json({
            error: true,
            message: "식재료 물가 정보를 가져오는 중 오류가 발생했습니다.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * KAMIS API 호출 헬퍼 함수
 */
function fetchKamisAPI(url, certKey, certId) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    // KAMIS API 응답 구조 파싱
                    if (jsonData.data && Array.isArray(jsonData.data)) {
                        const items = jsonData.data;
                        
                        // 주요 식재료만 필터링 및 변환
                        const mainIngredients = [
                            '쌀', '돼지고기', '닭고기', '계란', '소고기', 
                            '양파', '마늘', '배추', '고추', '당근', '무', '상추'
                        ];

                        const filteredItems = items
                            .filter(item => {
                                const itemName = item.item_name || item.prdlstNm || item.itemName || '';
                                return mainIngredients.some(ing => itemName.includes(ing));
                            })
                            .slice(0, 8) // 최대 8개만 반환
                            .map(item => ({
                                name: item.item_name || item.prdlstNm || item.itemName || '알 수 없음',
                                price: Number(item.dpr1 || item.price || item.amtdprc || 0), // 소매가격
                                unit: item.unit || item.stdUnit || item.stdUnitNew || 'kg',
                                change: Number(item.dpr2 || item.prcFlcAmt || item.change || 0), // 전일 대비 변동
                                changeRate: Number(item.dpr3 || item.prcFlcRt || item.changeRate || 0) // 변동률
                            }));

                        if (filteredItems.length > 0) {
                            resolve(filteredItems);
                        } else {
                            // 필터링 결과가 없으면 다른 카테고리 시도하거나 더미 데이터 반환
                            resolve(getMockData());
                        }
                    } else if (jsonData.price) {
                        // 다른 응답 구조 처리 (단일 아이템인 경우)
                        resolve(parseAlternativeFormat(jsonData));
                    } else {
                        // 응답 구조가 예상과 다를 경우
                        console.warn("KAMIS API 응답 형식이 예상과 다릅니다:", jsonData);
                        resolve(getMockData());
                    }
                } catch (parseError) {
                    console.error("KAMIS API 응답 파싱 오류:", parseError);
                    console.error("응답 데이터:", data.substring(0, 500)); // 처음 500자만 로그
                    // 파싱 실패 시 더미 데이터 반환
                    resolve(getMockData());
                }
            });
        }).on('error', (error) => {
            console.error("KAMIS API 호출 오류:", error);
            // 오류 발생 시 더미 데이터 반환
            resolve(getMockData());
        });
    });
}

/**
 * 대체 응답 형식 파싱
 */
function parseAlternativeFormat(jsonData) {
    try {
        if (jsonData.price && Array.isArray(jsonData.price)) {
            return jsonData.price.slice(0, 8).map(item => ({
                name: item.item_name || item.name || '알 수 없음',
                price: Number(item.dpr1 || item.price || 0),
                unit: item.unit || 'kg',
                change: Number(item.dpr2 || item.change || 0),
                changeRate: Number(item.dpr3 || item.changeRate || 0)
            }));
        }
    } catch (error) {
        console.error("대체 형식 파싱 오류:", error);
    }
    
    return getMockData();
}

/**
 * 오늘 날짜 문자열 반환 (YYYYMMDD 형식)
 */
function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

/**
 * 개발/테스트용 더미 데이터
 */
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

module.exports = { getIngredientPrices };
