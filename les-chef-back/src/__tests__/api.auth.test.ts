/**
 * 인증 API 통합 테스트
 * 실제 HTTP 요청을 통한 API 엔드포인트 테스트
 *
 * MongoDB(기본: process.env.DB_CONNECT 또는 mongodb://localhost:27017/test)가 떠 있어야 합니다.
 * 로컬에서만 돌릴 때: RUN_AUTH_API_INTEGRATION=1 npm test
 * (미설정 시 이 스위트는 skip — CI/로컬에서 Mongo 없이도 npm test 가 통과하도록)
 */

import request from 'supertest';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import authRouter from '../routers/auth';
import { SESSION_MAX_AGE_MS } from '../constants';

// 테스트용 Express 앱 생성
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 세션 설정 (테스트용 메모리 스토어)
    app.use(
        session({
            secret: 'test-secret-key-for-jest-testing-only',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: SESSION_MAX_AGE_MS,
                httpOnly: true,
                secure: false, // 테스트 환경에서는 false
            },
            store: MongoStore.create({
                mongoUrl: process.env.DB_CONNECT || 'mongodb://localhost:27017/test',
                touchAfter: 24 * 3600,
            }),
        })
    );

    app.use('/customer', authRouter);
    return app;
};

const runAuthApiIntegration = process.env.RUN_AUTH_API_INTEGRATION === '1';

(runAuthApiIntegration ? describe : describe.skip)('인증 API 통합 테스트', () => {
    let app: express.Application;

    jest.setTimeout(30_000);

    beforeAll(async () => {
        app = createTestApp();
    });

    describe('POST /customer/join (회원가입)', () => {
        it('올바른 데이터로 회원가입이 성공해야 함', async () => {
            const response = await request(app)
                .post('/customer/join')
                .send({
                    id: `test${Date.now()}@example.com`,
                    pwd: 'testPassword123',
                    nickName: '테스트유저',
                })
                .expect(200);

            expect(response.body.error).toBe(false);
            expect(response.body.message).toBe('ok');
        });

        it('필수 필드가 없으면 400 에러를 반환해야 함', async () => {
            const response = await request(app)
                .post('/customer/join')
                .send({
                    id: 'test@example.com',
                    // pwd 누락
                    nickName: '테스트유저',
                })
                .expect(400);

            expect(response.body.error).toBe(true);
            expect(response.body.message).toContain('필수');
        });

        it('중복된 아이디로 회원가입 시 409 에러를 반환해야 함', async () => {
            const testId = `duplicate${Date.now()}@example.com`;

            // 첫 번째 회원가입
            await request(app)
                .post('/customer/join')
                .send({
                    id: testId,
                    pwd: 'testPassword123',
                    nickName: '첫번째유저',
                })
                .expect(200);

            // 두 번째 회원가입 (중복)
            const response = await request(app)
                .post('/customer/join')
                .send({
                    id: testId,
                    pwd: 'testPassword123',
                    nickName: '두번째유저',
                })
                .expect(409);

            expect(response.body.error).toBe(true);
            expect(response.body.message).toContain('이미 사용 중');
        });

        it('비밀번호가 너무 짧으면 400 에러를 반환해야 함', async () => {
            const response = await request(app)
                .post('/customer/join')
                .send({
                    id: 'test@example.com',
                    pwd: '12345', // 8자 미만
                    nickName: '테스트유저',
                })
                .expect(400);

            expect(response.body.error).toBe(true);
            expect(response.body.message).toContain('8자 이상');
        });
    });

    describe('POST /customer/login (로그인)', () => {
        const testUser = {
            id: `logintest${Date.now()}@example.com`,
            pwd: 'testPassword123',
            nickName: '로그인테스트',
        };

        beforeAll(async () => {
            // 테스트용 사용자 생성
            await request(app).post('/customer/join').send(testUser);
        });

        it('올바른 아이디와 비밀번호로 로그인이 성공해야 함', async () => {
            const response = await request(app)
                .post('/customer/login')
                .send({
                    customerId: testUser.id,
                    customerPwd: testUser.pwd,
                })
                .expect(200);

            expect(response.body.text).toBe('login Success');
            expect(response.body.id).toBe(testUser.id);
        });

        it('잘못된 비밀번호로 로그인 시 실패해야 함', async () => {
            const response = await request(app)
                .post('/customer/login')
                .send({
                    customerId: testUser.id,
                    customerPwd: 'wrongPassword',
                })
                .expect(401);

            expect(response.body.error).toBe(true);
        });

        it('존재하지 않는 아이디로 로그인 시 실패해야 함', async () => {
            const response = await request(app)
                .post('/customer/login')
                .send({
                    customerId: 'nonexistent@example.com',
                    customerPwd: 'anyPassword',
                })
                .expect(401);

            expect(response.body.error).toBe(true);
        });
    });

    describe('POST /customer/sendVerificationCode (이메일 인증 코드 발송)', () => {
        it('올바른 이메일로 인증 코드 발송 요청이 성공해야 함', async () => {
            const response = await request(app)
                .post('/customer/sendVerificationCode')
                .send({
                    email: 'test@example.com',
                })
                .expect(200);

            expect(response.body.error).toBe(false);
            expect(response.body.message).toContain('발송');
        });

        it('이메일이 없으면 400 에러를 반환해야 함', async () => {
            const response = await request(app)
                .post('/customer/sendVerificationCode')
                .send({})
                .expect(400);

            expect(response.body.error).toBe(true);
            expect(response.body.message).toContain('이메일');
        });

        it('잘못된 이메일 형식이면 400 에러를 반환해야 함', async () => {
            const response = await request(app)
                .post('/customer/sendVerificationCode')
                .send({
                    email: 'invalid-email',
                })
                .expect(400);

            expect(response.body.error).toBe(true);
        });
    });

    describe('GET /customer/auth (인증 상태 확인)', () => {
        it('로그인하지 않은 상태에서는 false를 반환해야 함', async () => {
            const response = await request(app).get('/customer/auth').expect(200);

            expect(response.body.loggedIn).toBe(false);
        });
    });
});
