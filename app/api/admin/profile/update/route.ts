import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const userId = formData.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    formData.delete('user_id');

    // Send as PATCH via method override to Laravel Admin user update.
    const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'X-HTTP-Method-Override': 'PATCH',
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message ?? data.error ?? 'Failed to update profile' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
