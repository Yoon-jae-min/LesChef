const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const RecipeIngredient = require("../models/recipeIngredientsModel");
const RecipeStep = require("../models/recipeStepModel");

//실제 사용
const recipeWrite = asyncHandler(async(req, res) => {
    const { recipeInfo, recipeIngredients, recipeSteps } = req.body;
    const userInfo = await User.findOne({id: req.session.user.id});
    let isShare = true;

    if(userInfo.checkAdmin){
        isShare = false;
    }

    const infoAdd = await Recipe.create({
        recipeName: recipeInfo.recipeName,
        cookTime: recipeInfo.cookTime, 
        portion: recipeInfo.portion, 
        portionUnit: recipeInfo.portionUnit, 
        cookLevel: recipeInfo.cookLevel,
        userName: userInfo.id, 
        majorCategory: recipeInfo.majorCategory, 
        subCategory: recipeInfo.subCategory, 
        recipeImg: recipeInfo.recipeImg, 
        viewCount: recipeInfo.viewCount,  
        isShare: isShare
    });

    const ingredientsData = recipeIngredients.map((item) => ({
        recipeId: infoAdd._id,
        sortType: item.sortType,
        ingredientUnit: item.ingredientUnit
    }));

    const stepsData = recipeSteps.map((item) => ({
        recipeId: infoAdd._id,
        stepNum: item.stepNum,
        stepWay: item.stepWay,
        stepImg: item.stepImg
    }));

    await RecipeIngredient.insertMany(ingredientsData);

    await RecipeStep.insertMany(stepsData);

    res.status(200).send("success");
});


//임시 사용
const adminWrite = asyncHandler(async(req, res) => {
    const { recipeInfo, recipeIngredients, recipeSteps } = req.body;

    const infoAdd = await Recipe.create({
        recipeName: recipeInfo.recipeName,
        cookTime: recipeInfo.cookTime, 
        portion: recipeInfo.portion, 
        portionUnit: recipeInfo.portionUnit, 
        cookLevel: recipeInfo.cookLevel,
        userId: "admin@admin.com", 
        majorCategory: recipeInfo.majorCategory, 
        subCategory: recipeInfo.subCategory, 
        recipeImg: recipeInfo.recipeImg, 
        isShare: false
    });

    const ingredientsData = recipeIngredients.map((item) => ({
        recipeId: infoAdd._id,
        sortType: item.sortType,
        ingredientUnit: item.ingredientUnit
    }));

    const stepsData = recipeSteps.map((item) => ({
        recipeId: infoAdd._id,
        stepNum: item.stepNum,
        stepWay: item.stepWay,
        stepImg: item.stepImg
    }));

    await RecipeIngredient.insertMany(ingredientsData);

    await RecipeStep.insertMany(stepsData);

    res.status(200).send("admin success");
});

const commonWrite = asyncHandler(async(req, res) => {
    const { recipeInfo, recipeIngredients, recipeSteps } = req.body;

    const infoAdd = await Recipe.create({
        recipeName: recipeInfo.recipeName,
        cookTime: recipeInfo.cookTime, 
        portion: recipeInfo.portion, 
        portionUnit: recipeInfo.portionUnit, 
        cookLevel: recipeInfo.cookLevel,
        userId: "user00@user.com", 
        majorCategory: recipeInfo.majorCategory, 
        subCategory: recipeInfo.subCategory, 
        recipeImg: recipeInfo.recipeImg, 
        viewCount: recipeInfo.viewCount,  
        isShare: true
    });

    const ingredientsData = recipeIngredients.map((item) => ({
        recipeId: infoAdd._id,
        sortType: item.sortType,
        ingredientUnit: item.ingredientUnit
    }));

    const stepsData = recipeSteps.map((item) => ({
        recipeId: infoAdd._id,
        stepNum: item.stepNum,
        stepWay: item.stepWay,
        stepImg: item.stepImg
    }));

    await RecipeIngredient.insertMany(ingredientsData);

    await RecipeStep.insertMany(stepsData);

    res.status(200).send("common success");
});

module.exports = { adminWrite, commonWrite, recipeWrite };