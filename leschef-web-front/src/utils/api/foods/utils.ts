/**
 * 식재료 API 공통 유틸리티 함수
 */

/**
 * JSON 응답을 가져오는 공통 함수
 */
export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMessage = `요청 실패: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {
      try {
        const text = await response.text();
        errorMessage = text || errorMessage;
      } catch {
        // ignore
      }
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
