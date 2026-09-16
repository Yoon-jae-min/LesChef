import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import logger from '../../utils/system/logger';
import {
    getTodayDateString,
    getMockData,
    searchIngredientPrices,
    searchProductCodes,
} from '../../utils/external/kamis';
import {
    getCuratedDisclaimer,
    getCuratedPriceSnapshot,
    getIngredientPriceMode,
    searchCuratedPrices,
} from '../../utils/external/kamisCurated';
import { ApiSuccessResponse, ApiErrorResponse } from '../../types';

const isDev = process.env.NODE_ENV !== 'production';

interface IngredientPriceResponse extends ApiSuccessResponse {
    data: unknown[];
    date: string;
    message?: string;
    query?: string;
    mode?: 'curated' | 'search';
    disclaimer?: string;
}

function hasKamisCredentials(): boolean {
    const certKey = process.env.KAMIS_CERT_KEY?.trim();
    const certId = process.env.KAMIS_CERT_ID?.trim();
    return Boolean(certKey && certId);
}

/**
 * 큐레이션 시세 목록
 * GET /ingredient-price/curated
 */
export const listCuratedIngredientPrices = asyncHandler(
    async (_req: Request, res: Response<IngredientPriceResponse | ApiErrorResponse>) => {
        try {
            if (!hasKamisCredentials()) {
                res.status(200).json({
                    error: false,
                    data: getMockData(),
                    date: getTodayDateString(),
                    mode: 'curated',
                    disclaimer: getCuratedDisclaimer(),
                    message: 'KAMIS API 키가 설정되지 않아 더미 데이터를 반환합니다.',
                });
                return;
            }

            const snapshot = await getCuratedPriceSnapshot();
            res.status(200).json({
                error: false,
                data: snapshot.data,
                date: snapshot.date,
                mode: 'curated',
                disclaimer: getCuratedDisclaimer(),
                message:
                    snapshot.data.length === 0
                        ? '주요 식재료 시세를 불러오지 못했습니다.'
                        : undefined,
            });
        } catch (error) {
            if (isDev) logger.error('큐레이션 시세 조회 오류:', { error });
            const err = error as Error;
            res.status(500).json({
                error: true,
                message: '식재료 시세 조회 중 오류가 발생했습니다.',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined,
            });
        }
    }
);

/**
 * 식재료 검색
 * - curated 모드(기본): 주요 품목 스냅샷에서 필터
 * - search 모드: 기존 KAMIS 자유검색 (INGREDIENT_PRICE_MODE=search)
 * GET /ingredient-price/search?q=고구마
 */
export const searchIngredientPrice = asyncHandler(
    async (req: Request, res: Response<IngredientPriceResponse | ApiErrorResponse>) => {
        try {
            const query = String(req.query.q || req.query.query || '').trim();
            const mode = getIngredientPriceMode();

            if (!query) {
                res.status(400).json({
                    error: true,
                    message: '검색어(q)를 입력해 주세요.',
                });
                return;
            }

            if (!hasKamisCredentials()) {
                const q = query.toLowerCase().replace(/\s+/g, '');
                const data = getMockData().filter((item) =>
                    item.name.toLowerCase().replace(/\s+/g, '').includes(q)
                );
                res.status(200).json({
                    error: false,
                    data,
                    date: getTodayDateString(),
                    query,
                    mode,
                    disclaimer: getCuratedDisclaimer(),
                    message: 'KAMIS API 키가 설정되지 않아 더미 데이터를 반환합니다.',
                });
                return;
            }

            if (mode === 'curated') {
                const result = await searchCuratedPrices(query);
                res.status(200).json({
                    error: false,
                    data: result.data,
                    date: result.date,
                    query,
                    mode: 'curated',
                    disclaimer: getCuratedDisclaimer(),
                    message: result.message,
                });
                return;
            }

            // --- 기존 자유검색 모드 ---
            const matchedCodes = await searchProductCodes(query);
            if (matchedCodes.length === 0) {
                res.status(200).json({
                    error: false,
                    data: [],
                    date: getTodayDateString(),
                    query,
                    mode: 'search',
                    message: '일치하는 품목이 없습니다.',
                });
                return;
            }

            const data = await searchIngredientPrices(query, matchedCodes);
            const usedWholesale = data.some(
                (item) =>
                    typeof item === 'object' &&
                    item !== null &&
                    'source' in item &&
                    (item as { source?: string }).source === 'wholesale'
            );
            res.status(200).json({
                error: false,
                data,
                date: getTodayDateString(),
                query,
                mode: 'search',
                message:
                    data.length === 0
                        ? '품목은 찾았지만 최근 가격 데이터가 없습니다.'
                        : usedWholesale
                          ? '일부 품목은 소매가가 없어 도매시세로 표시합니다.'
                          : undefined,
            });
        } catch (error) {
            if (isDev) {
                logger.error('식재료 가격 검색 오류:', { error });
            }
            const err = error as Error;
            res.status(500).json({
                error: true,
                message: '식재료 가격 검색 중 오류가 발생했습니다.',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined,
            });
        }
    }
);
