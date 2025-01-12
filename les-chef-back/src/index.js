const express = require("express");
const session = require("express-session");
const path = require('path');
const https = require('https');
const fs = require('fs');
const MongoStore = require('connect-mongo'); 
const cors = require("cors");
const dbConnect = require("./config/dbConnect");

//라우터
const customer = require("../src/routers/customer");
const recipe = require("../src/routers/recipe");
const board = require("../src/routers/board");

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
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        sameSite: 'none',
        signed: true
    }
}));

// CORS 설정 (세션 이후에 위치)
app.use(cors({
    origin: ['https://localhost:3000', 'https://172.30.1.93:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// JSON 파싱 미들웨어
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//정적 파일 경로 설정
app.use(express.static('public'));

// 라우터 설정
app.use("/customer", customer);
app.use("/recipe", recipe);
app.use("/board", board);

// 404 핸들러
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

https.createServer(options, app).listen(5000, () => {
    console.log('HTTPS 서버가 실행 중입니다. https://localhost:5000');
});