import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PROTECTED_ROUTES: { pattern: RegExp; roles: string[] }[] = [
  { pattern: /^\/admin(\/.*)?$/, roles: ['admin'] },
  { pattern: /^\/agent(\/.*)?$/, roles: ['agent', 'admin'] },
];

// Single source of truth for role-based home
const ROLE_HOME: Record<string, string> = {
  admin: '/admin',
  agent: '/agent/dashboard',
  buyer: '/',
};

const GUEST_ONLY = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // ── Guest-only: redirect to role home if already logged in ────────────────
  if (GUEST_ONLY.some(p => pathname.startsWith(p))) {
    if (token) {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (res.ok) {
          const user = await res.json();
          return NextResponse.redirect(
            new URL(ROLE_HOME[user.role] ?? '/', request.url)
          );
        }
      } catch { /* fall through */ }
    }
    return NextResponse.next();
  }

  // ── Protected routes ───────────────────────────────────────────────────────
  const matched = PROTECTED_ROUTES.find(r => r.pattern.test(pathname));
  if (!matched) return NextResponse.next();

  // No token → login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token + role
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
      return response;
    }

    const user = await res.json();

    // Wrong role → redirect to their correct home
    if (!matched.roles.includes(user.role)) {
      return NextResponse.redirect(
        new URL(ROLE_HOME[user.role] ?? '/', request.url)
      );
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/agent/:path*',
    '/admin/:path*',
  ],
};