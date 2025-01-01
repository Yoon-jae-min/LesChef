const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const RecipeIngredient = require("../models/recipeIngredientsModel");
const RecipeStep = require("../models/recipeStepModel");

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
        res.send(recipeList);
    }else{
        res.send(null);
    }
    
})

const recipeInfo = asyncHandler(async(req, res) => {
    await Recipe.updateOne({recipeName: req.query.recipeName}, {$inc: {viewCount: 1}});
    const recipe = await Recipe.findOne({recipeName: req.query.recipeName});
    const recipeIngres = await RecipeIngredient.find({recipeId: recipe._id}).lean();
    const recipeSteps = await RecipeStep.find({recipeId: recipe._id}).lean();

    const recipeInfo = {
        selectedRecipe: recipe,
        recipeIngres: recipeIngres,
        recipeSteps: recipeSteps
    }

    res.send(recipeInfo)
});

module.exports = { koreanList, japaneseList, chineseList, westernList, shareList, myList, recipeInfo };