/**
 * 파일 저장소 설정 (로컬 디스크 vs S3 호환 객체 스토리지)
 *
 * - 개발: STORAGE_DRIVER 생략 또는 local → 기존 public/Image 경로 사용
 * - 배포(R2/S3 등): STORAGE_DRIVER=s3 + 아래 변수 설정
 */

import logger from '../utils/system/logger';

export type StorageDriver = 'local' | 's3';

export interface S3CompatibleStorageConfig {
    driver: 's3';
    region: string;
    bucket: string;
    endpoint?: string;
    accessKeyId: string;
    secretAccessKey: string;
    /** 퍼블릭 접근 URL (끝 슬래시 없음). 예: https://pub-xxxx.r2.dev */
    publicBaseUrl: string;
    /** path-style 엔드포인트 사용 (R2/MinIO 등에서 true 권장) */
    forcePathStyle: boolean;
}

export type StorageConfig = { driver: 'local' } | S3CompatibleStorageConfig;

function parseBool(v: string | undefined, defaultValue: boolean): boolean {
    if (v === undefined || v === '') return defaultValue;
    return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());
}

export function getStorageConfig(): StorageConfig {
    const raw = (process.env.STORAGE_DRIVER || 'local').toLowerCase();
    if (raw !== 's3') {
        return { driver: 'local' };
    }

    const bucket = process.env.STORAGE_BUCKET || '';
    const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY || '';
    const publicBaseUrl = (process.env.STORAGE_PUBLIC_BASE_URL || '').replace(/\/$/, '');

    const missing: string[] = [];
    if (!bucket) missing.push('STORAGE_BUCKET');
    if (!accessKeyId) missing.push('STORAGE_ACCESS_KEY_ID');
    if (!secretAccessKey) missing.push('STORAGE_SECRET_ACCESS_KEY');
    if (!publicBaseUrl) missing.push('STORAGE_PUBLIC_BASE_URL');

    if (missing.length > 0) {
        throw new Error(`STORAGE_DRIVER=s3 인데 필수 환경 변수가 없습니다: ${missing.join(', ')}`);
    }

    return {
        driver: 's3',
        region: process.env.STORAGE_REGION || 'auto',
        bucket,
        endpoint: process.env.STORAGE_ENDPOINT || undefined,
        accessKeyId,
        secretAccessKey,
        publicBaseUrl,
        forcePathStyle: parseBool(process.env.STORAGE_S3_FORCE_PATH_STYLE, true),
    };
}

export function isS3Storage(): boolean {
    try {
        return getStorageConfig().driver === 's3';
    } catch {
        return false;
    }
}

/**
 * STORAGE_DRIVER=s3 인데 필수 env가 없을 때 한 번만 경고 (로컬 폴백과 혼동 방지)
 */
export function warnIfS3IntentButInvalid(): void {
    const raw = (process.env.STORAGE_DRIVER || '').toLowerCase().trim();
    if (raw !== 's3') return;

    try {
        getStorageConfig();
        logger.info('✅ 객체 스토리지(STORAGE_DRIVER=s3) 설정이 유효합니다.');
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        logger.warn(
            '⚠️ STORAGE_DRIVER=s3 이지만 필수 환경 변수가 부족합니다. 업로드는 로컬 디스크(public/Image)로 동작합니다. 버킷에는 저장되지 않습니다.',
            { detail: msg }
        );
    }
}
