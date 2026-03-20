import mongoose, { Schema, Model } from 'mongoose';
import { IBoard } from '../../types';

const BoardSchema = new Schema<IBoard>({
    title: {
        type: String,
    },
    nickName: {
        type: String,
    },
    userId: {
        type: String,
    },
    viewCount: {
        type: Number,
        default: 0,
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

const Board: Model<IBoard> = mongoose.model<IBoard>('Board', BoardSchema);

export default Board;
