import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../../types';

const userSchema = new Schema<IUser>({
    id: {
        type: String,
        required: [true, '아이디를 입력해주세요.'],
    },
    email: {
        type: String,
        trim: true,
        sparse: true,
        unique: true,
    },
    pwd: {
        type: String,
        required: [true, '패스워드를 입력해주세요.'],
    },
    name: {
        type: String,
        default: 'user',
    },
    nickName: {
        type: String,
        default: 'nickName',
    },
    tel: {
        type: String,
        default: '',
    },
    profileImg: {
        type: String,
        default: '',
    },
    checkAdmin: {
        type: Boolean,
        default: false,
    },
    userType: {
        type: String,
        default: 'common',
    },
    // SNS 계정 연동용 필드들 (선택값)
    kakaoId: {
        type: String,
        default: '',
    },
    googleId: {
        type: String,
        default: '',
    },
    naverId: {
        type: String,
        default: '',
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

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
