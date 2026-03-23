import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { IFoods } from '../../types';

export interface FoodItemSchema {
    /** 선택(비우면 이미지·수량으로만 표시) */
    name: string;
    /** 필수(신규 등록 시 API에서 검증). 레거시 문서는 빈 문자열 가능 */
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
