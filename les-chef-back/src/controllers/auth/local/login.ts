import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../../../models/user/userModel';
import { validateLoginId, validatePassword } from '../../../middleware/security/security';
import { ApiSuccessResponse, ApiErrorResponse } from '../../../types';
import logger from '../../../utils/system/logger';
import RefreshToken from '../../../models/auth/refreshTokenModel';
import {
    getAccessTtlSeconds,
    getRefreshTtlSeconds,
    makeRefreshJti,
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from '../../../utils/auth/token';

interface LoginRequestBody {
    customerId?: string;
    customerPwd?: string;
}

interface LoginSuccessResponse extends ApiSuccessResponse {
    text: string;
    id: string;
    name?: string;
    nickName?: string;
    tel?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresInSeconds?: number;
}

//postLogin
export const postLogin = asyncHandler(
    async (
        req: Request<{}, LoginSuccessResponse | ApiErrorResponse, LoginRequestBody>,
        res: Response<LoginSuccessResponse | ApiErrorResponse>
    ) => {
        try {
            const { customerId, customerPwd } = req.body;

            // 입력 검증
            if (!customerId || !customerPwd) {
                res.status(400).json({
                    error: true,
                    message: '아이디와 비밀번호를 입력해주세요.',
                });
                return;
            }

            // 아이디 형식 검증 (이메일과 별도인 로그인 아이디)
            if (!validateLoginId(customerId)) {
                res.status(400).json({
                    error: true,
                    message: '아이디 형식이 올바르지 않습니다.',
                });
                return;
            }

            const idTrim = customerId.trim();

            // MongoDB Injection 방지 - Mongoose는 자동으로 처리하지만 명시적으로 검증
            const findUser = await User.findOne({ id: idTrim }).lean();

            // 사용자 검증 (타이밍 공격 방지를 위해 항상 bcrypt.compare 실행)
            if (!findUser) {
                // 존재하지 않는 사용자도 동일한 시간이 걸리도록 더미 해시 비교
                await bcrypt.compare(customerPwd, '$2b$10$dummyhashforsecurity');
                res.status(401).json({
                    error: true,
                    message: '아이디/비밀번호가 일치하지 않습니다.',
                });
                return;
            }

            const isPasswordValid = await bcrypt.compare(customerPwd, findUser.pwd);
            if (!isPasswordValid) {
                res.status(401).json({
                    error: true,
                    message: '아이디/비밀번호가 일치하지 않습니다.',
                });
                return;
            }

            // JWT 발급 (Access + Refresh)
            const refreshJti = makeRefreshJti();
            const now = Date.now();
            const refreshExpiresAt = new Date(now + getRefreshTtlSeconds() * 1000);

            await RefreshToken.create({
                userId: findUser.id,
                jti: refreshJti,
                expiresAt: refreshExpiresAt,
            });

            const accessToken = signAccessToken({
                sub: findUser.id,
                userType: findUser.userType || 'common',
                nickName: findUser.nickName || 'user',
            });
            const refreshToken = signRefreshToken({ sub: findUser.id, jti: refreshJti });

            res.status(200).json({
                error: false,
                text: 'login Success',
                id: findUser.id,
                name: findUser.name,
                nickName: findUser.nickName,
                tel: findUser.tel,
                accessToken,
                refreshToken,
                accessTokenExpiresInSeconds: getAccessTtlSeconds(),
            });
        } catch (error) {
            logger.error('로그인 처리 중 오류', { error });
            res.status(500).json({
                error: true,
                message: '서버 오류가 발생했습니다.',
            });
        }
    }
);

//getLogout
export const getLogout = (
    req: Request,
    res: Response<ApiSuccessResponse | ApiErrorResponse>
): void => {
    // JWT 방식: 프론트에서 refreshToken 을 보내면 해당 refresh 를 폐기
    // (기존 세션 방식도 병행 가능하도록 쿠키/세션은 건드리지 않음)
    const refreshToken = (req.headers['x-refresh-token'] as string | undefined) || undefined;
    if (!refreshToken) {
        res.status(200).json({ error: false, message: 'Logged out' });
        return;
    }
    try {
        const payload = verifyRefreshToken(refreshToken);
        void RefreshToken.updateOne(
            { jti: payload.jti, userId: payload.sub },
            { $set: { revokedAt: new Date() } }
        ).exec();
    } catch {
        // ignore
    }
    res.status(200).json({ error: false, message: 'Logged out' });
};

//getAuth
export const getAuth = (
    req: Request,
    res: Response<(ApiSuccessResponse & { loggedIn: boolean }) | ApiErrorResponse>
): void => {
    try {
        // Auth 상태는 캐시되면 안 됩니다. (브라우저/프록시가 304를 만들면 프론트에서 로그인 판정이 깨짐)
        res.setHeader(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
        );
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        const auth = req.headers.authorization;
        const token =
            typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
        if (token) {
            try {
                verifyAccessToken(token);
                res.status(200).json({ error: false, loggedIn: true });
                return;
            } catch {
                // fallthrough
            }
        }

        // 세션 방식 호환 (기존 클라이언트가 있으면 true)
        if ((req as any).session?.user) {
            res.status(200).json({
                error: false,
                loggedIn: true,
            });
        } else {
            res.status(200).json({
                error: false,
                loggedIn: false,
            });
        }
    } catch (error) {
        logger.error('인증 확인 오류', { error });
        if (!res.headersSent) {
            res.status(500).json({
                error: true,
                message: '인증 확인 중 오류가 발생했습니다.',
                loggedIn: false,
            });
        }
    }
};

// POST /customer/refresh  (body: { refreshToken })
export const postRefresh = asyncHandler(
    async (
        req: Request<{}, (ApiSuccessResponse & { accessToken: string; refreshToken: string }) | ApiErrorResponse, any>,
        res: Response<(ApiSuccessResponse & { accessToken: string; refreshToken: string }) | ApiErrorResponse>
    ) => {
        const refreshToken = req.body?.refreshToken;
        if (!refreshToken || typeof refreshToken !== 'string') {
            res.status(400).json({ error: true, message: 'refreshToken 이 필요합니다.' });
            return;
        }

        let payload: { sub: string; jti: string };
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            res.status(401).json({ error: true, message: 'refreshToken 이 유효하지 않습니다.' });
            return;
        }

        const tokenDoc = await RefreshToken.findOne({ jti: payload.jti, userId: payload.sub }).lean();
        if (!tokenDoc || tokenDoc.revokedAt || new Date(tokenDoc.expiresAt).getTime() <= Date.now()) {
            res.status(401).json({ error: true, message: 'refreshToken 이 만료/폐기되었습니다.' });
            return;
        }

        // rotation: revoke old and issue new
        const newJti = makeRefreshJti();
        const refreshExpiresAt = new Date(Date.now() + getRefreshTtlSeconds() * 1000);

        await RefreshToken.updateOne(
            { jti: payload.jti },
            { $set: { revokedAt: new Date(), replacedByJti: newJti } }
        );
        await RefreshToken.create({
            userId: payload.sub,
            jti: newJti,
            expiresAt: refreshExpiresAt,
        });

        const user = await User.findOne({ id: payload.sub }).lean();
        const accessToken = signAccessToken({
            sub: payload.sub,
            userType: user?.userType || 'common',
            nickName: user?.nickName || 'user',
        });
        const newRefreshToken = signRefreshToken({ sub: payload.sub, jti: newJti });

        res.status(200).json({
            error: false,
            accessToken,
            refreshToken: newRefreshToken,
        });
    }
);

