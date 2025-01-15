const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const RecipeIngredient = require("../models/recipeIngredientsModel");
const RecipeStep = require("../models/recipeStepModel");
const RecipeWishList = require("../models/recipeWishListModel");

const removeId = (recipeList) => {
    return recipeList.map(({_id, ...rest}) => rest);
}

const koreanList = asyncHandler(async(req, res) => {
    const recipeList = await Recipe.find({majorCategory: "한식", isShare: false}).lean();
    res.send(recipeList);
});

const japaneseList = asyncHandler(async(req, res) => {
    const recipeList = await Recipe.find({majorCategory: "일식", isShare: false}).lean();
    res.send(recipeList);
});

const chineseList = asyncHandler(async(req, res) => {
    const recipeList = await Recipe.find({majorCategory: "중식", isShare: false}).lean();
    res.send(recipeList);
});

const westernList = asyncHandler(async(req, res) => {
    const recipeList = await Recipe.find({majorCategory: "양식", isShare: false}).lean();
    res.send(recipeList);
});

const shareList = asyncHandler(async(req, res) => {
    const recipeList = await Recipe.find({isShare: true}).lean();
    res.send(recipeList);
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

module.exports = { koreanList, japaneseList, chineseList, westernList, shareList, myList, wishList, recipeInfo };