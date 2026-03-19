import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(body),
    });

    const data = await res.json();

    console.log('[login] Laravel response:', JSON.stringify(data));
    console.log('[login] token:', data.token ? data.token.slice(0, 20) + '...' : 'MISSING');

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message ?? data.errors?.email?.[0] ?? 'Invalid credentials.' },
        { status: res.status }
      );
    }

    if (!data.token) {
      console.error('[login] No token in Laravel response!');
      return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
    }

    const response = NextResponse.json({ user: data.user });
    response.cookies.set('auth_token', data.token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:     '/',
      maxAge:   60 * 60 * 24 * 7,
    });

    console.log('[login] Cookie set for user:', data.user?.email, 'role:', data.user?.role);

    return response;
  } catch (e) {
    console.error('[login] Exception:', e);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}