//유저 정보 조회
export const getInfo = asyncHandler(
    async (req: Request, res: Response<ApiSuccessResponse | ApiErrorResponse>) => {
        const userId = req.auth?.sub;
        if (!userId) {
            res.status(401).json({ error: true, text: false, message: '로그인이 필요합니다.' });
            return;
        }

        try {
            const userData = await User.findOne({ id: userId });

            if (!userData) {
                res.status(404).json({
                    error: true,
                    text: false,
                    message: '사용자를 찾을 수 없습니다.',
                });
                return;
            }

            res.status(200).json({
                error: false,
                id: userData.id,
                nickName: userData.nickName,
                name: userData.name,
                tel: userData.tel,
                checkAdmin: userData.checkAdmin,
                userType: userData.userType || 'common',
                kakaoLinked: !!userData.kakaoId,
                googleLinked: !!userData.googleId,
                naverLinked: !!userData.naverId,
                text: true as unknown as false,
            });
        } catch (error) {
            throw error;
        }
    }
);

//유저 정보 변경
interface InfoChgRequestBody {
    nickName?: string;
    tel?: string;
}

export const infoChg = asyncHandler(
    async (
        req: Request<{}, ApiSuccessResponse | ApiErrorResponse, InfoChgRequestBody>,
        res: Response<ApiSuccessResponse | ApiErrorResponse>
    ) => {
        const userId = req.auth?.sub;
        if (!userId) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
                result: false,
            });
            return;
        }

        const { nickName, tel } = req.body;

        if (!nickName) {
            res.status(400).json({
                error: true,
                message: '닉네임은 필수입니다.',
                result: false,
            });
            return;
        }

        try {
            const user = await User.findOne({ id: userId });
            if (!user) {
                res.status(404).json({
                    error: true,
                    message: '사용자를 찾을 수 없습니다.',
                    result: false,
                });
                return;
            }

            const result = await User.updateOne(
                { id: userId },
                {
                    $set: {
                        nickName,
                        tel: tel || '',
                    },
                }
            );

            if (result.modifiedCount === 0) {
                res.status(400).json({
                    error: true,
                    message: '변경된 내용이 없습니다.',
                    result: false,
                });
                return;
            }

            res.status(200).json({
                error: false,
                message: 'success',
                result: true as unknown as false,
            });
        } catch (error) {
            throw error;
        }
    }
);

