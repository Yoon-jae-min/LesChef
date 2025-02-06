const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");

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

const delInfo = asyncHandler(async(req, res) => {
    const userId = req.session.user.id;
    const user = await User.findOne({id: userId}).lean();
    const result = await User.deleteOne({id: userId});

    if(result.modifiedCount === 0){
        res.status(500).send({
            result: false
        })
    }else{
        if(!user.checkAdmin){
            await Recipe.updateMany({userId},
                {$set: {userId: null}}
            )
        }
        res.clearCookie('connect.sid');
        res.status(200).send({
            result: true
        })
    }
});

module.exports = {postJoin, delInfo};