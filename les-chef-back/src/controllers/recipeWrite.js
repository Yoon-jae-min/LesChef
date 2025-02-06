const asyncHandler = require("express-async-handler");
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const RecipeIngredient = require("../models/recipeIngredientsModel");
const RecipeStep = require("../models/recipeStepModel");
const RecipeWishList = require("../models/recipeWishListModel");
require("dotenv").config();

const recipeWrite = asyncHandler(async(req, res) => {
    const { recipeInfo, recipeIngredients, recipeSteps, isEdit} = req.body;
    const parsedRecipeInfo = JSON.parse(recipeInfo);
    const parsedRecipeIngredients = JSON.parse(recipeIngredients);
    const parsedRecipeSteps = JSON.parse(recipeSteps);
    const parsedIsEdit = JSON.parse(isEdit);
    const userInfo = await User.findOne({id: req.session.user.id}).lean();
    let isShare = true;
    let recipeId = null;

    if(userInfo.checkAdmin){
        isShare = false;
    }

    if(parsedRecipeInfo.recipeImg === ""){
        parsedRecipeInfo.recipeImg = req.files.recipeImgFile[0].newPath;
    }
    const uploadedFiles = req.files.recipeStepImgFiles; 
    let count = 0;
    parsedRecipeSteps.map((step) => {
        if (step.stepImg === "") {
            step.stepImg = uploadedFiles[count].newPath; 
            count++;
        }
    });

    if(!parsedIsEdit){
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
        recipeId = infoAdd._id;
    }else{
        
        await Recipe.updateOne({userId: userInfo.id, _id: parsedRecipeInfo._id},
            {$set: {
                recipeName: parsedRecipeInfo.recipeName,
                cookTime: parsedRecipeInfo.cookTime, 
                portion: parsedRecipeInfo.portion, 
                portionUnit: parsedRecipeInfo.portionUnit, 
                cookLevel: parsedRecipeInfo.cookLevel,
                majorCategory: parsedRecipeInfo.majorCategory, 
                subCategory: parsedRecipeInfo.subCategory, 
                recipeImg: parsedRecipeInfo.recipeImg,
            }}
        )
        await RecipeStep.deleteMany({recipeId: recipeInfo._id});
        await RecipeIngredient.deleteMany({recipeId: recipeInfo._id});
        recipeId = recipeInfo._id;
    }

    const ingredientsData = parsedRecipeIngredients.map((item) => ({
        recipeId: recipeId,
        sortType: item.sortType,
        ingredientUnit: item.ingredientUnit.map((unit) => ({
            ingredientName: unit.ingredientName,
            volume: unit.volume,
            unit: unit.unit,
        }))
    }));

    const stepsData = parsedRecipeSteps.map((item) => ({
        recipeId: recipeId,
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

const deleteRecipe = asyncHandler(async(req, res) => {
    const recipeInfo = await Recipe.findOne({_id: req.body.recipeId}).lean();
    const recipeSteps = await RecipeStep.find({recipeId: req.body.recipeId}).lean();
    const recipeIngres = await RecipeIngredient.find({recipeId: req.body.recipeId}).lean();

    let deleteMain = null;
    let deleteStep = [];

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        if(recipeIngres){
            await RecipeIngredient.deleteMany({recipeId: req.body.recipeId});
        }
    
        if(recipeSteps){
            for(const step of recipeSteps){
                if(step.stepImg !== process.env.NO_IMAGE_URL){
                    const stepImg = path.join(__dirname, "..", "..", 'public', step.stepImg.slice(1));

                    await new Promise((resolve, reject) => {
                        fs.readFile(stepImg, (readErr, content) => {
                            if(readErr){
                                reject(new Error(`Step 파일 읽기 오류: ${readErr.message}`));
                                return;
                            }

                            fs.unlink(stepImg, (deleteErr) => {
                                if(deleteErr){
                                    reject(new Error(`Step 파일 삭제 오류: ${deleteErr.message}`));
                                }else {
                                    deleteStep.push({path: path.dirname(stepImg), content});
                                    resolve();
                                }
                            });
                        });
                    });
                }
            }
            await RecipeStep.deleteMany({recipeId: req.body.recipeId});
        }
    
        if(recipeInfo){
            if(recipeInfo.recipeImg !== process.env.NO_IMAGE_URL){
                const mainImg = path.join(__dirname, "..", "..", 'public', recipeInfo.recipeImg.slice(1));

                await new Promise((resolve, reject) => {
                    fs.readFile(mainImg, (readErr, content) => {
                        if(readErr){
                            reject(new Error(`Main 파일 읽기 오류: ${readErr.message}`));
                            return;
                        }

                        fs.unlink(mainImg, (deleteErr) => {
                            if(deleteErr){
                                reject(new Error(`Main 파일 삭제 오류: ${deleteErr.message}`));
                            }else {
                                deleteMain = {
                                    path: path.dirname(mainImg),
                                    content
                                }
                                resolve();
                            }
                        });
                    });
                });
            }
            await Recipe.deleteOne({_id: req.body.recipeId});
        }

        await session.commitTransaction();
        res.status(200).send({
            text: "success"
        });
    }catch (err){
        if(!err.message.includes('Step 파일 읽기') && (deleteStep.length !== 0)){
            for(const step of deleteStep){
                await new Promise((resolve, reject) => {
                    fs.writeFile(step.path, step.content, (err) => {
                        if(err) {
                            console.error("step 다시 쓰기 실패", err);
                            reject(err);
                        }else{
                            console.log("step 다시 쓰기 성공");
                            resolve();
                        }
                    });
                });
            }
        }

        if(err.message.includes('Main 파일 삭제') || deleteMain){
            await new Promise((resolve, reject) => {
                fs.writeFile(deleteMain.path, deleteMain.content, (err) => {
                    if(err) {
                        console.error("main 다시 쓰기 실패", err);
                        reject(err);
                    }else{
                        console.log("main 다시 쓰기 성공");
                        resolve();
                    }
                });
            });
        }

        await session.abortTransaction();
        console.error("오류 발생: ", err);
        res.status(500).send({
            text: "fail"
        });
    } finally{
        session.endSession();
    }
})


module.exports = { recipeWrite, clickWish, deleteRecipe };