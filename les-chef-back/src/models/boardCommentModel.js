const mongoose = require("mongoose");

const BoardCommentSchema = mongoose.Schema({
    boardId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"
    },
    nickName:{
        type: String
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

const BoardComment = mongoose.model("BoardComment", BoardCommentSchema);

module.exports = BoardComment;