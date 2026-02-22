import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  if (request.nextUrl.pathname.startsWith('/api/stripe/webhook')) {
    return response;
  }

  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://*.posthog.com; connect-src 'self' https://*.posthog.com https://*.supabase.co https://test-api.service.hmrc.gov.uk https://api.service.hmrc.gov.uk; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';",
  );

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
