/**
 * 보관함 항목 이미지 업로드 (웹: 파일 선택 / 앱: 멀티파트 동일)
 */

import asyncHandler from 'express-async-handler';
import fs from 'fs/promises';
import path from 'path';
import { Response } from 'express';
import { ApiErrorResponse, ApiSuccessResponse, MulterRequest } from '../../types';
import { getUserId } from '../../middleware/auth/auth';
import { isS3Storage } from '../../config/storage';
import { uploadBufferToObjectStorage } from '../../utils/storage/objectStorage';
import { foodsItemGeneratedFileName, foodsItemUserFolder } from '../../uploads/foodsItemImg';
import logger from '../../utils/system/logger';

interface UploadSuccess extends ApiSuccessResponse {
    imageUrl: string;
}

export const uploadFoodItemImage = asyncHandler(
    async (req: MulterRequest, res: Response<UploadSuccess | ApiErrorResponse>) => {
        const userId = getUserId(req);

        if (!req.file?.buffer) {
            res.status(400).json({
                error: true,
                message: '이미지 파일(itemImage)이 필요합니다.',
            });
            return;
        }

        const folder = foodsItemUserFolder(userId);
        const filename = foodsItemGeneratedFileName(req.file.originalname || 'photo.jpg');

        try {
            if (isS3Storage()) {
                const objectKey = `foods-items/${folder}/${filename}`;
                const imageUrl = await uploadBufferToObjectStorage({
                    objectKey,
                    body: req.file.buffer,
                    contentType: req.file.mimetype || 'image/jpeg',
                });
                res.status(200).json({
                    error: false,
                    imageUrl,
                });
                return;
            }

            const relativeDir = path.join('Image', 'FoodsStorage', folder);
            // dist/controllers/foods → 프로젝트 루트/public
            const destDir = path.join(__dirname, '..', '..', '..', 'public', relativeDir);
            await fs.mkdir(destDir, { recursive: true });
            const fullPath = path.join(destDir, filename);
            await fs.writeFile(fullPath, req.file.buffer);

            const imageUrl = `/${relativeDir.replace(/\\/g, '/')}/${filename}`;
            res.status(200).json({
                error: false,
                imageUrl,
            });
        } catch (error) {
            logger.error('보관함 이미지 업로드 실패', { error });
            res.status(500).json({
                error: true,
                message: '이미지 업로드에 실패했습니다.',
            });
        }
    }
);
