import multer from 'multer';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import fs from 'fs';
import { Request } from 'express';
import { getStorageConfig } from '../config/storage';

// 허용된 이미지 MIME 타입
const ALLOWED_MIME_TYPES: string[] = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
];

// 허용된 파일 확장자
const ALLOWED_EXTENSIONS: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// 최대 파일 크기 (10MB)
const MAX_FILE_SIZE: number = 10 * 1024 * 1024;

export type RecipeListCategory = 'korean' | 'japanese' | 'chinese' | 'western' | 'other';

const categoryTrans = (category: string): RecipeListCategory => {
    const categoryMap: Record<string, RecipeListCategory> = {
        한식: 'korean',
        일식: 'japanese',
        중식: 'chinese',
        양식: 'western',
        기타: 'other',
    };

    return categoryMap[category] || 'other';
};

/** 대표·단계 이미지 경로에 쓰는 카테고리 폴더명 (한글 카테고리 → 영문) */
export function recipeListCategoryKey(majorCategory: string | undefined): RecipeListCategory {
    return categoryTrans(majorCategory || '기타');
}

const sanitizeFileName = (fileName: string): string => {
    return fileName
        .replace(/[\/\\]/g, '')
        .replace(/\.\./g, '')
        .replace(/[<>:"|?*]/g, '');
};

const generateUniqueFileName = (originalName: string): string => {
    const sanitized = sanitizeFileName(originalName);
    const extensionIndex = sanitized.lastIndexOf('.');

    if (extensionIndex === -1) {
        return `image-${crypto.randomBytes(16).toString('hex')}-${Date.now()}.jpg`;
    }

    const fileExtension = sanitized.substring(extensionIndex).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        throw new Error('허용되지 않은 파일 형식입니다.');
    }

    return `${crypto.randomBytes(16).toString('hex')}-${Date.now()}${fileExtension}`;
};

/**
 * S3/R2 등 객체 스토리지로 보낼 때는 임시 폴더에 먼저 저장.
 * STORAGE_DRIVER=s3 이지만 필수 env 누락 시에는 로컬 디스크로 폴백 (컨트롤러 isS3Storage()와 동일)
 */
function useObjectStorageUpload(): boolean {
    try {
        return getStorageConfig().driver === 's3';
    } catch {
        return false;
    }
}

// Multer 파일 타입 확장
export interface MulterFileWithPath extends Express.Multer.File {
    /** 로컬: /Image/...  |  객체 스토리지 업로드용 object key (앞 슬래시 없음) */
    newPath?: string;
}

const diskStorageLocal = multer.diskStorage({
    destination: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) {
        try {
            if (!req.body.recipeInfo) {
                return cb(new Error('레시피 정보가 없습니다.'), '');
            }

            const recipeInfo = JSON.parse(req.body.recipeInfo as string);
            const { majorCategory } = recipeInfo;

            if (!majorCategory) {
                return cb(new Error('카테고리가 없습니다.'), '');
            }

            const category = categoryTrans(majorCategory);

            let destPath: string;
            if (file.fieldname === 'recipeImgFile') {
                destPath = path.join(
                    __dirname,
                    `../../public/Image/RecipeImage/ListImg/${category}`
                );
            } else if (file.fieldname === 'recipeStepImgFiles') {
                // 레시피 ID는 multer 시점에 없을 수 있어 임시 디렉터리에만 저장 → 컨트롤러에서 step/{카테고리}/{recipeId}/ 로 이동
                destPath = os.tmpdir();
            } else {
                return cb(new Error('잘못된 파일 필드명입니다.'), '');
            }

            const normalizedPath = path.normalize(destPath);
            const basePath = path.normalize(path.join(__dirname, '../../public'));

            if (file.fieldname === 'recipeImgFile') {
                if (!normalizedPath.startsWith(basePath)) {
                    return cb(new Error('잘못된 파일 경로입니다.'), '');
                }
            }

            fs.mkdirSync(normalizedPath, { recursive: true });
            cb(null, normalizedPath);
        } catch (error) {
            cb(error as Error, '');
        }
    },
    filename: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) {
        try {
            const recipeInfo = JSON.parse(req.body.recipeInfo as string);
            const { majorCategory } = recipeInfo;
            const category = categoryTrans(majorCategory);

            const uniqueName = generateUniqueFileName(file.originalname);

            const fileWithPath = file as MulterFileWithPath;
            if (file.fieldname === 'recipeImgFile') {
                fileWithPath.newPath = `/Image/RecipeImage/ListImg/${category}/${uniqueName}`;
            } else if (file.fieldname === 'recipeStepImgFiles') {
                fileWithPath.newPath = undefined;
            }

            cb(null, uniqueName);
        } catch (error) {
            cb(error as Error, '');
        }
    },
});

/** 임시 디스크 → 컨트롤러에서 S3 업로드 후 삭제. newPath는 버킷 object key (슬래시 없음) */
const diskStorageTempForS3 = multer.diskStorage({
    destination: function (
        _req: Request,
        _file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) {
        cb(null, os.tmpdir());
    },
    filename: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) {
        try {
            const recipeInfo = JSON.parse(req.body.recipeInfo as string);
            const { majorCategory } = recipeInfo;
            const category = categoryTrans(majorCategory);

            const uniqueName = generateUniqueFileName(file.originalname);

            const fileWithPath = file as MulterFileWithPath;
            if (file.fieldname === 'recipeImgFile') {
                fileWithPath.newPath = `Image/RecipeImage/ListImg/${category}/${uniqueName}`;
            } else if (file.fieldname === 'recipeStepImgFiles') {
                fileWithPath.newPath = undefined;
            }

            cb(null, uniqueName);
        } catch (error) {
            cb(error as Error, '');
        }
    },
});

const storage = useObjectStorageUpload() ? diskStorageTempForS3 : diskStorageLocal;

type MulterFileFilterDone = (error: Error | null, acceptFile: boolean) => void;

const upload = multer({
    storage,
    fileFilter: function (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        const done = cb as MulterFileFilterDone;
        if (!file) {
            return done(new Error('파일이 없습니다.'), false);
        }

        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return done(
                new Error('허용되지 않은 파일 형식입니다. (JPEG, PNG, GIF, WEBP만 허용)'),
                false
            );
        }

        const ext = path.extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return done(new Error('허용되지 않은 파일 확장자입니다.'), false);
        }

        done(null, true);
    },
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 11,
    },
}).fields([
    { name: 'recipeImgFile', maxCount: 1 },
    { name: 'recipeStepImgFiles', maxCount: 10 },
]);

export { upload };
