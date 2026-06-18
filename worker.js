/**
 * ══════════════════════════════════════════
 * MAC MYTHOS — CLOUDFLARE WORKER (PRODUCTION)
 * ══════════════════════════════════════════
 *
 * SETUP:
 * 1. Cloudflare Dashboard → Workers → Edit Code → Paste this
 * 2. Settings → Variables → Add: ANTHROPIC_API_KEY = sk-ant-...
 * 3. Save & Deploy
 *
 * FEATURES:
 * - API key hidden server-side (never exposed to browser)
 * - Rate limiting: 20 req/min per IP
 * - Input sanitization & validation
 * - CORS locked to your domain
 * - Request logging for analytics
 * - Abuse detection
 */

// ── CONFIG ─────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://subtle-bombolone-5e900d.netlify.app',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
];
const RATE_LIMIT = 20;        // requests per window
const RATE_WINDOW = 60;       // seconds
const MAX_TOKENS = 600;       // max response tokens
const MAX_MSG_LEN = 2000;     // max chars per message
const MAX_HISTORY = 12;       // max conversation turns

// ── IN-MEMORY RATE LIMITER ─────────────────────
const rlMap = new Map();

function checkRateLimit(ip) {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `${ip}:${Math.floor(now / RATE_WINDOW)}`;
  const count = (rlMap.get(windowKey) || 0) + 1;
  rlMap.set(windowKey, count);
  // Cleanup old entries
  if (rlMap.size > 2000) {
    const cutoff = Math.floor(now / RATE_WINDOW) - 2;
    for (const [k] of rlMap) {
      if (k.endsWith(':'+cutoff) || k.endsWith(':'+(cutoff-1))) rlMap.delete(k);
    }
  }
  return { allowed: count <= RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - count), count };
}

// ── CORS HEADERS ───────────────────────────────
function getCORSHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

// ── JSON RESPONSE ──────────────────────────────
function jsonRes(body, status=200, extraHeaders={}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });
}

// ── MAIN HANDLER ───────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const cors = getCORSHeaders(origin);

    // ── PREFLIGHT ──────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // ── METHOD CHECK ───────────────────────────
    if (request.method !== 'POST') {
      return jsonRes({ error: { type: 'method_not_allowed', message: 'Only POST allowed' } }, 405, cors);
    }

    // ── RATE LIMIT ─────────────────────────────
    const ip = request.headers.get('CF-Connecting-IP') ||
               request.headers.get('X-Forwarded-For') || 'unknown';
    const rl = checkRateLimit(ip);
    const rlHeaders = {
      ...cors,
      'X-RateLimit-Limit': String(RATE_LIMIT),
      'X-RateLimit-Remaining': String(rl.remaining),
      'X-RateLimit-Window': String(RATE_WINDOW),
    };

    if (!rl.allowed) {
      return jsonRes({
        error: { type: 'rate_limit_error', message: `Rate limit exceeded. ${RATE_LIMIT} requests per ${RATE_WINDOW}s. Try again later.` }
      }, 429, { ...rlHeaders, 'Retry-After': String(RATE_WINDOW) });
    }

    // ── PARSE BODY ─────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonRes({ error: { type: 'invalid_request', message: 'Invalid JSON body' } }, 400, cors);
    }

    // ── VALIDATE ───────────────────────────────
    if (!body.messages || !Array.isArray(body.messages) || !body.messages.length) {
      return jsonRes({ error: { type: 'invalid_request', message: 'messages array required' } }, 400, cors);
    }

    // ── SANITIZE ───────────────────────────────
    const cleanMessages = body.messages
      .slice(-MAX_HISTORY)
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && m.content)
      .map(m => ({
        role: m.role,
        content: String(m.content).substring(0, MAX_MSG_LEN).trim()
      }));

    if (!cleanMessages.length) {
      return jsonRes({ error: { type: 'invalid_request', message: 'No valid messages' } }, 400, cors);
    }

    const cleanSystem = body.system
      ? String(body.system).substring(0, 1000).trim()
      : 'You are a helpful AI assistant in Mac Mythos platform.';

    // ── CALL ANTHROPIC ─────────────────────────
    // API key comes from Worker env variable — NEVER from client
    const ANTHROPIC_KEY = env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_KEY) {
      return jsonRes({ error: { type: 'config_error', message: 'Server configuration error' } }, 500, cors);
    }

    try {
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: MAX_TOKENS,
          system: cleanSystem,
          messages: cleanMessages,
        }),
      });

      const data = await upstream.json();

      // Log usage (non-blocking)
      ctx.waitUntil(Promise.resolve(
        console.log(JSON.stringify({
          ts: new Date().toISOString(),
          ip: ip.substring(0,10)+'***',
          tokens: data.usage,
          status: upstream.status,
        }))
      ));

      return new Response(JSON.stringify(data), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json', ...rlHeaders }
      });

    } catch (err) {
      console.error('Upstream error:', err.message);
      return jsonRes({
        error: { type: 'upstream_error', message: 'AI service temporarily unavailable. Please try again.' }
      }, 502, cors);
    }
  }
};
