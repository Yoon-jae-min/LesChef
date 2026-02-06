/**
 * 인증 유틸리티 함수 테스트
 */

import {
  checkLoginStatus,
  getCurrentUser,
  getCurrentUserId,
  clearAuthStorage,
} from '../utils/helpers/authUtils';
import { STORAGE_KEYS } from '@/constants/storage/storageKeys';

// localStorage 모킹
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

beforeEach(() => {
  // window 객체 모킹
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
    writable: true,
  });
  jest.clearAllMocks();
});

describe('authUtils 테스트', () => {
  describe('checkLoginStatus', () => {
    it('로그인 상태가 true일 때 true를 반환해야 함', () => {
      mockLocalStorage.getItem.mockReturnValue('true');
      expect(checkLoginStatus()).toBe(true);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.IS_LOGGED_IN);
    });

    it('로그인 상태가 false일 때 false를 반환해야 함', () => {
      mockLocalStorage.getItem.mockReturnValue('false');
      expect(checkLoginStatus()).toBe(false);
    });

    it('로그인 상태가 없을 때 false를 반환해야 함', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      expect(checkLoginStatus()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('유효한 사용자 정보를 올바르게 파싱해야 함', () => {
      const userInfo = {
        id: 'test@example.com',
        name: '테스트',
        nickName: '테스트유저',
        tel: '010-1234-5678',
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(userInfo));

      const result = getCurrentUser();
      expect(result).toEqual(userInfo);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.CURRENT_USER);
    });

    it('id가 없는 사용자 정보는 null을 반환해야 함', () => {
      const invalidUserInfo = {
        name: '테스트',
        nickName: '테스트유저',
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(invalidUserInfo));

      const result = getCurrentUser();
      expect(result).toBeNull();
    });

    it('잘못된 JSON 형식은 null을 반환해야 함', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      const result = getCurrentUser();
      expect(result).toBeNull();
    });

    it('사용자 정보가 없을 때 null을 반환해야 함', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('getCurrentUserId', () => {
    it('사용자 ID를 올바르게 반환해야 함', () => {
      const userInfo = {
        id: 'test@example.com',
        nickName: '테스트유저',
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(userInfo));

      const result = getCurrentUserId();
      expect(result).toBe('test@example.com');
    });

    it('사용자 정보가 없을 때 null을 반환해야 함', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = getCurrentUserId();
      expect(result).toBeNull();
    });
  });

  describe('clearAuthStorage', () => {
    it('모든 인증 관련 스토리지를 제거해야 함', () => {
      clearAuthStorage();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.IS_LOGGED_IN);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.CURRENT_USER);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.RETURN_TO);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.FROM_SOURCE);
    });
  });
});

