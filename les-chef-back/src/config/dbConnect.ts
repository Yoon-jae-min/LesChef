import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/system/logger";

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';

export const dbConnect = async (): Promise<typeof mongoose> => {
    try {
        const connect = await mongoose.connect(process.env.DB_CONNECT, {
            ssl: true, // SSL 사용
        });
        
        // 연결 성공 정보 출력
        if (isDev) {
            logger.info("✅ MongoDB 연결 성공!", {
                host: connect.connection.host,
                db: connect.connection.name,
                state: connect.connection.readyState === 1 ? '연결됨' : '연결 안됨',
            });
        }
        
        // 연결 이벤트 리스너
        mongoose.connection.on('connected', () => {
            if (isDev) {
                logger.info('✅ MongoDB 연결됨');
            }
        });
        
        mongoose.connection.on('error', (err: Error) => {
            if (isDev) {
                logger.error('❌ MongoDB 연결 오류:', { error: err });
            }
        });
        
        mongoose.connection.on('disconnected', () => {
            if (isDev) {
                logger.warn('⚠️  MongoDB 연결 끊김');
            }
        });
        
        // 프로세스 종료 시 연결 종료
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            if (isDev) {
                logger.info('MongoDB 연결이 종료되었습니다.');
            }
            process.exit(0);
        });
        
        return connect;
    } catch (err) {
        const error = err as Error;
        if (isDev) {
            logger.error("❌ MongoDB 연결 실패:", { error: error.message });
            if (error.message.includes('authentication')) {
                logger.error("   - 인증 실패: 사용자 이름 또는 비밀번호를 확인하세요.");
            }
            if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
                logger.error("   - 호스트를 찾을 수 없습니다: 연결 문자열을 확인하세요.");
            }
        }
        throw err;
    }
};

// 연결 상태 확인 함수
export const checkConnection = (): {
    state: number;
    status: string;
    isConnected: boolean;
} => {
    const state = mongoose.connection.readyState;
    const states: Record<number, string> = {
        0: '연결 안됨',
        1: '연결됨',
        2: '연결 중',
        3: '연결 해제 중'
    };
    return {
        state: state,
        status: states[state] || '알 수 없음',
        isConnected: state === 1
    };
};

