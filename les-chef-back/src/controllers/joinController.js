const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const postJoin = asyncHandler(async (req, res) => {
    const { id, pwd, name, nickName, tel } = req.body;

    const secure_pwd = await bcrypt.hash(pwd, 10);

    const userAdd = await User.create({
        id, 
        pwd: secure_pwd, 
        name, 
        nickName, 
        tel
    });
    
    res.send("ok");
});

module.exports = postJoin;