/**
 * Express 타입 확장
 * 세션, 요청, 응답 등에 대한 커스텀 타입 정의
 */

import { Request } from 'express';

// 세션에 저장되는 사용자 정보 타입
export interface SessionUser {
  id: string;
  nickName?: string;
  [key: string]: unknown;
}

// Express 세션 타입 확장
declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
  }
}

// Express Request 타입 확장
declare global {
  namespace Express {
    interface Request {
      session: {
        user?: SessionUser;
        destroy: (callback?: (err?: Error) => void) => void;
        [key: string]: unknown;
      };
    }
  }
}

// Multer 파일 타입
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
  newPath?: string; // 커스텀 필드 (이미지 업로드 후 경로)
}

// Multer 요청 타입 확장
export interface MulterRequest extends Request {
  files?: {
    [fieldname: string]: MulterFile[];
  } | MulterFile[];
}

