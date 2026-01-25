import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { IRecipeIngredient } from "../../../types";

interface RecipeIngredientDocument extends IRecipeIngredient, Document {
    recipeId: Types.ObjectId;
}

const RecipeIngredientSchema = new Schema<RecipeIngredientDocument>({
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: "Recipe"
    },
    sortType: {
        type: String
    },
    ingredientUnit: [{
        ingredientName: {
            type: String
        },
        volume: {
            type: Number
        },
        unit: {
            type: String
        }
    }],
    createdAt: { 
        type: Date,
        default: () => new Date().setMilliseconds(0)
    },
    updatedAt: {
        type: Date,
        default: () => new Date().setMilliseconds(0)
    }
});

// 재료명 검색 성능 향상을 위한 인덱스 추가
RecipeIngredientSchema.index({ 'ingredientUnit.ingredientName': 'text' });
RecipeIngredientSchema.index({ recipeId: 1 });
RecipeIngredientSchema.index({ 'ingredientUnit.ingredientName': 1 }); // 일반 인덱스 (정규식 검색용)

const RecipeIngredient: Model<RecipeIngredientDocument> = mongoose.model<RecipeIngredientDocument>("RecipeIngredient", RecipeIngredientSchema);

export default RecipeIngredient;

