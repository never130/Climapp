const fetch = global.fetch || require('node-fetch');

// Simple in-memory cache and rate limit. Note: serverless functions are ephemeral
// and this cache is per-instance. It's useful to reduce repeated calls within
// the same function container but not a global cache.
const CACHE = new Map(); // key -> { expires: number, body: any }
const RATE = new Map(); // ip -> { count: number, resetAt: number }

const RATE_LIMIT = 60; // requests
const RATE_WINDOW_MS = 60 * 1000; // per minute

const TTL_BY_ENDPOINT = {
  geo: 60 * 60, // 1 hour
  current: 30, // 30s
  forecast: 60, // 1m
  air: 60, // 1m
  reverse: 60 // 1m
};

function getClientIp(event) {
  // Netlify sets x-nf-client-connection-ip; fallback to x-forwarded-for
  return event.headers && (event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || event.headers['x-real-ip']) || 'unknown';
}

exports.handler = async function (event) {
  const q = event.queryStringParameters || {};
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  const clientIp = getClientIp(event);
  const now = Date.now();

  // Rate limit per IP
  const r = RATE.get(clientIp) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > r.resetAt) {
    r.count = 0;
    r.resetAt = now + RATE_WINDOW_MS;
  }
  r.count += 1;
  RATE.set(clientIp, r);
  if (r.count > RATE_LIMIT) {
    return { statusCode: 429, body: JSON.stringify({ error: 'Rate limit exceeded' }) };
  }

  const endpoint = q.endpoint;
  let targetUrl;

  if (endpoint === 'geo' && q.q) {
    targetUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q.q)}&limit=5&appid=${API_KEY}`;
  } else if (endpoint === 'current' && q.lat && q.lon) {
    targetUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(q.lat)}&lon=${encodeURIComponent(q.lon)}&units=metric&lang=es&appid=${API_KEY}`;
  } else if (endpoint === 'forecast' && q.lat && q.lon) {
    targetUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${encodeURIComponent(q.lat)}&lon=${encodeURIComponent(q.lon)}&units=metric&appid=${API_KEY}`;
  } else if (endpoint === 'air' && q.lat && q.lon) {
    targetUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${encodeURIComponent(q.lat)}&lon=${encodeURIComponent(q.lon)}&appid=${API_KEY}`;
  } else if (endpoint === 'reverse' && q.lat && q.lon) {
    targetUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${encodeURIComponent(q.lat)}&lon=${encodeURIComponent(q.lon)}&limit=${encodeURIComponent(q.limit || 5)}&appid=${API_KEY}`;
  } else {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad request or missing params' }) };
  }

  // Cache key: endpoint + query string
  const cacheKey = `${endpoint}::${Object.keys(q).sort().map(k => `${k}=${q[k]}`).join('&')}`;
  const ttl = TTL_BY_ENDPOINT[endpoint] || 30;
  const cached = CACHE.get(cacheKey);
  if (cached && cached.expires > now) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'x-cache': 'HIT' },
      body: JSON.stringify(cached.body)
    };
  }

  try {
    const res = await fetch(targetUrl);
    const data = await res.json();

    // store in cache
    CACHE.set(cacheKey, { expires: now + ttl * 1000, body: data });

    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json', 'x-cache': 'MISS' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Fetch error', detail: err.message }) };
  }
};
