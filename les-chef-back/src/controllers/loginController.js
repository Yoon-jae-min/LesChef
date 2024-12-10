const asyncHandler = require("express-async-handler");

//postLogin
const postLogin = asyncHandler(async (req, res) => {
    console.log(req.body);
    res.send("ok");
});

module.exports = postLogin;