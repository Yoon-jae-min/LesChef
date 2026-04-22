import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import https from 'https';
import http from 'http';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { dbConnect } from './config/dbConnect';
import logger from './utils/system/logger';
import errorHandler from './middleware/error/errorHandler';
import {
    apiLimiter,
    authLimiter,
    uploadLimiter,
    validateInput,
} from './middleware/security/security';
import validateEnvVars from './middleware/validation/envValidator';
import { warnIfS3IntentButInvalid } from './config/storage';

// 환경 변수 검증
validateEnvVars();
warnIfS3IntentButInvalid();

// 라우터
import authRouter from './routers/auth';
import recipe from './routers/recipe';
import board from './routers/board';
import foods from './routers/foods';
import ingredientPrice from './routers/ingredientPrice';
import { healthCheck } from './controllers/health';

// MongoDB 연결
dbConnect().catch((error: Error) => {
    logger.error('❌ DB connection error:', { error });
    process.exit(1); // 연결 실패 시 프로세스 종료
});

const app = express();
/**
 * Render/Vercel 같은 환경에서 TLS는 프록시에서 종료되고,
 * Node 앱은 HTTP로 요청을 받는 경우가 많습니다.
 * req.ip / https 판별 등을 위해 프록시를 신뢰합니다.
 */
app.set('trust proxy', 1);

const corsOriginUrls = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
const allowedOrigins =
    corsOriginUrls.length > 0
        ? corsOriginUrls
        : [
              // Fallback so deploys don't silently break when CORS_ORIGIN is missing/misconfigured.
              // Prefer setting CORS_ORIGIN explicitly in production.
              'https://leschef-web.vercel.app',
          ];
const connectSrcDirectives = ["'self'", ...corsOriginUrls];
const helmetCspDisabled =
    process.env.HELMET_CSP === '0' ||
    process.env.HELMET_CSP === 'false' ||
    process.env.HELMET_CSP === 'off';

// Helmet.js - 보안 헤더 (순수 JSON API면 HELMET_CSP=off 로 CSP 끌 수 있음)
app.use(
    helmet({
        contentSecurityPolicy: helmetCspDisabled
            ? false
            : {
                  directives: {
                      defaultSrc: ["'self'"],
                      styleSrc: ["'self'", "'unsafe-inline'"],
                      scriptSrc: ["'self'"],
                      imgSrc: ["'self'", 'data:', 'https:'],
                      connectSrc: connectSrcDirectives,
                      fontSrc: ["'self'"],
                      objectSrc: ["'none'"],
                      mediaSrc: ["'self'"],
                      frameSrc: ["'none'"],
                  },
              },
        crossOriginEmbedderPolicy: false,
    })
);

// 개발 등: 인증서 경로가 있어도 HTTP만 쓰고 싶을 때 .env 에 DISABLE_HTTPS=1 (또는 true)
const disableHttps =
    process.env.DISABLE_HTTPS === '1' ||
    process.env.DISABLE_HTTPS === 'true' ||
    process.env.DISABLE_HTTPS === 'yes';

// SSL 인증서 파일 확인 및 옵션 설정
let httpsOptions: { key: Buffer; cert: Buffer } | null = null;

if (disableHttps) {
    logger.info('ℹ️  DISABLE_HTTPS 가 설정되어 HTTP 모드로 실행합니다. (SSL 경로는 사용하지 않음)');
} else if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
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
                cert: fs.readFileSync(certPath),
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

const portRaw = process.env.PORT ?? '3001';
const PORT = parseInt(portRaw, 10);
if (Number.isNaN(PORT) || PORT < 1 || PORT > 65535) {
    logger.error('❌ PORT 환경 변수가 올바르지 않습니다.', { PORT: portRaw });
    process.exit(1);
}

/** SSL 파일을 읽었을 때만 true → HTTPS */
const useHttps = httpsOptions !== null;

// CORS 설정
const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow non-browser requests (curl, server-to-server) with no Origin header.
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Ensure all preflight requests get a CORS response.
app.options('*', cors(corsOptions));

// JSON 파싱 미들웨어 (크기 제한)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// 응답 압축 (gzip) - JSON 파싱 이후, 라우터 이전에 위치
app.use(
    compression({
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
        },
    })
);

// 입력 검증 및 sanitization
app.use(validateInput);

// Rate Limiting 적용
app.use('/customer/login', authLimiter);
app.use('/customer/join', authLimiter);
app.use('/customer/findId', authLimiter);
app.use('/customer/verifyPasswordReset', authLimiter);
app.use('/customer/resetPassword', authLimiter);
app.use('/foods/upload-item-image', authLimiter);
app.use('/recipe/write', uploadLimiter);
app.use('/api', apiLimiter);

// 정적 파일 경로 설정 (이미지 폴더 서빙)
app.use('/Image', express.static(path.join(__dirname, '..', 'public', 'Image')));
app.use('/Video', express.static(path.join(__dirname, '..', 'public', 'Video')));

// 헬스체크 엔드포인트 (라우터 설정 전에 위치)
app.get('/health', healthCheck);

// 라우터 설정
app.use('/customer', authRouter);
app.use('/recipe', recipe);
app.use('/board', board);
app.use('/foods', foods);
app.use('/ingredient-price', ingredientPrice);

// 404 핸들러 (API 라우트에만 적용)
app.use((req: Request, res: Response, next: NextFunction): void => {
    // API 라우트인 경우에만 404 반환
    if (
        req.path.startsWith('/customer') ||
        req.path.startsWith('/recipe') ||
        req.path.startsWith('/board') ||
        req.path.startsWith('/foods') ||
        req.path.startsWith('/ingredient-price')
    ) {
        res.status(404).json({
            error: true,
            message: '요청한 리소스를 찾을 수 없습니다.',
        });
        return;
    }
    next();
});

// 전역 에러 핸들러 (모든 라우터 이후에 위치해야 함)
app.use(errorHandler);

const bindHost = process.env.BIND_HOST || '0.0.0.0';
const publicBase =
    process.env.SERVER_ADDRESS ||
    process.env.SERVER_URL ||
    (useHttps ? `https://localhost:${PORT}` : `http://localhost:${PORT}`);

if (useHttps && httpsOptions) {
    https.createServer(httpsOptions, app).listen(PORT, bindHost, () => {
        logger.info(`✅ HTTPS 서버 실행 중 — PORT=${PORT}, host=${bindHost}`, { publicBase });
    });
} else {
    http.createServer(app).listen(PORT, bindHost, () => {
        logger.info(`✅ HTTP 서버 실행 중 — PORT=${PORT}, host=${bindHost}`, { publicBase });
    });
}
