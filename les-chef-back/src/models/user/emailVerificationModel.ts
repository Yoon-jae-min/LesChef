import mongoose, { Schema, Model } from "mongoose";

export interface IEmailVerification {
    email: string;
    code: string;
    expiresAt: Date;
    verified?: boolean;
    createdAt: Date;
}

const emailVerificationSchema = new Schema<IEmailVerification>({
    email: {
        type: String,
        required: [true, "이메일을 입력해주세요."],
        index: true,
    },
    code: {
        type: String,
        required: [true, "인증 코드를 입력해주세요."],
    },
    expiresAt: {
        type: Date,
        required: [true, "만료 시간을 설정해주세요."],
        index: { expireAfterSeconds: 0 }, // TTL 인덱스: 만료된 문서 자동 삭제
    },
    verified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// 이메일과 코드로 검색하는 인덱스
emailVerificationSchema.index({ email: 1, code: 1 });

const EmailVerification: Model<IEmailVerification> = mongoose.model<IEmailVerification>(
    "EmailVerification",
    emailVerificationSchema
);

export default EmailVerification;

