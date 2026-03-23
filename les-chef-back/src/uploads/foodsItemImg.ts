/**
 * 보관함 항목 이미지 업로드 (multer memory → 로컬 디스크 또는 S3)
 */

import multer from 'multer';
import crypto from 'crypto';

const ALLOWED_MIME: string[] = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
];

const MAX_SIZE = 10 * 1024 * 1024;

const storage = multer.memoryStorage();

export const foodsItemImageUpload = multer({
    storage,
    limits: { fileSize: MAX_SIZE },
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('허용되지 않는 이미지 형식입니다. (JPEG, PNG, GIF, WebP)'));
        }
    },
}).single('itemImage');

/** 업로드용 안전한 사용자 폴더명 (이메일 등을 경로에 직접 쓰지 않음) */
export function foodsItemUserFolder(userId: string): string {
    return crypto.createHash('sha256').update(userId).digest('hex').slice(0, 24);
}

export function foodsItemGeneratedFileName(originalName: string): string {
    const extMatch = originalName.match(/\.[a-zA-Z0-9]+$/);
    const ext = extMatch ? extMatch[0].toLowerCase() : '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
    return `${crypto.randomBytes(16).toString('hex')}-${Date.now()}${safeExt}`;
}
