/**
 * Mongoose 모델 타입 정의
 */

import { Document, Model, Types } from 'mongoose';

// 사용자 모델 타입
export interface IUser extends Document {
  id: string;
  pwd: string;
  name?: string;
  nickName?: string;
  tel?: string;
  profileImg?: string;
  checkAdmin?: boolean;
  userType?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 레시피 모델 타입
export interface IRecipe extends Document {
  recipeName: string;
  cookTime: number;
  portion: number;
  portionUnit: string;
  cookLevel: string;
  majorCategory: string;
  subCategory?: string;
  recipeImg: string;
  viewCount: number;
  userId: string;
  userNickName?: string;
  isShare: boolean;
  tags?: string[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// 레시피 재료 모델 타입
export interface IRecipeIngredient extends Document {
  recipeId: Types.ObjectId | string;
  sortType: string;
  ingredientUnit: Array<{
    ingredientName: string;
    volume: number;
    unit: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// 레시피 단계 모델 타입
export interface IRecipeStep extends Document {
  recipeId: Types.ObjectId | string;
  stepNum: number;
  stepWay: string;
  stepImg: string;
  createdAt: Date;
  updatedAt: Date;
}

// 레시피 찜 목록 모델 타입
export interface IRecipeWishList extends Document {
  userId: Types.ObjectId | string;
  wishList: Array<{
    recipeId: Types.ObjectId | string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// 레시피 리뷰 모델 타입
export interface IRecipeReview extends Document {
  recipeId: Types.ObjectId | string;
  userId: string;
  userNickName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// 게시판 모델 타입
export interface IBoard extends Document {
  title: string;
  content: string;
  userId: string;
  nickName: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 게시판 댓글 모델 타입
export interface IBoardComment extends Document {
  boardId: Types.ObjectId | string;
  userId: string;
  nickName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// 게시판 좋아요 모델 타입
export interface IBoardLike extends Document {
  boardId: Types.ObjectId | string;
  userId: string;
  createdAt: Date;
}

// 식재료 모델 타입
export interface IFoods extends Document {
  userId: string;
  place: Array<{
    name: string;
    foodList: Array<{
      name: string;
      volume: number;
      unit: string;
      expirate: Date;
    }>;
  }>;
  createAt: Date;
  updateAt: Date;
}

