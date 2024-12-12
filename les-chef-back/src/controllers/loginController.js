const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//postLogin
const postLogin = asyncHandler(async (req, res) => {
    const findUser = await User.find({id: req.body.customerId});
    let resText = "";

    resText = (findUser.length === 0) ? "아이디 없음" : (findUser.pwd !== req.body.customerPwd) ? "패스워드 틀림" : "로그인 성공";

    res.send(resText);
});

module.exports = postLogin;