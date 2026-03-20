import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { Types, type PipelineStage } from 'mongoose';
import User from '../../../models/user/userModel';
import Recipe from '../../../models/recipe/core/recipe';
import RecipeIngredient from '../../../models/recipe/core/ingredients';
import RecipeStep from '../../../models/recipe/core/step';
import RecipeWishList from '../../../models/recipe/social/wishList';
import { handleError } from '../../../utils/error/errorUtils';
import { PaginatedResponse, ApiSuccessResponse, ApiErrorResponse, IRecipe } from '../../../types';
import {
    RECIPE_SORT_OPTIONS,
    DEFAULT_SORT_OPTION,
    POPULARITY_WEIGHTS,
    type RecipeSortOption,
} from '../../../constants/recipe/recipe';

// const removeId = <T extends { _id?: unknown }>(recipeList: T[]): Omit<T, '_id'>[] => {
//     return recipeList.map(({_id, ...rest}) => rest as Omit<T, '_id'>);
// };

// 단일 리스트 엔드포인트
const categoryMap: Record<string, string> = {
    korean: '한식',
    japanese: '일식',
    chinese: '중식',
    western: '양식',
    other: '기타',
};

interface RecipeListQuery {
    category?: string;
    subCategory?: string;
    isShare?: string;
    page?: string;
    limit?: string;
    sort?: RecipeSortOption;
    keyword?: string;
    tag?: string;
}

/**
 * 정렬 옵션에 따른 정렬 객체 생성
 * @param sort 정렬 옵션
 * @returns MongoDB 정렬 객체
 */
const getSortOption = (sort: RecipeSortOption): Record<string, 1 | -1> => {
    switch (sort) {
        case RECIPE_SORT_OPTIONS.VIEWS:
            return { viewCount: -1, createdAt: -1 };
        case RECIPE_SORT_OPTIONS.RATING:
            return { averageRating: -1, reviewCount: -1, createdAt: -1 };
        case RECIPE_SORT_OPTIONS.POPULAR:
            // 인기순은 aggregation으로 처리하므로 여기서는 기본 정렬만 반환
            // 실제 정렬은 aggregation pipeline에서 처리
            return { createdAt: -1 };
        case RECIPE_SORT_OPTIONS.LATEST:
        default:
            return { createdAt: -1 };
    }
};

/**
 * 인기순 정렬을 위한 aggregation pipeline 생성
 * 인기 점수 = (조회수 * 가중치) + (평점 * 가중치) + (리뷰 수 * 가중치)
 */
const getPopularityPipeline = (filter: Record<string, unknown>, skip: number, limitNum: number) => {
    return [
        { $match: filter },
        {
            $addFields: {
                popularityScore: {
                    $add: [
                        {
                            $multiply: [
                                { $ifNull: ['$viewCount', 0] },
                                POPULARITY_WEIGHTS.VIEW_COUNT,
                            ],
                        },
                        {
                            $multiply: [
                                { $ifNull: ['$averageRating', 0] },
                                POPULARITY_WEIGHTS.RATING,
                            ],
                        },
                        {
                            $multiply: [
                                { $ifNull: ['$reviewCount', 0] },
                                POPULARITY_WEIGHTS.REVIEW_COUNT,
                            ],
                        },
                    ],
                },
            },
        },
        { $sort: { popularityScore: -1 as -1, createdAt: -1 as -1 } },
        { $skip: skip },
        { $limit: limitNum },
        {
            $project: {
                popularityScore: 0, // 응답에서 제거
            },
        },
    ] as PipelineStage[];
};

