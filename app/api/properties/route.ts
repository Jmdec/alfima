// app/api/properties/route.ts  (GET already exists — add POST here)

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ── GET (already exists, keeping for completeness) ────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const incoming = request.nextUrl.searchParams;
    const params   = new URLSearchParams();

    if (incoming.get('listingType'))   params.set('listing_type',  incoming.get('listingType')!);
    if (incoming.get('listing_type'))  params.set('listing_type',  incoming.get('listing_type')!);
    if (incoming.get('type'))          params.set('property_type', incoming.get('type')!);
    if (incoming.get('property_type')) params.set('property_type', incoming.get('property_type')!);
    if (incoming.get('minPrice'))      params.set('min_price',     incoming.get('minPrice')!);
    if (incoming.get('min_price'))     params.set('min_price',     incoming.get('min_price')!);
    if (incoming.get('maxPrice'))      params.set('max_price',     incoming.get('maxPrice')!);
    if (incoming.get('max_price'))     params.set('max_price',     incoming.get('max_price')!);
    if (incoming.get('bedrooms'))      params.set('bedrooms',      incoming.get('bedrooms')!);
    if (incoming.get('bathrooms'))     params.set('bathrooms',     incoming.get('bathrooms')!);
    if (incoming.get('city'))          params.set('city',          incoming.get('city')!);
    if (incoming.get('search'))        params.set('search',        incoming.get('search')!);
    if (incoming.get('page'))          params.set('page',          incoming.get('page')!);
    if (incoming.get('per_page'))      params.set('per_page',      incoming.get('per_page')!);

    const url = `${API_URL}/api/properties${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });

    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch properties' }, { status: res.status });

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// ── POST /api/properties ──────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const token   = request.cookies.get('auth_token')?.value;
    const formData = await request.formData();

    const res = await fetch(`${API_URL}/api/properties`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}