const mongoose = require("mongoose");

const recipeStepSchema = mongoose.Schema({
    recipeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    },
    stepNum:{
        type: Number
    },
    stepWay:{
        type: String
    },
    stepTips:{
        type: [String]
    },
    stepImg:{
        type: String
    },
    createdAt:{ 
        type: Date,
        default: () => new Date().setMilliseconds(0)
    },
    updatedAt:{
        type: Date,
        default: () => new Date().setMilliseconds(0)
    }
});

const RecipeStep = mongoose.model("RecipeStep", recipeStepSchema);

module.exports = RecipeStep;