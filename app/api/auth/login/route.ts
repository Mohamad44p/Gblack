import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const response = await api.post('/wp-json/jwt-auth/v1/token', {
      username,
      password,
    });

    if (response.data.token) {
      const token = jwt.sign(
        { 
          user_email: response.data.user_email,
          user_nicename: response.data.user_nicename,
          user_display_name: response.data.user_display_name
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      cookies().set('auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return NextResponse.json({ 
        success: true, 
        user: {
          id: response.data.user_id,
          user_email: response.data.user_email,
          user_nicename: response.data.user_nicename,
          user_display_name: response.data.user_display_name
        },
        token: token
      });
    } else {
      throw new Error('Login failed: No token received');
    }
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.response?.data?.message || error.message || 'Invalid username or password'
    }, { status: 401 });
  }
}