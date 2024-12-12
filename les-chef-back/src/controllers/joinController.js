const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const postJoin = asyncHandler(async (req, res) => {
    const { id, pwd, name, nickName, tel } = req.body;

    const userAdd = await User.create({
        id, pwd, name, nickName, tel
    });
    
    res.send("ok");
});

module.exports = postJoin;