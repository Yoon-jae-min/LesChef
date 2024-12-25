const asyncHandler = require("express-async-handler");
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

const recipeInfo = asyncHandler(async(req, res) => {
    const recipeId = await Recipe.findOne({recipeName: req.query.recipeName});
    const recipeIngres = await RecipeIngredient.find({recipeId: recipeId._id}).lean();
    const recipeSteps = await RecipeStep.find({recipeId: recipeId._id}).lean();

    const recipeInfo = {
        recipeIngres: recipeIngres,
        recipeSteps: recipeSteps
    }

    res.send(recipeInfo)
});

module.exports = { koreanList, japaneseList, chineseList, westernList, shareList, recipeInfo };