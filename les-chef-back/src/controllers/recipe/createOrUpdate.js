/**
 * 레시피 작성/수정 컨트롤러
 */

const asyncHandler = require("express-async-handler");
const fs = require('fs').promises;
const path = require('path');
const User = require("../../models/user/userModel");
const Recipe = require("../../models/recipe/recipeModel");
const RecipeIngredient = require("../../models/recipe/recipeIngredientsModel");
const RecipeStep = require("../../models/recipe/recipeStepModel");
const { safeJsonParse } = require("../../middleware/security");
const isDev = process.env.NODE_ENV !== 'production';

const createOrUpdate = asyncHandler(async(req, res) => {
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

            for (const imgUrl of deleteImgsArray) {
                if (!imgUrl) continue;
                const stepImg = path.join(__dirname, "..", "..", "..", 'public', imgUrl.slice(1));
                try {
                    await fs.unlink(stepImg);
                } catch (err) {
                    // 파일이 없어도 에러로 처리하지 않음
                    if (err.code !== 'ENOENT') {
                        if (isDev) {
                            console.error('파일 삭제 오류:', err);
                        }
                        throw err;
                    }
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

module.exports = { createOrUpdate };

