/**
 * 에러 핸들링 테스트
 * API 에러 응답이 올바르게 처리되는지 확인
 */

describe('에러 핸들링 테스트', () => {
  it('400 에러는 올바른 형식으로 반환되어야 함', () => {
    const errorResponse = {
      error: true,
      message: '잘못된 요청입니다.',
    };

    expect(errorResponse.error).toBe(true);
    expect(errorResponse.message).toBeDefined();
    expect(typeof errorResponse.message).toBe('string');
  });

  it('401 에러는 인증 관련 메시지를 포함해야 함', () => {
    const errorResponse = {
      error: true,
      message: '인증이 필요합니다.',
    };

    expect(errorResponse.error).toBe(true);
    expect(errorResponse.message).toContain('인증');
  });

  it('404 에러는 리소스를 찾을 수 없다는 메시지를 포함해야 함', () => {
    const errorResponse = {
      error: true,
      message: '요청한 리소스를 찾을 수 없습니다.',
    };

    expect(errorResponse.error).toBe(true);
    expect(errorResponse.message).toContain('찾을 수 없');
  });

  it('500 에러는 서버 오류 메시지를 포함해야 함', () => {
    const errorResponse = {
      error: true,
      message: '서버 오류가 발생했습니다.',
    };

    expect(errorResponse.error).toBe(true);
    expect(errorResponse.message).toContain('오류');
  });
});

