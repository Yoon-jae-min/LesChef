/**
 * 백엔드 JSON 응답 (ApiSuccessResponse / ApiErrorResponse) 파싱
 * response.ok 인 경우 본문을 json()으로 읽고 success 메시지를 검증합니다.
 */

export type ApiJsonBody = {
  error?: boolean;
  message?: string;
};

/**
 * @param response fetch Response (이미 response.ok 가 true 일 때 호출 권장)
 * @param expectedMessage 백엔드 success 시 message 필드 기대값 (예: 레시피 "success", 게시판 "ok")
 */
export async function assertApiJsonSuccess(
  response: Response,
  expectedMessage: string
): Promise<void> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error("서버 응답을 해석할 수 없습니다.");
  }

  if (!body || typeof body !== "object") {
    throw new Error("서버 응답 형식이 올바르지 않습니다.");
  }

  const data = body as ApiJsonBody;
  if (data.error !== false) {
    throw new Error(data.message || "요청에 실패했습니다.");
  }
  if (data.message !== expectedMessage) {
    throw new Error(data.message || "서버 응답이 예상과 다릅니다.");
  }
}
