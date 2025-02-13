const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    try{
        const connect = await mongoose.connect(process.env.DB_CONNECT,{
      		ssl: true, // SSL 사용
      	});
        console.log("DB Connected");
    }catch(err){
        console.log(err);
    }
}

module.exports = dbConnect;
