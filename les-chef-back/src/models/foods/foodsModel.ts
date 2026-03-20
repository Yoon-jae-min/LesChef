import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { IFoods } from '../../types';

// 스키마 레벨 타입 정의
export interface FoodItemSchema {
    name: string;
    volume: number;
    unit: string;
    expirate: Date;
}

export interface PlaceSchema {
    name: string;
    foodList: FoodItemSchema[];
}

// Mongoose Document 타입 (lean() 사용 전)
export interface FoodsDocument extends IFoods, Document {
    _id: Types.ObjectId;
    place: PlaceSchema[];
}

// lean() 결과 타입 (일반 객체, _id는 string으로 변환됨)
export interface FoodsLean {
    _id: Types.ObjectId;
    userId: string;
    place: Array<{
        _id: Types.ObjectId;
        name: string;
        foodList: Array<{
            _id: Types.ObjectId;
            name: string;
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
        index: true, // userId로 빠른 조회를 위한 인덱스
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
                        required: true,
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
                        index: true, // 유통기한 조회를 위한 인덱스 (복합 인덱스로 최적화 가능)
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

// 성능 최적화를 위한 인덱스 추가
FoodsSchema.index({ userId: 1 }); // userId로 조회 최적화
FoodsSchema.index({ 'place.foodList.expirate': 1 }); // 유통기한 조회 최적화

const Foods: Model<FoodsDocument> = mongoose.model<FoodsDocument>('foods', FoodsSchema);

export default Foods;
