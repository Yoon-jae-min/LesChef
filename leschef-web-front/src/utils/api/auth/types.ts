/**
 * 인증 API 타입 정의
 */

export type SignupData = {
  id: string; // 로그인 아이디 (@ 불가)
  email: string; // 연락·인증용 이메일
  pwd: string; // 비밀번호
  name?: string; // 이름 (선택)
  nickName: string; // 닉네임
  tel?: string; // 전화번호 (선택)
};

export type LoginData = {
  customerId: string; // 로그인 아이디
  customerPwd: string; // 비밀번호
};

export type LoginResponse = {
  text: string;
  id: string;
  name: string;
  nickName: string;
  tel: string;
};

export type UserInfoResponse = {
  id: string;
  nickName: string;
  name: string;
  tel: string;
  checkAdmin: boolean;
  /** 일반 가입 `common`, SNS는 `kakao` | `google` | `naver` 등 */
  userType?: string;
  kakaoLinked?: boolean;
  googleLinked?: boolean;
  naverLinked?: boolean;
  text: boolean;
};

export type UpdateUserProfileParams = {
  nickName: string;
  tel?: string;
};
