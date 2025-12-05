/**
 * 게시판 API 유틸리티 함수
 * 서버로 게시판 데이터를 전송하는 함수들
 */

// 예시 API 주소 (나중에 실제 주소로 변경)
const API_BASE_URL = "http://localhost:3000/api/board";

export type BoardWriteData = {
  title: string;
  content: string;
  id?: string; // 사용자 ID (서버에서 세션으로 가져올 수도 있음)
  nickName?: string; // 사용자 닉네임 (서버에서 세션으로 가져올 수도 있음)
};

export type BoardEditData = {
  postId: string;
  title: string;
  content: string;
};

/**
 * 게시글 작성
 * @param data 게시글 작성 데이터
 * @returns Promise<Response>
 */
export const createBoard = async (data: BoardWriteData): Promise<Response> => {
  const { title, content, id, nickName } = data;

  // 백엔드에서 id와 nickName을 body로 받고 있음
  // 세션에서 가져오는 경우 id와 nickName은 undefined로 전송해도 됨
  const response = await fetch(`${API_BASE_URL}/write`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
      ...(id && { id }), // id가 있으면 포함
      ...(nickName && { nickName }), // nickName이 있으면 포함
    }),
    credentials: "include", // 세션 쿠키를 포함하기 위해
  });

  return response;
};

/**
 * 게시글 수정
 * @param data 게시글 수정 데이터
 * @returns Promise<Response>
 * 
 * 주의: 백엔드에 edit API가 아직 없는 경우, 이 함수는 에러를 반환할 수 있습니다.
 * 백엔드에 edit API가 추가되면 이 함수를 사용할 수 있습니다.
 */
export const updateBoard = async (data: BoardEditData): Promise<Response> => {
  const { postId, title, content } = data;

  // 백엔드에 edit API가 추가되면 아래 주석을 해제하고 실제 엔드포인트로 변경
  // const response = await fetch(`${API_BASE_URL}/edit`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     postId,
  //     title,
  //     content,
  //   }),
  //   credentials: "include",
  // });

  // 임시로 에러 반환 (백엔드 API가 준비되면 위 코드로 교체)
  throw new Error("게시글 수정 API가 아직 구현되지 않았습니다. 백엔드에 edit API를 추가해주세요.");

  // return response;
};

