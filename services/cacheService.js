// services/cacheService.js

// Lưu ý: cache này chỉ tồn tại trong từng lambda, 
// Vercel kill instance là mất. Tạm chấp nhận cho MVP.
const cache = new Map();

function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;

  const { value, expiresAt } = item;
  if (expiresAt && Date.now() > expiresAt) {
    cache.delete(key);
    return null;
  }
  return value;
}

function setCache(key, value, ttlMs) {
  const expiresAt = ttlMs ? Date.now() + ttlMs : null;
  cache.set(key, { value, expiresAt });
}

module.exports = {
  getCache,
  setCache
};
