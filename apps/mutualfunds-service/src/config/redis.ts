import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on('connect', () => {
  console.log('✅ Redis Connected Successfully');
});

redis.on('error', (err) => {
  console.log('❌ Redis Error:', err.message);
});

export default redis;