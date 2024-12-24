const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipeModel");
const RecipeIngredient = require("../models/recipeIngredientsModel");
const RecipeStep = require("../models/recipeStepModel");

const removeId = (recipeList) => {
    return recipeList.map(({_id, ...rest}) => rest);
}

const koreanList = asyncHandler(async(req, res) => {
    const recipeList = await Recipe.find({majorCategory: "한식"}).lean();
    console.log(removeId(recipeList));
});

const japaneseList = asyncHandler((req, res) => {

});

const chineseList = asyncHandler((req, res) => {

});

const westernList = asyncHandler((req, res) => {

});

const shareList = asyncHandler((req, res) => {

});

module.exports = { koreanList, japaneseList, chineseList, westernList, shareList };