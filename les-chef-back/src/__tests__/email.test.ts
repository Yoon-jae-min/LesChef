/**
 * 이메일 서비스 테스트
 */

import { sendVerificationCode } from '../utils/email/emailService';

// nodemailer 모킹
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(() => Promise.resolve({ messageId: 'test-message-id' })),
  })),
}));

describe('이메일 서비스 테스트', () => {
  beforeEach(() => {
    // 환경 변수 설정
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_APP_PASSWORD = 'test-password';
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('인증 코드 발송 함수가 존재해야 함', () => {
    expect(typeof sendVerificationCode).toBe('function');
  });

  it('개발 모드에서 이메일 설정이 없으면 로그만 출력해야 함', async () => {
    delete process.env.EMAIL_USER;
    process.env.NODE_ENV = 'development';

    // 에러가 발생하지 않아야 함
    await expect(sendVerificationCode('test@example.com', '123456')).resolves.toBe(true);
  });
});

