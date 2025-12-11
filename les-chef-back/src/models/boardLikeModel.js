const mongoose = require("mongoose");

const boardLikeSchema = new mongoose.Schema({
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
        index: true,
    },
}, {
    timestamps: true
});

boardLikeSchema.index({ boardId: 1, userId: 1 }, { unique: true });

const BoardLike = mongoose.model("BoardLike", boardLikeSchema);

module.exports = BoardLike;

