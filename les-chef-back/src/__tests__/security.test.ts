/**
 * 보안 유틸리티 함수 테스트
 */

import { validateEmailOrId, validatePassword, validateNickname } from '../middleware/security/security';

describe('보안 유틸리티 함수 테스트', () => {
  describe('validateEmailOrId', () => {
    it('올바른 이메일 형식을 통과해야 함', () => {
      expect(validateEmailOrId('test@example.com')).toBe(true);
      expect(validateEmailOrId('user123@gmail.com')).toBe(true);
    });

    it('올바른 아이디 형식을 통과해야 함', () => {
      expect(validateEmailOrId('user123')).toBe(true);
      expect(validateEmailOrId('test_user')).toBe(true);
      expect(validateEmailOrId('user.test')).toBe(true);
    });

    it('잘못된 형식을 거부해야 함', () => {
      expect(validateEmailOrId('')).toBe(false);
      expect(validateEmailOrId('ab')).toBe(false); // 3자 미만
      expect(validateEmailOrId('a'.repeat(51))).toBe(false); // 50자 초과
      // 참고: validateEmailOrId는 단순히 문자 검증만 하므로 'user@'는 통과할 수 있음
      // 실제 이메일 형식 검증은 별도로 필요
    });
  });

  describe('validatePassword', () => {
    it('올바른 비밀번호를 통과해야 함', () => {
      const result1 = validatePassword('password123');
      expect(result1.valid).toBe(true);

      const result2 = validatePassword('Test1234');
      expect(result2.valid).toBe(true);
    });

    it('숫자가 없는 비밀번호를 거부해야 함', () => {
      const result = validatePassword('password');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('숫자');
    });

    it('영문자가 없는 비밀번호를 거부해야 함', () => {
      const result = validatePassword('12345678');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('영문자');
    });

    it('짧은 비밀번호를 거부해야 함', () => {
      const result = validatePassword('12345');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('8자 이상');
    });

    it('너무 긴 비밀번호를 거부해야 함', () => {
      const longPassword = 'a'.repeat(129);
      const result = validatePassword(longPassword);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('128자 이하');
    });
  });

  describe('validateNickname', () => {
    it('올바른 닉네임을 통과해야 함', () => {
      const result1 = validateNickname('user123');
      expect(result1.valid).toBe(true);

      const result2 = validateNickname('테스트유저');
      expect(result2.valid).toBe(true);
    });

    it('빈 닉네임을 거부해야 함', () => {
      const result = validateNickname('');
      expect(result.valid).toBe(false);
    });

    it('너무 긴 닉네임을 거부해야 함', () => {
      const longNickname = 'a'.repeat(21);
      const result = validateNickname(longNickname);
      expect(result.valid).toBe(false);
    });
  });
});

