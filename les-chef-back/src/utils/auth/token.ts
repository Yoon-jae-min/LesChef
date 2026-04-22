import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export type AccessTokenPayload = {
    sub: string; // user id
    userType: string;
    nickName?: string;
};

export type RefreshTokenPayload = {
    sub: string; // user id
    jti: string; // refresh token id
};

const ACCESS_TTL_SECONDS = 60 * 10; // 10 minutes
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

export function makeRefreshJti(): string {
    return crypto.randomBytes(16).toString('hex');
}

export function signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: ACCESS_TTL_SECONDS,
    });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TTL_SECONDS,
    });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

export function getAccessTtlSeconds(): number {
    return ACCESS_TTL_SECONDS;
}

export function getRefreshTtlSeconds(): number {
    return REFRESH_TTL_SECONDS;
}

