const mongoose = require("mongoose");

const MyIngredientSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ingredientName:{
        type: String
    },
    volume:{
        type: Number
    },
    unit:{
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

const MyIngredient = mongoose.model('MyIngredient', MyIngredientSchema);

module.exports = MyIngredient;