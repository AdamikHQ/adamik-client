import { LRUCache } from 'lru-cache'

const options = {
    ttl: 1000 * 60 * 5,
    ttlAutopurge: true,
}

export const cache = new LRUCache(options)