import mongoose, { Schema } from 'mongoose';

export interface RefreshTokenDoc {
    userId: string;
    jti: string;
    /** if set, token is revoked and cannot be used */
    revokedAt?: Date | null;
    /** rotation support: previous jti for audit/debug */
    replacedByJti?: string | null;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const RefreshTokenSchema = new Schema<RefreshTokenDoc>(
    {
        userId: { type: String, required: true, index: true },
        jti: { type: String, required: true, unique: true, index: true },
        revokedAt: { type: Date, required: false, default: null },
        replacedByJti: { type: String, required: false, default: null },
        expiresAt: { type: Date, required: true, index: true },
    },
    { timestamps: true }
);

// TTL index for cleanup (Mongo will delete documents after expiresAt)
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<RefreshTokenDoc>('RefreshToken', RefreshTokenSchema);