export const listRecipes = asyncHandler(
    async (
        req: Request<{}, PaginatedResponse<IRecipe> | ApiErrorResponse, {}, RecipeListQuery>,
        res: Response<PaginatedResponse<IRecipe> | ApiErrorResponse>
    ) => {
        const {
            category = 'all',
            subCategory,
            isShare,
            page = '1',
            limit = '20',
            sort = DEFAULT_SORT_OPTION,
            keyword, // 검색 키워드
            tag, // 태그 검색
        } = req.query;

        // 정렬 옵션 검증 및 기본값 설정
        const sortOption: RecipeSortOption =
            sort && Object.values(RECIPE_SORT_OPTIONS).includes(sort as RecipeSortOption)
                ? (sort as RecipeSortOption)
                : DEFAULT_SORT_OPTION;

        const filter: Record<string, unknown> = {};

        if (category !== 'all') {
            filter.majorCategory = categoryMap[category] ?? category; // 영문 키나 직접 값 모두 허용
        }

        if (subCategory) {
            filter.subCategory = subCategory;
        }

        if (typeof isShare !== 'undefined') {
            filter.isShare = isShare === 'true';
        }

        // 키워드 검색 (레시피 이름, 태그, 재료명) - 최적화된 버전
        if (keyword && keyword.trim()) {
            const keywordRegex = new RegExp(keyword.trim(), 'i'); // 대소문자 구분 없이 검색

            // 재료명 검색: Aggregation Pipeline으로 최적화
            // distinct보다 aggregation이 더 효율적 (인덱스 활용)
            const ingredientMatchPipeline = [
                {
                    $match: {
                        'ingredientUnit.ingredientName': keywordRegex,
                    },
                },
                {
                    $group: {
                        _id: '$recipeId',
                    },
                },
                {
                    $project: {
                        _id: 1,
                    },
                },
            ];

            // 병렬 처리: 재료명 검색과 기본 필터 준비를 동시에
            const [ingredientResults] = await Promise.all([
                RecipeIngredient.aggregate(ingredientMatchPipeline).allowDiskUse(true),
            ]);

            const recipeIdsFromIngredients = ingredientResults.map(
                (item: { _id: Types.ObjectId }) => item._id
            );

            // 레시피 이름, 태그, 재료명으로 검색
            filter.$or = [{ recipeName: keywordRegex }, { tags: { $in: [keywordRegex] } }];

            // 재료명 검색 결과가 있으면 추가
            if (recipeIdsFromIngredients.length > 0) {
                (filter.$or as unknown[]).push({ _id: { $in: recipeIdsFromIngredients } });
            }
        }

        // 태그 검색
        if (tag && tag.trim()) {
            filter.tags = { $in: [new RegExp(tag.trim(), 'i')] };
        }

        const pageNum = Math.max(parseInt(page) || 1, 1);
        const limitNum = Math.max(parseInt(limit) || 20, 1);
        const skip = (pageNum - 1) * limitNum;

        try {
            // 인기순 정렬은 aggregation pipeline 사용
            if (sortOption === RECIPE_SORT_OPTIONS.POPULAR) {
                const [totalResult, list] = await Promise.all([
                    Recipe.countDocuments(filter),
                    Recipe.aggregate(getPopularityPipeline(filter, skip, limitNum)).allowDiskUse(
                        true
                    ),
                ]);

                res.status(200).json({
                    error: false,
                    list: (list || []) as IRecipe[],
                    page: pageNum,
                    limit: limitNum,
                    total: totalResult || 0,
                });
            } else {
                // 일반 정렬 (최신순, 조회수순, 평점순)
                const sortObj = getSortOption(sortOption);
                const [total, list] = await Promise.all([
                    Recipe.countDocuments(filter),
                    Recipe.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
                ]);

                res.status(200).json({
                    error: false,
                    list: (list || []) as IRecipe[],
                    page: pageNum,
                    limit: limitNum,
                    total: total || 0,
                });
            }
        } catch (error) {
            throw handleError(error as Error, { resourceName: '레시피' });
        }
    }
);

export const myList = asyncHandler(
    async (req: Request, res: Response<ApiSuccessResponse | ApiErrorResponse>) => {
        if (!req.session?.user?.id) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        try {
            const user = await User.findOne({ id: req.session.user.id });

            if (!user) {
                res.status(404).json({
                    error: true,
                    message: '사용자를 찾을 수 없습니다.',
                });
                return;
            }

            let recipeList: IRecipe[] = [];

            if (user.checkAdmin) {
                recipeList = (await Recipe.find({}).lean()) as IRecipe[];
            } else {
                recipeList = (await Recipe.find({
                    userId: req.session.user.id,
                }).lean()) as IRecipe[];
            }

            res.status(200).json({
                error: false,
                list: recipeList || [],
            });
        } catch (error) {
            throw handleError(error as Error, { resourceName: '레시피' });
        }
    }
);

