import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import path from 'path';
// import https from 'https'; // [임시 개발용] HTTPS 비활성화로 주석 처리
import http from 'http';
import fs from 'fs';
import MongoStore from 'connect-mongo';
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { dbConnect } from "./config/dbConnect";
import { SESSION_TTL_SECONDS, SESSION_MAX_AGE_MS } from "./constants";
import logger from "./utils/system/logger";
import errorHandler from "./middleware/error/errorHandler";
import { apiLimiter, authLimiter, uploadLimiter, validateInput } from "./middleware/security/security";
import validateEnvVars from "./middleware/validation/envValidator";

// 환경 변수 검증
validateEnvVars();

// 라우터
import authRouter from "./routers/auth";
import recipe from "./routers/recipe";
import board from "./routers/board";
import foods from "./routers/foods";
import ingredientPrice from "./routers/ingredientPrice";
import { healthCheck } from "./controllers/health";

// MongoDB 연결
dbConnect().catch((error: Error) => {
    logger.error('❌ DB connection error:', { error });
    process.exit(1); // 연결 실패 시 프로세스 종료
});

const app = express();

// Helmet.js - 보안 헤더 설정
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false, // CORS와 호환을 위해
}));

// SSL 인증서 파일 확인 및 옵션 설정
let httpsOptions: { key: Buffer; cert: Buffer } | null = null;

if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
    const keyPath = path.isAbsolute(process.env.SSL_KEY_PATH) 
        ? process.env.SSL_KEY_PATH 
        : path.join(__dirname, '..', process.env.SSL_KEY_PATH);
    const certPath = path.isAbsolute(process.env.SSL_CERT_PATH) 
        ? process.env.SSL_CERT_PATH 
        : path.join(__dirname, '..', process.env.SSL_CERT_PATH);
    
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        try {
            httpsOptions = {
                key: fs.readFileSync(keyPath),
                cert: fs.readFileSync(certPath)
            };
            logger.info('✅ SSL 인증서를 찾았습니다. HTTPS 모드로 실행합니다.');
        } catch (error) {
            if (error instanceof Error) {
                logger.warn('⚠️  SSL 인증서 파일 읽기 실패:', error.message);
            }
        }
    } else {
        logger.warn('⚠️  SSL 인증서 파일을 찾을 수 없습니다. HTTP 모드로 실행합니다.');
    }
} else {
    logger.info('ℹ️  SSL 인증서 경로가 설정되지 않았습니다. HTTP 모드로 실행합니다.');
}

// 세션 설정
const mongoStore = MongoStore.create({
    mongoUrl: process.env.DB_CONNECT, 
    ttl: SESSION_TTL_SECONDS, 
    collectionName: 'sessions'
});

app.use(session({
    store: mongoStore,
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId', // 기본 'connect.sid' 대신 커스텀 이름 사용
    cookie: {
        secure: false, // 개발 환경: HTTP 사용 시 false (HTTPS 사용 시 true로 변경 필요)
        maxAge: SESSION_MAX_AGE_MS, // 1시간
        httpOnly: true, // XSS 방지
        sameSite: 'lax', // 개발 환경: HTTP 사용 시 'lax' (HTTPS 사용 시 'none'으로 변경 필요)
        signed: true, // 쿠키 서명
        domain: process.env.COOKIE_DOMAIN || undefined // 도메인 제한 (필요시)
    },
    // 세션 고정 공격 방지
    genid: () => {
        return require('crypto').randomBytes(16).toString('hex');
    }
}));

// CORS 설정 (세션 이후에 위치)
app.use(cors({
    origin: process.env.CORS_ORIGIN.split(','), 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// JSON 파싱 미들웨어 (크기 제한)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// 응답 압축 (gzip) - JSON 파싱 이후, 라우터 이전에 위치
app.use(compression({
    // 1KB 이상인 응답만 압축 (작은 응답은 압축 오버헤드가 더 큼)
    threshold: 1024,
    // 압축 레벨 (1-9, 기본값: -1 = 기본 레벨)
    level: 6,
    // 압축할 MIME 타입 필터
    filter: (req: Request, res: Response) => {
        // 이미 압축된 응답은 제외
        if (req.headers['x-no-compression']) {
            return false;
        }
        // compression 미들웨어가 기본적으로 처리하는 타입 사용
        return compression.filter(req, res);
    }
}));

// 입력 검증 및 sanitization
app.use(validateInput);

// Rate Limiting 적용
app.use('/customer/login', authLimiter);
app.use('/customer/join', authLimiter);
app.use('/recipe/write', uploadLimiter);
app.use('/api', apiLimiter);

// 정적 파일 경로 설정 (이미지 폴더 서빙)
app.use('/Image', express.static(path.join(__dirname, '..', 'public', 'Image')));
app.use('/Video', express.static(path.join(__dirname, '..', 'public', 'Video')));

// 헬스체크 엔드포인트 (라우터 설정 전에 위치)
app.get("/health", healthCheck);

// 라우터 설정
app.use("/customer", authRouter);
app.use("/recipe", recipe);
app.use("/board", board);
app.use("/foods", foods);
app.use("/ingredient-price", ingredientPrice);

// 404 핸들러 (API 라우트에만 적용)
app.use((req: Request, res: Response, next: NextFunction): void => {
    // API 라우트인 경우에만 404 반환
    if (req.path.startsWith('/customer') || 
        req.path.startsWith('/recipe') || 
        req.path.startsWith('/board') || 
        req.path.startsWith('/foods') ||
        req.path.startsWith('/ingredient-price')) {
        res.status(404).json({
            error: true,
            message: '요청한 리소스를 찾을 수 없습니다.'
        });
        return;
    }
    next();
});

// 전역 에러 핸들러 (모든 라우터 이후에 위치해야 함)
app.use(errorHandler);

// [임시 개발용] HTTP 서버 실행
const HTTP_PORT = 3001; // 개발 시 사용할 HTTP 포트
http.createServer(app).listen(HTTP_PORT, "0.0.0.0", () => {
    logger.warn(`[개발 모드] HTTP 서버가 실행 중입니다: http://localhost:${HTTP_PORT}`);
});

/** [임시 개발용] HTTPS 비활성화 및 HTTP 강제 실행 (복구 시 아래 블록 주석 해제)
const PORT = parseInt(process.env.PORT || (httpsOptions ? '443' : '3000'), 10);
const SERVER_URL = process.env.SERVER_URL || (httpsOptions ? `https://localhost:${PORT}` : `http://localhost:${PORT}`);

if (httpsOptions) {
    https.createServer(httpsOptions, app).listen(PORT, "0.0.0.0", () => {
        logger.info(`HTTPS 서버가 실행 중입니다. ${SERVER_URL}`);
    });
} else {
    http.createServer(app).listen(PORT, "0.0.0.0", () => {
        logger.info(`HTTP 서버가 실행 중입니다. ${SERVER_URL}`);
    });
}
*/

