const asyncHandler = require("express-async-handler");
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const RecipeIngredient = require("../models/recipeIngredientsModel");
const RecipeStep = require("../models/recipeStepModel");
const RecipeWishList = require("../models/recipeWishListModel");
const { safeJsonParse } = require("../middleware/security");
require("dotenv").config();

const recipeWrite = asyncHandler(async(req, res) => {
    // 세션 검증
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    try {
        const { recipeInfo, recipeIngredients, recipeSteps, isEdit, deleteImgs} = req.body;
        
        // 필수 데이터 검증
        if (!recipeInfo || !recipeIngredients || !recipeSteps) {
            return res.status(400).json({
                error: true,
                message: "필수 데이터가 누락되었습니다."
            });
        }

        // 안전한 JSON 파싱
        const parsedRecipeInfo = safeJsonParse(recipeInfo);
        const parsedRecipeIngredients = safeJsonParse(recipeIngredients);
        const parsedRecipeSteps = safeJsonParse(recipeSteps);
        const parsedIsEdit = safeJsonParse(isEdit || "false");
        
        // 불필요한 undefined 요소 제거
        const deleteImgsArray = (Array.isArray(deleteImgs) ? deleteImgs : [deleteImgs]).filter(Boolean);
        
        const userInfo = await User.findOne({id: req.session.user.id}).lean();
        
        if (!userInfo) {
            return res.status(404).json({
                error: true,
                message: "사용자를 찾을 수 없습니다."
            });
        }
    let isShare = true;
    let recipeId = null;

    if(userInfo.checkAdmin){
        isShare = false;
    }

        if(parsedRecipeInfo.recipeImg === ""){
            if (!req.files?.recipeImgFile || !req.files.recipeImgFile[0]?.newPath) {
                return res.status(400).json({
                    error: true,
                    message: "레시피 대표 이미지가 필요합니다."
                });
            }
            parsedRecipeInfo.recipeImg = req.files.recipeImgFile[0].newPath;
        }
        
        const uploadedFiles = req.files?.recipeStepImgFiles || []; 
        let count = 0;
        parsedRecipeSteps.map((step) => {
            if (step.stepImg === "") {
                if (uploadedFiles[count]?.newPath) {
                    step.stepImg = uploadedFiles[count].newPath; 
                    count++;
                } else {
                    throw new Error(`단계 ${step.stepNum}의 이미지가 누락되었습니다.`);
                }
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
                viewCount: parsedRecipeInfo.viewCount || 0,  
                isShare: isShare
            });
            recipeId = infoAdd._id.toString(); // 이후 재료/단계에 동일 id 사용
        }else{
            // 수정 모드에서 기존 레시피 확인
            if (!parsedRecipeInfo._id) {
                return res.status(400).json({
                    error: true,
                    message: "수정할 레시피 ID가 필요합니다."
                });
            }

            const existingRecipe = await Recipe.findOne({userId: userInfo.id, _id: parsedRecipeInfo._id});
            if (!existingRecipe) {
                return res.status(404).json({
                    error: true,
                    message: "수정할 레시피를 찾을 수 없습니다."
                });
            }

            for(const imgUrl of deleteImgsArray){
                if(imgUrl){
                    const stepImg = path.join(__dirname, "..", "..", 'public', imgUrl.slice(1));
                    
                    await new Promise((resolve, reject) => {
                        fs.unlink(stepImg, (err) => {
                            if(err && err.code !== 'ENOENT') { // 파일이 없어도 에러로 처리하지 않음
                                console.error('파일 삭제 오류:', err);
                                reject(err);
                                return;
                            }
                            resolve();
                        });
                    })
                }
            }
            
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
            await RecipeStep.deleteMany({recipeId: parsedRecipeInfo._id});
            await RecipeIngredient.deleteMany({recipeId: parsedRecipeInfo._id});
            recipeId = parsedRecipeInfo._id;
        }

    // 프론트에서 온 recipeId는 사용하지 않고 서버에서 관리한 recipeId로 통일
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

        res.status(200).json({
            error: false,
            message: "success"
        });
    } catch (parseError) {
        if (parseError.message.includes('JSON')) {
            return res.status(400).json({
                error: true,
                message: parseError.message || "잘못된 JSON 형식입니다."
            });
        }
        throw parseError; // 다른 에러는 asyncHandler가 처리
    }
});

const clickWish = asyncHandler(async(req, res) => {
    // 세션 검증
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    const {recipeId} = req.body;
    
    if (!recipeId) {
        return res.status(400).json({
            error: true,
            message: "레시피 ID가 필요합니다."
        });
    }

    const user = await User.findOne({id: req.session.user.id});
    
    if (!user) {
        return res.status(404).json({
            error: true,
            message: "사용자를 찾을 수 없습니다."
        });
    }

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

    res.status(200).json({
        error: false,
        recipeWish: recipeWish
    });
});

const deleteRecipe = asyncHandler(async(req, res) => {
    if (!req.session?.user) {
        return res.status(401).send("로그인이 필요합니다.");
    }
    const { id } = req.params;
    if (!id) {
        return res.status(400).send("id가 없습니다.");
    }
    const recipeInfo = await Recipe.findOne({_id: id}).lean();
    if (!recipeInfo) {
        return res.status(404).send("레시피를 찾을 수 없습니다.");
    }
    // 본인이 작성한 레시피만 삭제 가능
    if (recipeInfo.userId !== req.session.user.id) {
        return res.status(403).send("본인이 작성한 레시피만 삭제할 수 있습니다.");
    }
    const recipeSteps = await RecipeStep.find({recipeId: id}).lean();
    const recipeIngres = await RecipeIngredient.find({recipeId: id}).lean();

    let deleteMain = null;
    let deleteStep = [];

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        if(recipeIngres){
            await RecipeIngredient.deleteMany({recipeId: id});
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
            await RecipeStep.deleteMany({recipeId: id});
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
            await Recipe.deleteOne({_id: id});
        }

        await session.commitTransaction();
        res.status(200).json({
            error: false,
            message: "success",
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
        res.status(500).json({
            error: true,
            message: "레시피 삭제 중 오류가 발생했습니다.",
            text: "fail"
        });
    } finally{
        session.endSession();
    }
})


module.exports = { recipeWrite, clickWish, deleteRecipe };