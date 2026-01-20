/**
 * 레시피 삭제 컨트롤러
 */

const asyncHandler = require("express-async-handler");
const fs = require('fs').promises;
const path = require('path');
const mongoose = require("mongoose");
const Recipe = require("../../models/recipe/recipeModel");
const RecipeStep = require("../../models/recipe/recipeStepModel");
const RecipeIngredient = require("../../models/recipe/recipeIngredientsModel");
const isDev = process.env.NODE_ENV !== 'production';

const removeRecipe = asyncHandler(async(req, res) => {
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
                    const stepImg = path.join(__dirname, "..", "..", "..", 'public', step.stepImg.slice(1));

                    try {
                        const content = await fs.readFile(stepImg);
                        await fs.unlink(stepImg);
                        deleteStep.push({path: stepImg, content});
                    } catch (readErr) {
                        throw new Error(`Step 파일 읽기 오류: ${readErr.message}`);
                    }
                }
            }
            await RecipeStep.deleteMany({recipeId: id});
        }
    
        if(recipeInfo){
            if(recipeInfo.recipeImg !== process.env.NO_IMAGE_URL){
                const mainImg = path.join(__dirname, "..", "..", "..", 'public', recipeInfo.recipeImg.slice(1));

                try {
                    const content = await fs.readFile(mainImg);
                    await fs.unlink(mainImg);
                    deleteMain = {
                        path: mainImg,
                        content,
                    };
                } catch (fileErr) {
                    throw new Error(`Main 파일 처리 오류: ${fileErr.message}`);
                }
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
            for (const step of deleteStep){
                try {
                    await fs.writeFile(step.path, step.content);
                    if (isDev) {
                        console.log("step 다시 쓰기 성공");
                    }
                } catch (writeErr) {
                    if (isDev) {
                        console.error("step 다시 쓰기 실패", writeErr);
                    }
                    throw writeErr;
                }
            }
        }

        if(err.message.includes('Main 파일 삭제') || deleteMain){
            try {
                await fs.writeFile(deleteMain.path, deleteMain.content);
                if (isDev) {
                    console.log("main 다시 쓰기 성공");
                }
            } catch (writeErr) {
                if (isDev) {
                    console.error("main 다시 쓰기 실패", writeErr);
                }
                throw writeErr;
            }
        }

        await session.abortTransaction();
        if (isDev) {
            console.error("오류 발생: ", err);
        }
        res.status(500).json({
            error: true,
            message: "레시피 삭제 중 오류가 발생했습니다.",
            text: "fail"
        });
    } finally{
        session.endSession();
    }
})

module.exports = { removeRecipe };

