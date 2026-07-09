const Redis = require("ioredis");

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis({ host: "localhost", port: 6379, lazyConnect: true });

redis.on("error", (err) => {
  console.warn("Redis not available, caching disabled:", err.message);
});

const get = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
};

const set = async (key, value, ttlSeconds = 60) => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {}
};

const del = async (key) => {
  try { await redis.del(key); } catch {}
};

module.exports = { get, set, del };
