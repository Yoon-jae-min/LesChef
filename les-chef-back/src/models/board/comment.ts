import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { IBoardComment } from '../../types';

interface BoardCommentDocument extends IBoardComment, Document {
    boardId: Types.ObjectId;
}

const BoardCommentSchema = new Schema<BoardCommentDocument>({
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
    },
    nickName: {
        type: String,
    },
    userId: {
        type: String,
    },
    content: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: () => new Date().setMilliseconds(0),
    },
    updatedAt: {
        type: Date,
        default: () => new Date().setMilliseconds(0),
    },
});

const BoardComment: Model<BoardCommentDocument> = mongoose.model<BoardCommentDocument>(
    'BoardComment',
    BoardCommentSchema
);

export default BoardComment;
