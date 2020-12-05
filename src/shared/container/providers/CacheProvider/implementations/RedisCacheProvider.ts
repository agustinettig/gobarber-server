import Ioredis, { Redis } from 'ioredis';

import cacheConfig from '@config/cache';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
    private client: Redis;

    constructor() {
        this.client = new Ioredis(cacheConfig.config.redis);
    }

    public async save<T>(key: string, value: T): Promise<void> {
        await this.client.set(key, JSON.stringify(value));
    }

    public async recover<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);

        if (!value) {
            return null;
        }

        const parsedValue = JSON.parse(value) as T;

        return parsedValue;
    }

    public async invalidate(key: string): Promise<void> {
        await this.client.del(key);
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        const keys = await this.client.keys(`${prefix}:*`);

        const pipeline = this.client.pipeline();

        keys.forEach(key => {
            pipeline.del(key);
        });

        await pipeline.exec();
    }
}
