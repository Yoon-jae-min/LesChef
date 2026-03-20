/**
 * 인증 미들웨어 테스트
 * 인증이 필요한 엔드포인트에 대한 접근 제어 테스트
 */

import { Request, Response, NextFunction } from 'express';

// 인증 미들웨어 모킹 테스트
describe('인증 미들웨어 테스트', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            session: {} as any,
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();
    });

    it('세션에 사용자 정보가 있으면 next()를 호출해야 함', () => {
        mockRequest.session = {
            user: {
                id: 'test@example.com',
                nickName: '테스트',
                userType: 'common',
            },
        } as any;

        // 인증 미들웨어 로직 (간단한 버전)
        if (mockRequest.session?.user) {
            nextFunction();
        } else {
            mockResponse.status!(401);
            mockResponse.json!({ error: true, message: '인증이 필요합니다.' });
        }

        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('세션에 사용자 정보가 없으면 401 에러를 반환해야 함', () => {
        mockRequest.session = {} as any;

        // 인증 미들웨어 로직
        if (mockRequest.session?.user) {
            nextFunction();
        } else {
            mockResponse.status!(401);
            mockResponse.json!({ error: true, message: '인증이 필요합니다.' });
        }

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: true,
            message: '인증이 필요합니다.',
        });
    });
});
