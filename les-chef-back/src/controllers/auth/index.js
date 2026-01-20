const { postLogin, getLogout, getAuth, getInfo, infoChg, idCheck, pwdChg, pwCheck } = require("./login");
const { postJoin, delUser } = require("./register");
const { kakaoLogin } = require("./socialLogin");

module.exports = {
  postLogin,
  getLogout,
  getAuth,
  getInfo,
  infoChg,
  idCheck,
  pwdChg,
  pwCheck,
  postJoin,
  delUser,
  kakaoLogin,
};

