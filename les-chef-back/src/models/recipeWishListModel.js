const mongoose = require("mongoose");

const RecipeWishListSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    wishList:[
        {
            recipeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Recipe"
            }
        }
    ],
    createdAt:{
        type: Date,
        default: () => new Date().setMilliseconds(0)
    },
    updatedAt:{
        type: Date,
        default: () => new Date().setMilliseconds(0)
    }
});

const RecipeWishList = mongoose.model("RecipeWishList", RecipeWishListSchema);

module.exports = RecipeWishList;