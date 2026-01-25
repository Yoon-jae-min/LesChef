import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { IRecipeStep } from "../../../types";

interface RecipeStepDocument extends IRecipeStep, Document {
    recipeId: Types.ObjectId;
}

const recipeStepSchema = new Schema<RecipeStepDocument>({
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: "Recipe"
    },
    stepNum: {
        type: Number
    },
    stepWay: {
        type: String
    },
    stepImg: {
        type: String
    },
    createdAt: { 
        type: Date,
        default: () => new Date().setMilliseconds(0)
    },
    updatedAt: {
        type: Date,
        default: () => new Date().setMilliseconds(0)
    }
});

const RecipeStep: Model<RecipeStepDocument> = mongoose.model<RecipeStepDocument>("RecipeStep", recipeStepSchema);

export default RecipeStep;

