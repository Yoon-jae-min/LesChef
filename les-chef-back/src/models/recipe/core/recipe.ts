import mongoose, { Schema, Model } from 'mongoose';
import { IRecipe } from '../../../types';

const recipeSchema = new Schema<IRecipe>({
    recipeName: {
        type: String,
    },
    cookTime: {
        type: Number,
    },
    portion: {
        type: Number,
    },
    portionUnit: {
        type: String,
    },
    cookLevel: {
        type: String,
    },
    majorCategory: {
        type: String,
    },
    subCategory: {
        type: String,
    },
    recipeImg: {
        type: String,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    userId: {
        type: String,
    },
    userNickName: {
        type: String,
    },
    isShare: {
        type: Boolean,
    },
    tags: {
        type: [String],
        default: [],
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviewCount: {
        type: Number,
        default: 0,
        min: 0,
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

// 검색 성능 향상을 위한 인덱스 추가
recipeSchema.index({ recipeName: 'text' });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ majorCategory: 1, viewCount: -1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ averageRating: -1, reviewCount: -1 }); // 평점 정렬용 (평점이 같으면 리뷰 수로 정렬)
recipeSchema.index({ viewCount: -1 }); // 조회수 정렬용
// 인기순 정렬을 위한 복합 인덱스 (조회수, 평점, 리뷰 수)
recipeSchema.index({ viewCount: -1, averageRating: -1, reviewCount: -1 });

const Recipe: Model<IRecipe> = mongoose.model<IRecipe>('Recipe', recipeSchema);

export default Recipe;
