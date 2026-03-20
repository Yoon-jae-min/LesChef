/**
 * 보관 재료 유틸리티 함수 테스트
 */

import { getDday, getPriority, formatDday } from "../utils/helpers/storageUtils";

describe("storageUtils 테스트", () => {
  describe("getDday", () => {
    beforeEach(() => {
      // 현재 날짜를 고정 (2024-01-15로 가정)
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-01-15"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("미래 날짜의 D-Day를 올바르게 계산해야 함", () => {
      const result = getDday("2024-01-20");
      expect(result).toBe(5); // 5일 후
    });

    it("오늘 날짜는 0을 반환해야 함", () => {
      const result = getDday("2024-01-15");
      expect(result).toBe(0);
    });

    it("과거 날짜는 음수를 반환해야 함", () => {
      const result = getDday("2024-01-10");
      expect(result).toBe(-5); // 5일 전
    });

    it("잘못된 날짜 형식은 null을 반환해야 함", () => {
      const result = getDday("invalid-date");
      expect(result).toBeNull();
    });
  });

  describe("getPriority", () => {
    it('null일 때 "정보 없음"을 반환해야 함', () => {
      const result = getPriority(null);
      expect(result.label).toBe("정보 없음");
      expect(result.tone).toContain("gray");
    });

    it('음수일 때 "폐기 필요"를 반환해야 함', () => {
      const result = getPriority(-1);
      expect(result.label).toBe("폐기 필요");
      expect(result.tone).toContain("red");
    });

    it('0-2일일 때 "긴급"을 반환해야 함', () => {
      expect(getPriority(0).label).toBe("긴급");
      expect(getPriority(1).label).toBe("긴급");
      expect(getPriority(2).label).toBe("긴급");
      expect(getPriority(0).tone).toContain("orange");
    });

    it('3-5일일 때 "주의"를 반환해야 함', () => {
      expect(getPriority(3).label).toBe("주의");
      expect(getPriority(5).label).toBe("주의");
      expect(getPriority(3).tone).toContain("yellow");
    });

    it('6일 이상일 때 "안정"을 반환해야 함', () => {
      expect(getPriority(6).label).toBe("안정");
      expect(getPriority(10).label).toBe("안정");
      expect(getPriority(6).tone).toContain("green");
    });
  });

  describe("formatDday", () => {
    it('null일 때 "-"를 반환해야 함', () => {
      expect(formatDday(null)).toBe("-");
    });

    it('0일 때 "D-DAY"를 반환해야 함', () => {
      expect(formatDday(0)).toBe("D-DAY");
    });

    it('양수일 때 "D-{일수}" 형식을 반환해야 함', () => {
      expect(formatDday(1)).toBe("D-1");
      expect(formatDday(5)).toBe("D-5");
      expect(formatDday(10)).toBe("D-10");
    });

    it('음수일 때 "D+{일수}" 형식을 반환해야 함', () => {
      expect(formatDday(-1)).toBe("D+1");
      expect(formatDday(-5)).toBe("D+5");
    });
  });
});
