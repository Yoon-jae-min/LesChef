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
        default: "user"
    },
    nickName:{
        type: String,
        default: "nickName"
    },
    tel:{
        type: String,
        default: ""
    },
    profileImg:{
        type: String,
        default: ""
    },
    checkAdmin:{
        type: Boolean,
        default: false
    },
    userType:{
        type: String,
        default: "common"
    },
    createdAt:{ 
        type: Date,
        default: () => new Date().setMilliseconds(0)
    },
    updatedAt:{
        type: Date,
        default: () => new Date().setMilliseconds(0)
    }
});


const User = mongoose.model("User",userSchema);

module.exports = User;