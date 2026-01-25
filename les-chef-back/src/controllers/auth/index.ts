/**
 * 인증 관련 컨트롤러 통합 export
 */

export { postLogin, getLogout, getAuth, getInfo, infoChg, idCheck, pwdChg, pwCheck } from "./local/login";
export { postJoin, delUser } from "./local/register";
export { kakaoLogin } from "./social/socialLogin";
