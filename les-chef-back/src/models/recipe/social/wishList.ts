import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { IRecipeWishList } from "../../../types";

interface WishListItem {
    recipeId: Types.ObjectId;
    createdAt: Date;
}

interface RecipeWishListDocument extends IRecipeWishList, Document {
    userId: Types.ObjectId;
    wishList: WishListItem[];
}

const RecipeWishListSchema = new Schema<RecipeWishListDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    wishList: [{
        recipeId: {
            type: Schema.Types.ObjectId,
            ref: "Recipe"
        },
        createdAt: {
            type: Date,
            default: () => new Date().setMilliseconds(0)
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

const RecipeWishList: Model<RecipeWishListDocument> = mongoose.model<RecipeWishListDocument>("RecipeWishList", RecipeWishListSchema);

export default RecipeWishList;

