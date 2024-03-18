import redisInterface from "./redis.js";

interface CacheTypes {
    redis: string;
}

export const cacheTypes: CacheTypes = {
    redis: 'redis',
}

export const cacheType = {
    redis: redisInterface
}

export function setCacheType(type: string) {
    switch (type) {
        case cacheTypes.redis:
            return cacheType.redis
        default:
            throw new Error('cache type not specified or available')
    }
}

function generateKey(type: string, key: string) {
    return `${type}-${JSON.parse(key)}`;
}

type KeyType = string | null;
const cache = setCacheType(cacheTypes.redis);

export const cacheInterfaceHelpers = {
    async flushCache() {
        return cache.flush();
    },
    async put(section: string, key: KeyType, data,  expireAfter?: number) {
        key = !key ? section : generateKey(section, JSON.stringify(key));
        cache.put(key, data);
        this.expire(section, key, expireAfter);
    },
    async get(section: string, key: KeyType) {
        let response;
        key = !key ? section : generateKey(section, JSON.stringify(key));

        if (await cache.exists(key)) {
            response = await cache.get(key);
        } else {
            response = null;
        }
        return response;
    },
    async remove(section: string, key: KeyType) {
        let response;
        key = !key ? section : generateKey(section, JSON.stringify(key));

        if (await cache.exists(key)) {
            response = await cache.delete(key);
        } else {
            response = null;
        }
        return response;
    },
    async expire(section: string, key: KeyType, expireAfter?: number) {
        key = !key ? section : generateKey(section, JSON.stringify(key));
        cache.expire(key, expireAfter ?? 600);// 10 mins 60secs === 1min
    }
}