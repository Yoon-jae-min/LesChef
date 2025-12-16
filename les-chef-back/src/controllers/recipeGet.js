const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const RecipeIngredient = require("../models/recipeIngredientsModel");
const RecipeStep = require("../models/recipeStepModel");
const RecipeWishList = require("../models/recipeWishListModel");

const removeId = (recipeList) => {
    return recipeList.map(({_id, ...rest}) => rest);
}

// 구 카테고리별 리스트 (현재 미사용) --------------------------------------
// const koreanList = asyncHandler(async(req, res) => {
//     const recipeList = await Recipe.find({majorCategory: "한식", isShare: false}).lean();
//     res.send(recipeList);
// });
//
// const japaneseList = asyncHandler(async(req, res) => {
//     const recipeList = await Recipe.find({majorCategory: "일식", isShare: false}).lean();
//     res.send(recipeList);
// });
//
// const chineseList = asyncHandler(async(req, res) => {
//     const recipeList = await Recipe.find({majorCategory: "중식", isShare: false}).lean();
//     res.send(recipeList);
// });
//
// const westernList = asyncHandler(async(req, res) => {
//     const recipeList = await Recipe.find({majorCategory: "양식", isShare: false}).lean();
//     res.send(recipeList);
// });
//
// const shareList = asyncHandler(async(req, res) => {
//     const recipeList = await Recipe.find({isShare: true}).lean();
//     res.send(recipeList);
// });

// 단일 리스트 엔드포인트 -----------------------------------------------
const categoryMap = {
    korean: "한식",
    japanese: "일식",
    chinese: "중식",
    western: "양식",
    other: "기타"
};

const listRecipes = asyncHandler(async(req, res) => {
    const {
        category = "all",
        subCategory,
        isShare,
        page = 1,
        limit = 20,
        sort = "latest" // latest | popular(조회수)
    } = req.query;

    const filter = {};

    if(category !== "all"){
        filter.majorCategory = categoryMap[category] ?? category; // 영문 키나 직접 값 모두 허용
    }

    if(subCategory){
        filter.subCategory = subCategory;
    }

    if(typeof isShare !== "undefined"){
        filter.isShare = isShare === "true";
    }

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.max(parseInt(limit) || 20, 1);
    const skip = (pageNum - 1) * limitNum;

    const sortOption = sort === "popular" ? { viewCount: -1, createdAt: -1 } : { createdAt: -1 };

    try {
        const [total, list] = await Promise.all([
            Recipe.countDocuments(filter),
            Recipe.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean()
        ]);

        res.status(200).json({
            error: false,
            list: list || [],
            page: pageNum,
            limit: limitNum,
            total: total || 0
        });
    } catch (error) {
        throw error;
    }
});

const myList = asyncHandler(async(req, res) => {
    if(!req.session?.user?.id){
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    try {
        const user = await User.findOne({id: req.session.user.id});
        
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "사용자를 찾을 수 없습니다."
            });
        }

        let recipeList = [];

        if(user.checkAdmin){
            recipeList = await Recipe.find({}).lean();
        }else{
            recipeList = await Recipe.find({userId: req.session.user.id}).lean();
        }

        res.status(200).json({
            error: false,
            list: recipeList || []
        });
    } catch (error) {
        throw error;
    }
})

const wishList = asyncHandler(async(req, res) => {
    if(!req.session?.user?.id){
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    try {
        const user = await User.findOne({id: req.session.user.id}).lean();
        
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "사용자를 찾을 수 없습니다."
            });
        }

        const preWishList = await RecipeWishList.findOne({userId: user._id}).populate('wishList.recipeId').lean();
        const wishList = preWishList ? preWishList.wishList.map(item => item.recipeId).filter(Boolean) : [];

        res.status(200).json({
            error: false,
            wishList: wishList
        });
    } catch (error) {
        throw error;
    }
})

const recipeInfo = asyncHandler(async(req, res) => {
    const { recipeName } = req.query;
    
    if (!recipeName) {
        return res.status(400).json({
            error: true,
            message: "레시피 이름이 필요합니다."
        });
    }

    try {
        let recipeWish = false;
        
        const recipe = await Recipe.findOne({recipeName: recipeName});
        
        if (!recipe) {
            return res.status(404).json({
                error: true,
                message: "레시피를 찾을 수 없습니다."
            });
        }

        await Recipe.updateOne({recipeName: recipeName}, {$inc: {viewCount: 1}});
        
        const [recipeIngres, recipeSteps] = await Promise.all([
            RecipeIngredient.find({recipeId: recipe._id}).lean(),
            RecipeStep.find({recipeId: recipe._id}).sort({stepNum: 1}).lean()
        ]);

        if(req.session?.user?.id){
            const user = await User.findOne({id: req.session.user.id});

            if (user) {
                const recipeWishList = await RecipeWishList.findOne({userId: user._id});

                if(recipeWishList){
                    recipeWish = recipeWishList.wishList.some((wish) => 
                        wish.recipeId.toString() === recipe._id.toString()
                    );
                }
            }
        }

        const recipeInfo = {
            error: false,
            selectedRecipe: recipe,
            recipeIngres: recipeIngres || [],
            recipeSteps: recipeSteps || [],
            recipeWish: recipeWish
        }

        res.status(200).json(recipeInfo);
    } catch (error) {
        throw error;
    }
});

module.exports = {
    // 구 라우트 (미사용)
    // koreanList,
    // japaneseList,
    // chineseList,
    // westernList,
    // shareList,
    // 최신 단일 리스트
    listRecipes,
    myList,
    wishList,
    recipeInfo
};