const mongoose = require("mongoose");

const RecipeIngredientSchema = mongoose.Schema({
    recipeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    },
    sortType:{
        type: String
    },
    ingredientUnit: [
        {
            ingredientName:{
                type: String
            },
            volume:{
                type: Number
            },
            unit:{
                type: String
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

const RecipeIngredient = mongoose.model("RecipeIngredient", RecipeIngredientSchema);

module.exports = RecipeIngredient;