import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { IFoods } from '../../types';

export interface FoodItemSchema {
    /** 비우려면 사진(imageUrl)이 있어야 함 — 신규는 이름·사진 중 하나 이상 */
    name: string;
    /** 비우려면 이름이 있어야 함 — 신규는 이름·사진 중 하나 이상 */
    imageUrl: string;
    volume: number;
    unit: string;
    expirate: Date;
}

export interface PlaceSchema {
    name: string;
    foodList: FoodItemSchema[];
}

export interface FoodsDocument extends IFoods, Document {
    _id: Types.ObjectId;
    place: PlaceSchema[];
}

export interface FoodsLean {
    _id: Types.ObjectId;
    userId: string;
    place: Array<{
        _id: Types.ObjectId;
        name: string;
        foodList: Array<{
            _id: Types.ObjectId;
            name: string;
            imageUrl?: string;
            volume: number;
            unit: string;
            expirate: Date;
        }>;
    }>;
    createAt: Date;
    updateAt: Date;
}

const FoodsSchema = new Schema<FoodsDocument>({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    place: [
        {
            name: {
                type: String,
                required: true,
            },
            foodList: [
                {
                    name: {
                        type: String,
                        default: '',
                    },
                    imageUrl: {
                        type: String,
                        default: '',
                    },
                    volume: {
                        type: Number,
                        default: 0,
                    },
                    unit: {
                        type: String,
                        default: '',
                    },
                    expirate: {
                        type: Date,
                        required: true,
                        index: true,
                    },
                },
            ],
        },
    ],
    createAt: {
        type: Date,
        default: () => new Date().setMilliseconds(0),
    },
    updateAt: {
        type: Date,
        default: () => new Date().setMilliseconds(0),
    },
});

FoodsSchema.index({ userId: 1 });
FoodsSchema.index({ 'place.foodList.expirate': 1 });

const Foods: Model<FoodsDocument> = mongoose.model<FoodsDocument>('foods', FoodsSchema);

export default Foods;
