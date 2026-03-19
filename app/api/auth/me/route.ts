import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const laravelRes = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!laravelRes.ok) {
      // Token expired or invalid — clear cookie
      const response = NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
      response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
      return response;
    }

    const data = await laravelRes.json();
    return NextResponse.json({ user: data }, { status: 200 });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}