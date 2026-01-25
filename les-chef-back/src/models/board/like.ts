import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { IBoardLike } from "../../types";

interface BoardLikeDocument extends IBoardLike, Document {
    boardId: Types.ObjectId;
}

const boardLikeSchema = new Schema<BoardLikeDocument>({
    boardId: {
        type: Schema.Types.ObjectId,
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

const BoardLike: Model<BoardLikeDocument> = mongoose.model<BoardLikeDocument>("BoardLike", boardLikeSchema);

export default BoardLike;

