const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    recipeName:{
        type: String
    },
    cookTime:{
        type: Number
    },
    portion:{
        type: Number
    },
    portionUnit:{
        type: String
    },
    cookLevel:{
        type: String
    },
    userName:{
        type: String
    },
    majorCategory:{
        type: String
    },
    subCategory:{
        type: String
    },
    recipeImg:{
        type: String
    },
    viewCount:{
        type: Number,
        default: 0
    },
    isShare:{
        type: Boolean
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

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;