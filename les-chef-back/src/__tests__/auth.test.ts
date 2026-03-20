/**
 * 인증 관련 API 테스트
 * 실제 DB 연결 없이 모킹을 사용한 단위 테스트
 */

import bcrypt from 'bcrypt';

describe('인증 로직 테스트', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('비밀번호 해싱', () => {
        it('비밀번호가 올바르게 해싱되어야 함', async () => {
            const password = 'testPassword123';
            const hashedPassword = await bcrypt.hash(password, 10);

            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toBe(password);
            expect(hashedPassword.length).toBeGreaterThan(0);
        });

        it('해싱된 비밀번호가 원본과 일치해야 함', async () => {
            const password = 'testPassword123';
            const hashedPassword = await bcrypt.hash(password, 10);

            const isMatch = await bcrypt.compare(password, hashedPassword);
            expect(isMatch).toBe(true);
        });

        it('잘못된 비밀번호는 일치하지 않아야 함', async () => {
            const password = 'testPassword123';
            const wrongPassword = 'wrongPassword';
            const hashedPassword = await bcrypt.hash(password, 10);

            const isMatch = await bcrypt.compare(wrongPassword, hashedPassword);
            expect(isMatch).toBe(false);
        });
    });

    describe('사용자 ID 검증', () => {
        it('이메일 형식의 ID를 올바르게 인식해야 함', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            expect(emailRegex.test('user@example.com')).toBe(true);
            expect(emailRegex.test('test@gmail.com')).toBe(true);
            expect(emailRegex.test('invalid-email')).toBe(false);
            expect(emailRegex.test('user@')).toBe(false);
        });
    });
});
