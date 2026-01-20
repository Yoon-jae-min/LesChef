/**
 * 간단한 메모리 캐시 유틸리티
 * KAMIS API 응답 등에 사용
 */

class SimpleCache {
    constructor() {
        this.cache = new Map();
    }

    /**
     * 캐시에 데이터 저장
     * @param {string} key - 캐시 키
     * @param {*} value - 저장할 값
     * @param {number} ttlMs - TTL (밀리초)
     */
    set(key, value, ttlMs) {
        const expiresAt = Date.now() + ttlMs;
        this.cache.set(key, {
            value,
            expiresAt,
        });
    }

    /**
     * 캐시에서 데이터 가져오기
     * @param {string} key - 캐시 키
     * @returns {*|null} - 캐시된 값 또는 null
     */
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }

        // 만료된 항목 제거
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    /**
     * 캐시에서 항목 제거
     * @param {string} key - 캐시 키
     */
    delete(key) {
        this.cache.delete(key);
    }

    /**
     * 모든 만료된 항목 제거
     */
    cleanup() {
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
    clear() {
        this.cache.clear();
    }

    /**
     * 캐시 크기 반환
     * @returns {number}
     */
    size() {
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

module.exports = cache;

