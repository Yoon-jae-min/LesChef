const mongoose = require("mongoose");

const BoardSchema = mongoose.Schema({
    title:{
        type: String
    },
    nickName:{
        type: String
    },
    userId: {
        type: String
    },
    viewCount:{
        type: Number,
        default: 0
    },
    content:{
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

const Board = mongoose.model("Board", BoardSchema);

module.exports = Board;