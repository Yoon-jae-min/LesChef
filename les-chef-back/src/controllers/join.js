const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const { response } = require("express");

const postJoin = asyncHandler(async (req, res) => {
    const { id, pwd, name, nickName, tel } = req.body;

    const secure_pwd = await bcrypt.hash(pwd, 10);

    const userAdd = await User.create({
        id, 
        pwd: secure_pwd, 
        name, 
        nickName, 
        tel,
        userType: "common"
    });
    
    res.send("ok");
});

const delUser = asyncHandler(async(req, res) => {
    const userId = req.session.user.id;
    const userType = req.session.user.userType;
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
        req.session.destroy(err => {
            if (err) return res.status(500).send('Error Delete User');
            res.clearCookie('connect.sid');
            res.status(200).send({
                result: true
            })
        });

        if(userType !== "common"){
            fetch(`https://kapi.kakao.com/v1/user/unlink`,{
                method: "POST",
                headers: {
                    "Content-Type":"application/x-www-form-urlencoded;charset=utf-8",
                    "Authorization": `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`
                },
                body: {
                    target_id_type: "user_id",
                    target_id: Number(userId.split("_")[1])
                }
            }).then(response => response).catch(err => {
                console.log(err);
            });
        }
    }
});

module.exports = {postJoin, delUser};