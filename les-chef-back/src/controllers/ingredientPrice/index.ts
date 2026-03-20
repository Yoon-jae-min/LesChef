import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { CACHE_TTL } from '../../constants';
import cache from '../../utils/system/cache';
import logger from '../../utils/system/logger';
import { fetchKamisAPI, getTodayDateString, getMockData } from '../../utils/external/kamis';
import { ApiSuccessResponse, ApiErrorResponse } from '../../types';

const isDev = process.env.NODE_ENV !== 'production';

interface IngredientPriceResponse extends ApiSuccessResponse {
    data: unknown[];
    date: string;
    cached?: boolean;
    message?: string;
}

/**
 * KAMIS (농축산물유통정보) API를 통한 식재료 가격 정보 조회
 * API 문서: https://www.kamis.or.kr/customer/reference/openapi_list.do
 */
export const getIngredientPrices = asyncHandler(
    async (_req: Request, res: Response<IngredientPriceResponse | ApiErrorResponse>) => {
        try {
            // KAMIS API 인증 정보는 환경 변수에서 가져옵니다
            const certKey = process.env.KAMIS_CERT_KEY;
            const certId = process.env.KAMIS_CERT_ID;

            // API 키가 없을 경우 더미 데이터 반환 (개발용)
            if (!certKey || !certId || certKey.trim() === '' || certId.trim() === '') {
                if (isDev) {
                    logger.warn(
                        '⚠️  KAMIS_CERT_KEY 또는 KAMIS_CERT_ID가 설정되지 않았습니다. 더미 데이터를 반환합니다.'
                    );
                }
                res.status(200).json({
                    error: false,
                    data: getMockData(),
                    date: getTodayDateString(),
                    message: 'KAMIS API 키가 설정되지 않아 더미 데이터를 반환합니다.',
                });
                return;
            }

            // 오늘 날짜 계산
            const baseDate = getTodayDateString();

            // 캐시 키 생성 (날짜별로 캐싱)
            const cacheKey = `kamis:${baseDate}`;

            // 캐시에서 데이터 확인
            const cachedData = cache.get<unknown[]>(cacheKey);
            if (cachedData) {
                if (isDev) {
                    logger.info('KAMIS API 응답 캐시 사용');
                }
                res.status(200).json({
                    error: false,
                    data: cachedData,
                    date: baseDate,
                    cached: true,
                });
                return;
            }

            // KAMIS API 호출 - 최근일자 도·소매가격정보(상품 기준)
            const KAMIS_API_BASE_URL =
                process.env.KAMIS_API_BASE_URL || 'https://www.kamis.or.kr/service/price/xml.do';
            const kamisUrl = `${KAMIS_API_BASE_URL}?action=dailySalesList&p_cert_key=${encodeURIComponent(certKey)}&p_cert_id=${encodeURIComponent(certId)}&p_returntype=json`;

            const result = await fetchKamisAPI(kamisUrl);

            // 캐시에 저장 (30분 TTL)
            cache.set(cacheKey, result, CACHE_TTL.KAMIS_API);

            res.status(200).json({
                error: false,
                data: result,
                date: baseDate,
                cached: false,
            });
        } catch (error) {
            if (isDev) {
                logger.error('식재료 물가 정보 조회 오류:', { error });
            }
            const err = error as Error;
            res.status(500).json({
                error: true,
                message: '식재료 물가 정보를 가져오는 중 오류가 발생했습니다.',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined,
            });
        }
    }
);
