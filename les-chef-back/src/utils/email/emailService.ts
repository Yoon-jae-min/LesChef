/**
 * 이메일 발송 서비스
 * Nodemailer를 사용하여 이메일 인증 코드 발송
 */

import nodemailer from 'nodemailer';
import logger from '../system/logger';

const isDev = process.env.NODE_ENV !== 'production';

// 이메일 발송 설정
const createTransporter = () => {
    // Gmail SMTP 설정 (개발용)
    if (process.env.EMAIL_SERVICE === 'gmail' || !process.env.EMAIL_SERVICE) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD, // Gmail 앱 비밀번호
            },
        });
    }

    // 커스텀 SMTP 설정 (프로덕션용)
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
};

/**
 * 이메일 인증 코드 발송
 * @param email - 수신자 이메일
 * @param code - 인증 코드
 * @returns Promise<boolean>
 */
export const sendVerificationCode = async (email: string, code: string): Promise<boolean> => {
    try {
        // 이메일 설정이 없으면 개발 모드에서는 로그만 출력
        if (!process.env.EMAIL_USER && isDev) {
            logger.warn(`[개발 모드] 이메일 인증 코드: ${code} (${email})`);
            return true; // 개발 모드에서는 항상 성공
        }

        if (!process.env.EMAIL_USER) {
            throw new Error('이메일 설정이 없습니다.');
        }

        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || `"LesChef" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'LesChef 이메일 인증 코드',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; text-align: center;">LesChef 이메일 인증</h2>
                    <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin: 20px 0;">
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            안녕하세요!<br>
                            LesChef 회원가입을 위한 이메일 인증 코드입니다.
                        </p>
                        <div style="background-color: #fff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <p style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px; margin: 0;">
                                ${code}
                            </p>
                        </div>
                        <p style="color: #999; font-size: 14px; line-height: 1.6;">
                            이 코드는 10분간 유효합니다.<br>
                            본인이 요청하지 않은 경우 이 이메일을 무시하셔도 됩니다.
                        </p>
                    </div>
                    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                        © LesChef. All rights reserved.
                    </p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        if (isDev) {
            logger.info(`이메일 발송 성공: ${email}`, { messageId: info.messageId });
        }

        return true;
    } catch (error) {
        logger.error('이메일 발송 실패', { error, email });
        throw error;
    }
};
