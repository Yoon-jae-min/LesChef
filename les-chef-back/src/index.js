const express = require("express");
const session = require("express-session");
const https = require('https');
const fs = require('fs');
const MongoStore = require('connect-mongo'); 
const cors = require("cors");
const customer = require("../src/routers/customer");
const dbConnect = require("./config/dbConnect");
require("dotenv").config();

dbConnect();

const app = express();

// SSL 인증서 파일 경로
const options = {
    key: fs.readFileSync('./src/certs/private-key.pem'), // 비밀키 파일 경로
    cert: fs.readFileSync('./src/certs/certificate.pem') // 인증서 파일 경로
};

// 세션 설정
const mongoStore = MongoStore.create({
    mongoUrl: process.env.DB_CONNECT, 
    ttl: 86400, 
    collectionName: 'sessions'
});
app.use(session({
    store: mongoStore,
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        sameSite: 'none',
        signed: true
    }
}));

// CORS 설정 (세션 이후에 위치)
app.use(cors({
    origin: 'https://localhost:3000', 
    credentials: true
}));

// JSON 파싱 미들웨어
app.use(express.json());

// 라우터 설정
app.use("/customer", customer);

// 404 핸들러
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// 서버 시작
// app.listen(5000, () => {
//     console.log('Server running on port 5000');
// });


https.createServer(options, app).listen(5000, () => {
    console.log('HTTPS 서버가 실행 중입니다. https://localhost:5000');
});