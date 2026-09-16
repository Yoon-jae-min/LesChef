import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import logger from '../../utils/system/logger';
import {
    hasNaverSearchCredentials,
    searchNaverShop,
} from '../../utils/external/naverShop';
import { ApiSuccessResponse, ApiErrorResponse } from '../../types';

const isDev = process.env.NODE_ENV !== 'production';

interface FoodSearchResponse extends ApiSuccessResponse {
    data: unknown[];
    query: string;
    total: number;
    message?: string;
    disclaimer?: string;
}

/**
 * 식품/음식 네이버 쇼핑 검색
 * GET /food-search?q=두부
 */
export const searchFoodProducts = asyncHandler(
    async (req: Request, res: Response<FoodSearchResponse | ApiErrorResponse>) => {
        try {
            const query = String(req.query.q || req.query.query || '').trim();
            if (!query) {
                res.status(400).json({
                    error: true,
                    message: '검색어(q)를 입력해 주세요.',
                });
                return;
            }

            if (!hasNaverSearchCredentials()) {
                res.status(503).json({
                    error: true,
                    message:
                        '네이버 검색 API 키가 설정되지 않았습니다. NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 을 확인해 주세요.',
                });
                return;
            }

            const displayRaw = Number(req.query.display || 10);
            const display = Number.isFinite(displayRaw) ? displayRaw : 10;
            const result = await searchNaverShop(query, { display });

            res.status(200).json({
                error: false,
                data: result.items,
                query: result.query,
                total: result.total,
                disclaimer:
                    '네이버 쇼핑 검색 결과입니다. 가격·재고는 쇼핑몰 기준으로 달라질 수 있습니다.',
                message: result.items.length === 0 ? '검색 결과가 없습니다.' : undefined,
            });
        } catch (error) {
            if (isDev) {
                logger.error('식품 검색 오류:', { error });
            }
            const err = error as Error;
            res.status(500).json({
                error: true,
                message: '식품 검색 중 오류가 발생했습니다.',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined,
            });
        }
    }
);
