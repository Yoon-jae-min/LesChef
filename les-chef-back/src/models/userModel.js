const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id:{
        type: String,
        required: [true, "아이디를 입력해주세요."]
    },
    pwd:{
        type: String,
        required: [true, "패스워드를 입력해주세요."]
    },
    name:{
        type: String,
        required: [true, "이름을 입력해주세요."]
    },
    nickName:{
        type: String,
        required: [true, "닉네임을 입력해주세요."]
    },
    tel:{
        type: String
    }
},{
    timestamps: true
});


const User = mongoose.model("User",userSchema);

module.exports = User;