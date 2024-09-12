import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth')?.value;

    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.post('/wp-json/jwt-auth/v1/token/validate', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.data.status === 200) {
      const userResponse = await api.get('/wp-json/wp/v2/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return NextResponse.json({
        success: true,
        user: {
          id: userResponse.data.id,
          email: userResponse.data.email,
          name: userResponse.data.name,
          firstName: userResponse.data.first_name,
          lastName: userResponse.data.last_name,
        },
      });
    } else {
      throw new Error('Invalid token');
    }
  } catch (error: any) {
    console.error('Token validation error:', error.response?.data || error.message);
    return NextResponse.json({
      success: false,
      error: 'Invalid or expired token',
    }, { status: 401 });
  }
}