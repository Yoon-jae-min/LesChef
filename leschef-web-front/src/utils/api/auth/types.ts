/**
 * 인증 API 타입 정의
 */

export type SignupData = {
  id: string; // 이메일 또는 아이디
  pwd: string; // 비밀번호
  name?: string; // 이름 (선택)
  nickName: string; // 닉네임
  tel?: string; // 전화번호 (선택)
};

export type LoginData = {
  customerId: string; // 이메일 또는 아이디
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
  text: boolean;
};

