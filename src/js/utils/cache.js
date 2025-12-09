// Cache utility functions using localStorage

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days (1 week)

export function saveToCache(key, data) {
    const cacheEntry = {
        data,
        timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
}

export function loadFromCache(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
    }
    
    return data;
}

export function clearCache(key) {
    if (key) {
        localStorage.removeItem(key);
    } else {
        localStorage.clear();
    }
}
