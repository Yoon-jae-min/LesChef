import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../../../models/user/userModel';
import { validateEmailOrId, validatePassword } from '../../../middleware/security/security';
import { ApiSuccessResponse, ApiErrorResponse } from '../../../types';
import logger from '../../../utils/system/logger';

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

            // 아이디 형식 검증
            if (!validateEmailOrId(customerId)) {
                res.status(400).json({
                    error: true,
                    message: '아이디 형식이 올바르지 않습니다.',
                });
                return;
            }

            // MongoDB Injection 방지 - Mongoose는 자동으로 처리하지만 명시적으로 검증
            const findUser = await User.findOne({ id: customerId }).lean();

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

            req.session.user = {
                id: findUser.id,
                nickName: findUser.nickName || 'user',
                userType: 'common',
            };

            // 세션 저장 후 응답
            req.session.save((err) => {
                if (err) {
                    logger.error('세션 저장 오류', { error: err });
                    res.status(500).json({
                        error: true,
                        message: '세션 저장 중 오류가 발생했습니다.',
                    });
                    return;
                }
                res.status(200).json({
                    error: false,
                    text: 'login Success',
                    id: findUser.id,
                    name: findUser.name,
                    nickName: findUser.nickName,
                    tel: findUser.tel,
                });
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
    req.session.destroy((err) => {
        if (err) {
            logger.error('로그아웃 오류', { error: err });
            res.status(500).json({
                error: true,
                message: '로그아웃 중 오류가 발생했습니다.',
            });
            return;
        }
        res.clearCookie('connect.sid');
        res.status(200).json({
            error: false,
            message: 'Logged out',
        });
    });
};

//getAuth
export const getAuth = (
    req: Request,
    res: Response<(ApiSuccessResponse & { loggedIn: boolean }) | ApiErrorResponse>
): void => {
    try {
        if (req.session?.user) {
            res.status(200).json({
                error: false,
                loggedIn: true,
            });
        } else {
            res.clearCookie('connect.sid');
            res.status(200).json({
                error: false,
                loggedIn: false,
            });
        }
    } catch (error) {
        logger.error('인증 확인 오류', { error });
        res.status(500).json({
            error: true,
            message: '인증 확인 중 오류가 발생했습니다.',
            loggedIn: false,
        });
    }
};

//유저 정보 조회
export const getInfo = asyncHandler(
    async (req: Request, res: Response<ApiSuccessResponse | ApiErrorResponse>) => {
        if (!req.session?.user?.id) {
            res.status(401).json({
                error: true,
                text: false,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        try {
            const userData = await User.findOne({ id: req.session.user.id });

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
        if (!req.session?.user?.id) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
                result: false,
            });
            return;
        }

        const userId = req.session.user.id;
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

            if (req.session.user) {
                req.session.user.nickName = nickName;
            }
            try {
                await new Promise<void>((resolve, reject) => {
                    req.session.save((err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            } catch (saveErr) {
                logger.error('프로필 수정 후 세션 저장 오류', { error: saveErr });
                res.status(500).json({
                    error: true,
                    message: '프로필은 저장되었으나 세션 갱신에 실패했습니다. 다시 로그인해 주세요.',
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

    try {
        const user = await User.findOne({ id: id });

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
        const userId = req.session?.user?.id;
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
        const userId = req.session?.user?.id;
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
