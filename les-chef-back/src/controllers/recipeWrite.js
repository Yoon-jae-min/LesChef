const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const RecipeIngredient = require("../models/recipeIngredientsModel");
const RecipeStep = require("../models/recipeStepModel");
const RecipeWishList = require("../models/recipeWishListModel");

const recipeWrite = asyncHandler(async(req, res) => {
    const { recipeInfo, recipeIngredients, recipeSteps} = req.body;
    const parsedRecipeInfo = JSON.parse(recipeInfo);
    const parsedRecipeIngredients = JSON.parse(recipeIngredients);
    const parsedRecipeSteps = JSON.parse(recipeSteps);
    const userInfo = await User.findOne({id: req.session.user.id});
    let isShare = true;

    if(userInfo.checkAdmin){
        isShare = false;
    }

    if(recipeInfo.recipeImg === ""){
        parsedRecipeInfo.recipeImg = req.files.recipeImgFile[0].newPath;
    }
    const uploadedFiles = req.files.recipeStepImgFiles; 
    parsedRecipeSteps.map((step, index) => {
        if ((step.stepImg === "") && uploadedFiles[index]) {
            step.stepImg = uploadedFiles[index].newPath; 
        }
    });

    const infoAdd = await Recipe.create({
        recipeName: parsedRecipeInfo.recipeName,
        cookTime: parsedRecipeInfo.cookTime, 
        portion: parsedRecipeInfo.portion, 
        portionUnit: parsedRecipeInfo.portionUnit, 
        cookLevel: parsedRecipeInfo.cookLevel,
        userId: userInfo.id,
        userNickName: userInfo.nickName, 
        majorCategory: parsedRecipeInfo.majorCategory, 
        subCategory: parsedRecipeInfo.subCategory, 
        recipeImg: parsedRecipeInfo.recipeImg, 
        viewCount: parsedRecipeInfo.viewCount,  
        isShare: isShare
    });

    const ingredientsData = parsedRecipeIngredients.map((item) => ({
        recipeId: infoAdd._id,
        sortType: item.sortType,
        ingredientUnit: item.ingredientUnit
    }));

    const stepsData = parsedRecipeSteps.map((item) => ({
        recipeId: infoAdd._id,
        stepNum: item.stepNum,
        stepWay: item.stepWay,
        stepImg: item.stepImg
    }));

    await RecipeIngredient.insertMany(ingredientsData);

    await RecipeStep.insertMany(stepsData);

    res.status(200).send("success");
});

const clickWish = asyncHandler(async(req, res) => {
    const {recipeId} = req.body;
    const user = await User.findOne({id: req.session.user.id});
    const wishList = await RecipeWishList.findOne({userId: user._id});
    let recipeWish = true;
    
    if(wishList){
        const exist = wishList.wishList.some(wish => wish.recipeId.toString() === recipeId.toString());

        await RecipeWishList.updateOne({userId: user._id},
            exist ?
                {$pull: {wishList: {recipeId: recipeId}}} :
                {$addToSet: {wishList: {recipeId: recipeId}}}
        );
        recipeWish = exist ? false : true;
    }else{
        await RecipeWishList.create({
            userId: user._id,
            wishList: [{
                recipeId: recipeId
            }]
        });
    }

    res.send({recipeWish: recipeWish});
});


module.exports = { recipeWrite, clickWish };