export const wishList = asyncHandler(
    async (req: Request, res: Response<ApiSuccessResponse | ApiErrorResponse>) => {
        if (!req.session?.user?.id) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        try {
            const user = await User.findOne({ id: req.session.user.id });

            if (!user) {
                res.status(404).json({
                    error: true,
                    message: '사용자를 찾을 수 없습니다.',
                });
                return;
            }

            const preWishList = await RecipeWishList.findOne({ userId: user._id })
                .populate('wishList.recipeId')
                .lean();
            const wishList = preWishList
                ? preWishList.wishList.map((item) => item.recipeId).filter(Boolean)
                : [];

            res.status(200).json({
                error: false,
                wishList: wishList,
            });
        } catch (error) {
            throw handleError(error as Error, { resourceName: '레시피' });
        }
    }
);

interface RecipeInfoQuery {
    /** MongoDB _id. 일반 상세: 공개 조회 + 조회수 증가. forEdit=1 이면 로그인·소유자(또는 관리자)만, 조회수 미증가 */
    id?: string;
    /** "1" | "true" 일 때 id 조회는 수정 폼 전용(소유자/관리자), 조회수 증가 없음 */
    forEdit?: string;
}

interface RecipeInfoResponse extends ApiSuccessResponse {
    selectedRecipe: IRecipe;
    recipeIngres: unknown[];
    recipeSteps: unknown[];
    recipeWish: boolean;
}

export const recipeInfo = asyncHandler(
    async (
        req: Request<{}, RecipeInfoResponse | ApiErrorResponse, {}, RecipeInfoQuery>,
        res: Response<RecipeInfoResponse | ApiErrorResponse>
    ) => {
        const { id, forEdit } = req.query;
        const forEditMode = forEdit === '1' || forEdit === 'true';

        if (!id) {
            res.status(400).json({
                error: true,
                message: '레시피 id가 필요합니다.',
            });
            return;
        }

        try {
            let recipeWish = false;
            let recipe = null as InstanceType<typeof Recipe> | null;
            let incrementView = false;

            if (!Types.ObjectId.isValid(id)) {
                res.status(400).json({
                    error: true,
                    message: '유효하지 않은 레시피 id입니다.',
                });
                return;
            }
            recipe = await Recipe.findById(id);
            if (!recipe) {
                res.status(404).json({
                    error: true,
                    message: '레시피를 찾을 수 없습니다.',
                });
                return;
            }

            if (forEditMode) {
                if (!req.session?.user?.id) {
                    res.status(401).json({
                        error: true,
                        message: '로그인이 필요합니다.',
                    });
                    return;
                }
                if (recipe.userId !== req.session.user.id) {
                    const sessionUser = await User.findOne({ id: req.session.user.id });
                    if (!sessionUser?.checkAdmin) {
                        res.status(403).json({
                            error: true,
                            message: '본인의 레시피만 조회할 수 있습니다.',
                        });
                        return;
                    }
                }
                incrementView = false;
            } else {
                incrementView = true;
            }

            if (incrementView && recipe) {
                await Recipe.updateOne({ _id: recipe._id }, { $inc: { viewCount: 1 } });
            }

            const [recipeIngres, recipeSteps] = await Promise.all([
                RecipeIngredient.find({ recipeId: recipe._id }).lean(),
                RecipeStep.find({ recipeId: recipe._id }).sort({ stepNum: 1 }).lean(),
            ]);

            if (req.session?.user?.id) {
                const user = await User.findOne({ id: req.session.user.id });

                if (user) {
                    const recipeWishList = await RecipeWishList.findOne({ userId: user._id });

                    if (recipeWishList) {
                        recipeWish = recipeWishList.wishList.some(
                            (wish) =>
                                wish.recipeId.toString() ===
                                (recipe!._id as Types.ObjectId).toString()
                        );
                    }
                }
            }

            const recipeInfo: RecipeInfoResponse = {
                error: false,
                selectedRecipe: recipe.toObject() as IRecipe,
                recipeIngres: recipeIngres || [],
                recipeSteps: recipeSteps || [],
                recipeWish: recipeWish,
            };

            res.status(200).json(recipeInfo);
        } catch (error) {
            throw handleError(error as Error, { resourceName: '레시피' });
        }
    }
);
