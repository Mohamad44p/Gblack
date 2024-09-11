import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth')?.value;

    if (token) {
      try {
        await api.post('/wp-json/jwt-auth/v1/token/revoke', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error revoking token:', error);
      }

      cookies().set('auth', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        path: '/',
        maxAge: 0
      });
    }

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'An error occurred during logout'
    }, { status: 500 });
  }
}