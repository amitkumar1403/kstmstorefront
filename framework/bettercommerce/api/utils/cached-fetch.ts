// Package Imports
import cache from 'memory-cache';
import { toNumber } from 'lodash';

// Other Imports
import fetcher from '@framework/fetcher';
import { NEXT_PUBLIC_API_CACHING_LOG_ENABLED, NEXT_PUBLIC_DEFAULT_CACHE_TIME } from '@components/utils/constants';

/**
 * Returns cached data for GET endpoint with absolute expiration limits.
 * Generates a fresh xhr call, if previous cache is invalidated.
 * @param url 
 * @param cookies 
 * @param headers 
 * @param cacheTimeInMilliSecs 
 * @returns 
 */
export const cachedGetData = async (url: string, cookies?: any, headers?: any, cacheTimeInMilliSecs?: number) => {
    const LOG_ENABLED = NEXT_PUBLIC_API_CACHING_LOG_ENABLED && NEXT_PUBLIC_API_CACHING_LOG_ENABLED === "true";
    const time = cacheTimeInMilliSecs || toNumber(NEXT_PUBLIC_DEFAULT_CACHE_TIME);
    const cachedResponse = cache.get(url);
    if (cachedResponse) {
        if (LOG_ENABLED) {
            console.log(`Cache found for '${url}'`);
        }

        return cachedResponse;
    } else {
        if (LOG_ENABLED) {
            console.log(`Cache NOT found for '${url}'`);
        }

        const data = await fetcher({
            url: url,
            method: 'get',
            cookies: cookies,
            headers: headers,
            logRequest: LOG_ENABLED,
        });

        cache.put(url, data, time);
        return data;
    }
};

export const lookupCache = (url: string) => {
    return cache.get(url);
};

export const addCache = (url: string, data: any, cacheTimeInMilliSecs?: number) => {
    const time = cacheTimeInMilliSecs || toNumber(NEXT_PUBLIC_DEFAULT_CACHE_TIME);
    cache.put(url, data, time);
};

/**
 * Clears cache for the supplied-in key.
 * Clears everything when no key is supplied.
 * @param key 
 */
export const clearCache = (key?: string) => {
    if (key) {
        cache.del(key);
    } else {
        cache.clear();
    }
};