/**
 * 보관함 항목에 연결된 이미지 파일/객체 삭제
 */

import fs from 'fs/promises';
import path from 'path';
import { deleteObjectByPublicUrlIfManaged } from '../storage/objectStorage';
import logger from '../system/logger';

export async function deleteFoodItemImageIfAny(imageUrl: string | undefined | null): Promise<void> {
    if (!imageUrl || typeof imageUrl !== 'string') return;
    const trimmed = imageUrl.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        try {
            await deleteObjectByPublicUrlIfManaged(trimmed);
        } catch (error) {
            logger.warn('보관함 이미지(객체 스토리지) 삭제 실패', { error, trimmed });
        }
        return;
    }

    if (trimmed.startsWith('/Image/')) {
        const rel = trimmed.replace(/^\/+/, '');
        const full = path.join(process.cwd(), 'public', rel);
        try {
            await fs.unlink(full);
        } catch {
            /* 없으면 무시 */
        }
    }
}
