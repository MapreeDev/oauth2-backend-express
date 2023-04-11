import { Redis } from "ioredis";

const redisConnection = {
    host: (process.env.REDIS_HOST) ? process.env.REDIS_HOST : '127.0.0.1',
    port: (process.env.REDIS_PORT) ? Number(process.env.REDIS_PORT) : 6379,
    username: (process.env.REDIS_USER) ? process.env.REDIS_USER : "default",
    password: (process.env.REDIW_PWD) ? process.env.REDIW_PWD : "",
    maxRetriesPerRequest: null
}

const redisClient = new Redis(redisConnection)

const workersRedisConnection = new Redis(redisConnection);

export { redisClient, redisConnection, workersRedisConnection }