/**
 * 에러 포맷팅 함수 테스트
 */

import { formatErrorMessage, formatErrorForUser } from "../utils/helpers/error/format";
import type { ApiError } from "../utils/helpers/error/types";

describe("error format 테스트", () => {
  describe("formatErrorMessage", () => {
    it("ApiError 객체의 message를 반환해야 함", () => {
      const apiError: ApiError = {
        error: true,
        message: "테스트 에러 메시지",
      };
      expect(formatErrorMessage(apiError)).toBe("테스트 에러 메시지");
    });

    it("ApiError에 details가 있으면 첫 번째 detail의 message를 반환해야 함", () => {
      const apiError: ApiError = {
        error: true,
        message: "기본 메시지",
        details: [
          {
            field: "email",
            fieldName: "이메일",
            message: "이메일 형식이 올바르지 않습니다.",
          },
        ],
      };
      expect(formatErrorMessage(apiError)).toBe("이메일 형식이 올바르지 않습니다.");
    });

    it("일반 Error 객체의 message를 반환해야 함", () => {
      const error = new Error("일반 에러 메시지");
      expect(formatErrorMessage(error)).toBe("일반 에러 메시지");
    });

    it("알 수 없는 에러는 기본 메시지를 반환해야 함", () => {
      expect(formatErrorMessage(null)).toBe("알 수 없는 오류가 발생했습니다.");
      expect(formatErrorMessage(undefined)).toBe("알 수 없는 오류가 발생했습니다.");
      expect(formatErrorMessage("string")).toBe("알 수 없는 오류가 발생했습니다.");
    });
  });

  describe("formatErrorForUser", () => {
    it("에러를 사용자 친화적인 형태로 변환해야 함", () => {
      const apiError: ApiError = {
        error: true,
        message: "테스트 에러",
        details: [
          {
            field: "email",
            fieldName: "이메일",
            message: "이메일이 필요합니다.",
          },
        ],
      };

      const result = formatErrorForUser(apiError);
      expect(result.message).toBe("이메일이 필요합니다.");
      expect(result.details).toHaveLength(1);
      expect(result.details[0].field).toBe("email");
    });

    it("일반 Error도 변환할 수 있어야 함", () => {
      const error = new Error("네트워크 오류");
      const result = formatErrorForUser(error);
      expect(result.message).toBe("네트워크 오류");
      expect(result.details).toBeDefined();
    });
  });
});
