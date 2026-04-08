import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';

/**
 * GET /api/testimonials
 * Fetch all approved testimonials from Laravel backend
 */
export async function GET() {
  try {
    const response = await fetch(`${LARAVEL_API_URL}/testimonials`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Laravel API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch testimonials',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/testimonials
 * Submit a new testimonial to Laravel backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${LARAVEL_API_URL}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to submit testimonial:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit testimonial',
      },
      { status: 500 }
    );
  }
}
