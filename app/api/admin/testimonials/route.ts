import { NextRequest, NextResponse } from 'next/server';

const BACKEND = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');

async function proxyToBackend(req: NextRequest, path: string) {
  const token = req.headers.get('authorization') ?? req.cookies.get('auth_token')?.value
    ? `Bearer ${req.cookies.get('auth_token')?.value}`
    : null;

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = token;

  // Only include body for methods that support it
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const fetchOptions: RequestInit = {
    method: req.method,
    headers: {
      ...headers,
      'Content-Type': req.headers.get('content-type') ?? '',
    },
  };

  if (body) {
    fetchOptions.body = body;
  }

  const upstream = await fetch(`${BACKEND}/api${path}`, fetchOptions);

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/admin/testimonials');
}

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/admin/testimonials');
}