//id 중복 확인
export const idCheck = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        res.status(400).json({
            error: true,
            message: '아이디가 필요합니다.',
        });
        return;
    }

    if (!validateLoginId(id)) {
        res.status(400).json({
            error: true,
            message: '아이디 형식이 올바르지 않습니다.',
        });
        return;
    }

    try {
        const user = await User.findOne({ id: id.trim() });

        if (user) {
            res.status(200).send('중복');
        } else {
            res.status(200).send('중복 아님');
        }
    } catch (error) {
        throw error;
    }
});

interface PwdChgRequestBody {
    currentPwd?: string;
    newPwd?: string;
}

/** 로그인 세션 기준 비밀번호 변경 (현재 비밀번호 확인 후 새 비밀번호로 갱신) */
export const pwdChg = asyncHandler(
    async (
        req: Request<{}, ApiSuccessResponse | ApiErrorResponse, PwdChgRequestBody>,
        res: Response<ApiSuccessResponse | ApiErrorResponse>
    ) => {
        const userId = req.auth?.sub;
        if (!userId) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        const { currentPwd, newPwd } = req.body;

        if (!currentPwd || !newPwd) {
            res.status(400).json({
                error: true,
                message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.',
            });
            return;
        }

        if (currentPwd === newPwd) {
            res.status(400).json({
                error: true,
                message: '새 비밀번호는 현재 비밀번호와 달라야 합니다.',
            });
            return;
        }

        const newPwdCheck = validatePassword(newPwd);
        if (!newPwdCheck.valid) {
            res.status(400).json({
                error: true,
                message: newPwdCheck.message || '새 비밀번호가 조건에 맞지 않습니다.',
            });
            return;
        }

        try {
            const user = await User.findOne({ id: userId });
            if (!user) {
                res.status(404).json({
                    error: true,
                    message: '사용자를 찾을 수 없습니다.',
                });
                return;
            }

            const match = await bcrypt.compare(currentPwd, user.pwd);
            if (!match) {
                res.status(401).json({
                    error: true,
                    message: '현재 비밀번호가 일치하지 않습니다.',
                });
                return;
            }

            const hashed = await bcrypt.hash(newPwd, 10);
            await User.updateOne({ id: userId }, { $set: { pwd: hashed } });

            res.status(200).json({
                error: false,
                message: 'success',
            });
        } catch (error) {
            logger.error('비밀번호 변경 처리 중 오류', { error });
            res.status(500).json({
                error: true,
                message: '비밀번호 변경 중 서버 오류가 발생했습니다.',
            });
        }
    }
);

//패스워드 체크
interface PwCheckRequestBody {
    password?: string;
}

export const pwCheck = asyncHandler(
    async (
        req: Request<{}, ApiSuccessResponse | ApiErrorResponse, PwCheckRequestBody>,
        res: Response<ApiSuccessResponse | ApiErrorResponse>
    ) => {
        const userId = req.auth?.sub;
        if (!userId) {
            res.status(401).send({ error: true, message: 'session error' });
            return;
        }
        const { password } = req.body;
        if (!password) {
            res.status(400).send({ error: true, message: 'password Null' });
            return;
        }
        const user = await User.findOne({ id: userId }).lean();
        if (!user) {
            res.status(404).send({ error: true, message: 'not found user' });
            return;
        }

        const result = await bcrypt.compare(password, user.pwd);
        res.status(200).send({
            error: false,
            message: 'success',
            result: result,
        });
    }
);
