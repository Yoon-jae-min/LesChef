/**
 * S3 호환 객체 스토리지 업로드/삭제 (AWS S3, Cloudflare R2, MinIO 등)
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getStorageConfig, type S3CompatibleStorageConfig } from '../../config/storage';
import logger from '../system/logger';

let s3Client: S3Client | null = null;
/** 설정이 바뀌면 클라이언트 재생성 */
let s3ClientCacheKey = '';

function getS3Client(cfg: S3CompatibleStorageConfig): S3Client {
    const cacheKey = `${cfg.region}|${cfg.endpoint ?? ''}|${cfg.bucket}|${cfg.accessKeyId}|${cfg.forcePathStyle}`;
    if (s3Client && s3ClientCacheKey === cacheKey) {
        return s3Client;
    }
    s3ClientCacheKey = cacheKey;
    s3Client = new S3Client({
        region: cfg.region,
        endpoint: cfg.endpoint,
        credentials: {
            accessKeyId: cfg.accessKeyId,
            secretAccessKey: cfg.secretAccessKey,
        },
        forcePathStyle: cfg.forcePathStyle,
    });
    return s3Client;
}

/**
 * 버퍼를 객체 스토리지에 올리고, 브라우저에서 쓸 퍼블릭 URL 반환
 * @param objectKey 슬래시 없이 또는 앞 슬래시 허용 (저장 시 정규화)
 */
export async function uploadBufferToObjectStorage(params: {
    objectKey: string;
    body: Buffer;
    contentType: string;
}): Promise<string> {
    const cfg = getStorageConfig();
    if (cfg.driver !== 's3') {
        throw new Error(
            'uploadBufferToObjectStorage는 STORAGE_DRIVER=s3 일 때만 사용할 수 있습니다.'
        );
    }

    const key = params.objectKey.replace(/^\/+/, '');
    const client = getS3Client(cfg);

    try {
        await client.send(
            new PutObjectCommand({
                Bucket: cfg.bucket,
                Key: key,
                Body: params.body,
                ContentType: params.contentType,
            })
        );
        return `${cfg.publicBaseUrl}/${key}`;
    } catch (error) {
        logger.error('객체 스토리지 업로드 실패', { error, key });
        throw error;
    }
}

/**
 * 퍼블릭 URL이 현재 설정의 STORAGE_PUBLIC_BASE_URL 이면 해당 객체 삭제
 */
export async function deleteObjectByPublicUrlIfManaged(publicUrl: string): Promise<void> {
    if (!publicUrl.startsWith('http://') && !publicUrl.startsWith('https://')) {
        return;
    }

    let cfg: S3CompatibleStorageConfig;
    try {
        const c = getStorageConfig();
        if (c.driver !== 's3') return;
        cfg = c;
    } catch {
        return;
    }

    const base = cfg.publicBaseUrl;
    if (!publicUrl.startsWith(base + '/') && publicUrl !== base) {
        logger.warn('삭제 스킵: 관리 중인 퍼블릭 URL이 아님', { publicUrl, base });
        return;
    }

    const key = publicUrl.slice(base.length).replace(/^\/+/, '');
    if (!key) return;

    const client = getS3Client(cfg);
    try {
        await client.send(
            new DeleteObjectCommand({
                Bucket: cfg.bucket,
                Key: key,
            })
        );
    } catch (error) {
        logger.error('객체 스토리지 삭제 실패', { error, key });
        throw error;
    }
}
