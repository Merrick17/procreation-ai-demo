import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

const RATE_LIMITS = {
  "/api/generate/image": { requests: 10, windowMs: 60 * 1000 },
  "/api/generate/enhance-prompt": { requests: 30, windowMs: 60 * 1000 },
  "/api/chat": { requests: 60, windowMs: 60 * 1000 },
  "/api/credits/purchase": { requests: 10, windowMs: 60 * 1000 },
  default: { requests: 100, windowMs: 60 * 1000 },
};

export async function rateLimitMiddleware(req: NextRequest): Promise<NextResponse | null> {
  const path = req.nextUrl.pathname;
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  const limitConfig = Object.entries(RATE_LIMITS).find(([pattern]) => 
    path.startsWith(pattern)
  )?.[1] || RATE_LIMITS.default;

  const key = `${ip}:${path}`;
  const now = Date.now();

  let entry = rateLimits.get(key);

  if (!entry || now > entry.resetTime) {
    entry = { count: 0, resetTime: now + limitConfig.windowMs };
    rateLimits.set(key, entry);
  }

  entry.count++;

  if (entry.count > limitConfig.requests) {
    const response = NextResponse.json(
      { error: "Rate limit exceeded", retryAfter: Math.ceil((entry.resetTime - now) / 1000) },
      { status: 429, headers: { "Retry-After": String(Math.ceil((entry.resetTime - now) / 1000)) } }
    );
    response.headers.set("X-RateLimit-Limit", String(limitConfig.requests));
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("X-RateLimit-Reset", String(entry.resetTime));
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(limitConfig.requests));
  response.headers.set("X-RateLimit-Remaining", String(limitConfig.requests - entry.count));
  response.headers.set("X-RateLimit-Reset", String(entry.resetTime));

  return null;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimits.entries()) {
    if (now > entry.resetTime) {
      rateLimits.delete(key);
    }
  }
}, 60 * 1000);