/**
 * 이미지 처리 유틸리티
 * 썸네일 생성 및 이미지 최적화
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { THUMBNAIL_SIZES, IMAGE_OPTIMIZATION, THUMBNAIL_DIR } from '../../constants/image/image';
import logger from '../system/logger';

export interface ThumbnailResult {
    thumbnailPath: string;
    thumbnailUrl: string;
    originalPath: string;
    originalUrl: string;
}

/**
 * 썸네일 생성
 * @param originalPath 원본 이미지 경로
 * @param thumbnailSize 썸네일 크기
 * @param outputDir 썸네일 저장 디렉토리
 * @returns 썸네일 경로 및 URL 정보
 */
export async function generateThumbnail(
    originalPath: string,
    thumbnailSize: { width: number; height: number },
    outputDir: string
): Promise<ThumbnailResult> {
    try {
        // 원본 파일 존재 확인
        await fs.access(originalPath);

        // 썸네일 디렉토리 생성
        const thumbnailDir = path.join(outputDir, THUMBNAIL_DIR);
        await fs.mkdir(thumbnailDir, { recursive: true });

        // 썸네일 파일명 생성 (원본 파일명에 _thumb 접미사 추가)
        const originalFileName = path.basename(originalPath);
        const ext = path.extname(originalFileName);
        const nameWithoutExt = path.basename(originalFileName, ext);
        const thumbnailFileName = `${nameWithoutExt}_thumb${ext}`;
        const thumbnailPath = path.join(thumbnailDir, thumbnailFileName);

        // 썸네일 생성 (WebP 포맷으로 최적화)
        await sharp(originalPath)
            .resize(thumbnailSize.width, thumbnailSize.height, {
                fit: 'cover',
                position: 'center',
            })
            .webp({ quality: IMAGE_OPTIMIZATION.WEBP_QUALITY })
            .toFile(thumbnailPath);

        // URL 경로 생성 (원본 경로 기준)
        const originalDir = path.dirname(originalPath);
        const relativePath = path.relative(originalDir, thumbnailPath);
        const thumbnailUrl = path
            .join(path.dirname(originalPath.replace(/\\/g, '/')), relativePath)
            .replace(/\\/g, '/');

        // 원본 URL 경로
        const originalUrl = originalPath.replace(/\\/g, '/').replace(/.*\/public/, '');

        logger.info('썸네일 생성 완료', {
            originalPath,
            thumbnailPath,
            size: thumbnailSize,
        });

        return {
            thumbnailPath,
            thumbnailUrl: thumbnailUrl.replace(/.*\/public/, ''),
            originalPath,
            originalUrl,
        };
    } catch (error) {
        logger.error('썸네일 생성 실패', { error, originalPath });
        throw error;
    }
}

/**
 * 이미지 최적화 (크기 조정 및 포맷 변환)
 * @param imagePath 이미지 경로
 * @param maxDimensions 최대 크기
 * @param outputPath 출력 경로 (선택사항, 없으면 원본 덮어쓰기)
 * @returns 최적화된 이미지 경로
 */
export async function optimizeImage(
    imagePath: string,
    maxDimensions: { width: number; height: number },
    outputPath?: string
): Promise<string> {
    try {
        const output = outputPath || imagePath;
        const image = sharp(imagePath);
        const metadata = await image.metadata();

        // 이미지가 최대 크기보다 크면 리사이즈
        if (metadata.width && metadata.height) {
            if (metadata.width > maxDimensions.width || metadata.height > maxDimensions.height) {
                await image
                    .resize(maxDimensions.width, maxDimensions.height, {
                        fit: 'inside',
                        withoutEnlargement: true,
                    })
                    .webp({ quality: IMAGE_OPTIMIZATION.WEBP_QUALITY })
                    .toFile(output);
            } else {
                // 크기가 적절하면 포맷만 변환
                await image.webp({ quality: IMAGE_OPTIMIZATION.WEBP_QUALITY }).toFile(output);
            }
        }

        logger.info('이미지 최적화 완료', { imagePath, output, maxDimensions });
        return output;
    } catch (error) {
        logger.error('이미지 최적화 실패', { error, imagePath });
        throw error;
    }
}

/**
 * 레시피 리스트 이미지 썸네일 생성
 */
export async function generateRecipeListThumbnail(
    originalPath: string,
    outputDir: string
): Promise<ThumbnailResult> {
    return generateThumbnail(originalPath, THUMBNAIL_SIZES.LIST, outputDir);
}

/**
 * 레시피 단계 이미지 썸네일 생성
 */
export async function generateRecipeStepThumbnail(
    originalPath: string,
    outputDir: string
): Promise<ThumbnailResult> {
    return generateThumbnail(originalPath, THUMBNAIL_SIZES.STEP, outputDir);
}
