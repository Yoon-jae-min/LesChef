import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { IRecipeReview } from "../../../types";

interface RecipeReviewDocument extends IRecipeReview, Document {
    recipeId: Types.ObjectId;
}

const recipeReviewSchema = new Schema<RecipeReviewDocument>({
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
        required: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
        index: true,
    },
    userNickName: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        default: "",
        maxlength: 1000,
    },
    createdAt: {
        type: Date,
        default: () => new Date().setMilliseconds(0),
    },
    updatedAt: {
        type: Date,
        default: () => new Date().setMilliseconds(0),
    },
});

// 한 사용자당 레시피별 리뷰 1개만 작성 가능
recipeReviewSchema.index({ recipeId: 1, userId: 1 }, { unique: true });
recipeReviewSchema.index({ recipeId: 1, createdAt: -1 }); // 최신순 정렬용

const RecipeReview: Model<RecipeReviewDocument> = mongoose.model<RecipeReviewDocument>("RecipeReview", recipeReviewSchema);

export default RecipeReview;

