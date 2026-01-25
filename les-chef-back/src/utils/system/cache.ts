/**
 * 간단한 메모리 캐시 유틸리티
 * KAMIS API 응답 등에 사용
 */

interface CacheItem<T> {
    value: T;
    expiresAt: number;
}

class SimpleCache {
    private cache: Map<string, CacheItem<unknown>>;

    constructor() {
        this.cache = new Map();
    }

    /**
     * 캐시에 데이터 저장
     * @param key - 캐시 키
     * @param value - 저장할 값
     * @param ttlMs - TTL (밀리초)
     */
    set<T>(key: string, value: T, ttlMs: number): void {
        const expiresAt = Date.now() + ttlMs;
        this.cache.set(key, {
            value,
            expiresAt,
        });
    }

    /**
     * 캐시에서 데이터 가져오기
     * @param key - 캐시 키
     * @returns 캐시된 값 또는 null
     */
    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }

        // 만료된 항목 제거
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return item.value as T;
    }

    /**
     * 캐시에서 항목 제거
     * @param key - 캐시 키
     */
    delete(key: string): void {
        this.cache.delete(key);
    }

    /**
     * 모든 만료된 항목 제거
     */
    cleanup(): void {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * 캐시 초기화
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * 캐시 크기 반환
     * @returns 캐시 항목 개수
     */
    size(): number {
        return this.cache.size;
    }
}

// 싱글톤 인스턴스
const cache = new SimpleCache();

// 주기적으로 만료된 항목 정리 (10분마다)
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        cache.cleanup();
    }, 10 * 60 * 1000); // 10분
}

export default cache;

