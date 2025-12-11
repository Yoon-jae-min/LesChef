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

    const [total, list] = await Promise.all([
        Recipe.countDocuments(filter),
        Recipe.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean()
    ]);

    res.send({
        list,
        page: pageNum,
        limit: limitNum,
        total
    });
});

const myList = asyncHandler(async(req, res) => {
    if(req.session.user.id){
        const user = await User.findOne({id: req.session.user.id});
        let recipeList = null;

        if(user.checkAdmin){
            recipeList = await Recipe.find({}).lean();
        }else{
            recipeList = await Recipe.find({userId: req.session.user.id}).lean();
        }

        if(recipeList === null){
            recipeList = [];
        }

        if(recipeList.length === 0){
            res.send({
                list: []
            });
        }else{
            res.send({
                list: recipeList
            });
        }
    }else{
        res.send(null);
    }
})

const wishList = asyncHandler(async(req, res) => {
    const user = await User.findOne({id: req.session.user.id}).lean();
    const preWishList = await RecipeWishList.findOne({userId: user._id}).populate('wishList.recipeId').lean();
    const wishList = preWishList ? preWishList.wishList.map(item => item.recipeId) : [];

    if(wishList.length === 0){
        res.send({
            wishList: []
        });
    }else{
        res.send({
            wishList: wishList
        });
    }
})

const recipeInfo = asyncHandler(async(req, res) => {
    let recipeWish = false;
    await Recipe.updateOne({recipeName: req.query.recipeName}, {$inc: {viewCount: 1}});
    const recipe = await Recipe.findOne({recipeName: req.query.recipeName});
    const recipeIngres = await RecipeIngredient.find({recipeId: recipe._id}).lean();
    const recipeSteps = await RecipeStep.find({recipeId: recipe._id}).sort({stepNum: 1}).lean();


    if(req.session.user){
        const user = await User.findOne({id: req.session.user.id});

        const recipeWishList = await RecipeWishList.findOne({userId: user._id});

        if(recipeWishList){
            recipeWishList.wishList.map((wish) => {
                if(wish.recipeId.toString() === recipe._id.toString()){
                    recipeWish = true;
                }
            })
        }
    }

    const recipeInfo = {
        selectedRecipe: recipe,
        recipeIngres: recipeIngres,
        recipeSteps: recipeSteps,
        recipeWish: recipeWish
    }

    res.send(recipeInfo)
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