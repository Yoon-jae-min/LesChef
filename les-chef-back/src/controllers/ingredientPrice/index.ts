import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import logger from '../../utils/system/logger';
import {
    getTodayDateString,
    getMockData,
    searchIngredientPrices,
    searchProductCodes,
} from '../../utils/external/kamis';
import { ApiSuccessResponse, ApiErrorResponse } from '../../types';

const isDev = process.env.NODE_ENV !== 'production';

interface IngredientPriceResponse extends ApiSuccessResponse {
    data: unknown[];
    date: string;
    message?: string;
    query?: string;
}

function hasKamisCredentials(): boolean {
    const certKey = process.env.KAMIS_CERT_KEY?.trim();
    const certId = process.env.KAMIS_CERT_ID?.trim();
    return Boolean(certKey && certId);
}

/**
 * 식재료 이름 검색 → 코드 매칭 → 소매가
 * GET /ingredient-price/search?q=고구마
 */
export const searchIngredientPrice = asyncHandler(
    async (req: Request, res: Response<IngredientPriceResponse | ApiErrorResponse>) => {
        try {
            const query = String(req.query.q || req.query.query || '').trim();
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
                    message: 'KAMIS API 키가 설정되지 않아 더미 데이터를 반환합니다.',
                });
                return;
            }

            const matchedCodes = await searchProductCodes(query);
            if (matchedCodes.length === 0) {
                res.status(200).json({
                    error: false,
                    data: [],
                    date: getTodayDateString(),
                    query,
                    message: '일치하는 품목이 없습니다.',
                });
                return;
            }

            const data = await searchIngredientPrices(query);
            res.status(200).json({
                error: false,
                data,
                date: getTodayDateString(),
                query,
                message:
                    data.length === 0
                        ? '품목은 찾았지만 최근 소매가 데이터가 없습니다.'
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
