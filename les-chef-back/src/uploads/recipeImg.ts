import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

// 허용된 이미지 MIME 타입
const ALLOWED_MIME_TYPES: string[] = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
];

// 허용된 파일 확장자
const ALLOWED_EXTENSIONS: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// 최대 파일 크기 (10MB)
const MAX_FILE_SIZE: number = 10 * 1024 * 1024;

type CategoryType = 'korean' | 'japanese' | 'chinese' | 'western' | 'other';

const categoryTrans = (category: string): CategoryType => {
    const categoryMap: Record<string, CategoryType> = {
        '한식': 'korean',
        '일식': 'japanese',
        '중식': 'chinese',
        '양식': 'western',
        '기타': 'other'
    };
    
    // 허용된 카테고리만 반환, 기본값은 'other'
    return categoryMap[category] || 'other';
};

// 파일명 sanitization (경로 traversal 공격 방지)
const sanitizeFileName = (fileName: string): string => {
    // 경로 구분자 제거
    return fileName.replace(/[\/\\]/g, '')
                   .replace(/\.\./g, '')
                   .replace(/[<>:"|?*]/g, '');
};

const generateUniqueFileName = (originalName: string): string => {
    // 파일명 sanitization
    const sanitized = sanitizeFileName(originalName);
    const extensionIndex = sanitized.lastIndexOf('.');
    
    if (extensionIndex === -1) {
        // 확장자가 없으면 .jpg로 기본 설정
        return `image-${crypto.randomBytes(16).toString('hex')}-${Date.now()}.jpg`;
    }
    
    const fileExtension = sanitized.substring(extensionIndex).toLowerCase();
    
    // 허용된 확장자인지 확인
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        throw new Error('허용되지 않은 파일 형식입니다.');
    }
    
    // 랜덤 해시를 사용하여 고유한 파일명 생성
    return `${crypto.randomBytes(16).toString('hex')}-${Date.now()}${fileExtension}`;
};

// Multer 파일 타입 확장
interface MulterFileWithPath extends Express.Multer.File {
    newPath?: string;
}

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
            try {
                // JSON 파싱 에러 처리
                if (!req.body.recipeInfo) {
                    return cb(new Error('레시피 정보가 없습니다.'), '');
                }

                const recipeInfo = JSON.parse(req.body.recipeInfo as string);
                const { majorCategory } = recipeInfo;
                
                if (!majorCategory) {
                    return cb(new Error('카테고리가 없습니다.'), '');
                }

                const category = categoryTrans(majorCategory);
                
                // 경로 traversal 공격 방지 - 정규화된 경로 사용
                let destPath: string;
                if (file.fieldname === 'recipeImgFile') {
                    destPath = path.join(__dirname, `../../public/Image/RecipeImage/ListImg/${category}`);
                } else if (file.fieldname === 'recipeStepImgFiles') {
                    destPath = path.join(__dirname, `../../public/Image/RecipeImage/InfoImg/step/${category}`);
                } else {
                    return cb(new Error('잘못된 파일 필드명입니다.'), '');
                }

                // 경로 정규화 및 검증
                const normalizedPath = path.normalize(destPath);
                const basePath = path.normalize(path.join(__dirname, '../../public'));
                
                // basePath 밖으로 나가는지 확인
                if (!normalizedPath.startsWith(basePath)) {
                    return cb(new Error('잘못된 파일 경로입니다.'), '');
                }

                cb(null, normalizedPath);
            } catch (error) {
                cb(error as Error, '');
            }
        },
        filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
            try {
                const recipeInfo = JSON.parse(req.body.recipeInfo as string);
                const { majorCategory } = recipeInfo;
                const category = categoryTrans(majorCategory);
                
                const uniqueName = generateUniqueFileName(file.originalname);

                const fileWithPath = file as MulterFileWithPath;
                if (file.fieldname === 'recipeImgFile') {
                    fileWithPath.newPath = `/Image/RecipeImage/ListImg/${category}/${uniqueName}`;
                } else if (file.fieldname === 'recipeStepImgFiles') {
                    fileWithPath.newPath = `/Image/RecipeImage/InfoImg/step/${category}/${uniqueName}`;
                }

                cb(null, uniqueName);
            } catch (error) {
                cb(error as Error, '');
            }
        }
    }),
    fileFilter: function (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        if (!file) {
            return cb(new Error('파일이 없습니다.') as any, false);
        }

        // MIME 타입 검증
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new Error('허용되지 않은 파일 형식입니다. (JPEG, PNG, GIF, WEBP만 허용)') as any, false);
        }

        // 파일 확장자 검증
        const ext = path.extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return cb(new Error('허용되지 않은 파일 확장자입니다.') as any, false);
        }

        cb(null, true);
    },
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 11 // recipeImgFile 1개 + recipeStepImgFiles 최대 10개
    }
}).fields([
    { name: 'recipeImgFile', maxCount: 1 },
    { name: 'recipeStepImgFiles', maxCount: 10 }
]);

export { upload };

