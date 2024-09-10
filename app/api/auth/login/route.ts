import { NextRequest, NextResponse } from 'next/server';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { sign } from 'jsonwebtoken';

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    console.log('Attempting to authenticate user:', email);

    // Authenticate user using WordPress REST API
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      console.error('Authentication failed:', authData);
      return NextResponse.json({ error: 'Invalid credentials', details: authData }, { status: 401 });
    }

    console.log('User authenticated successfully');

    // Fetch user details using the token
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Failed to fetch user data:', userData);
      return NextResponse.json({ error: 'Failed to fetch user data', details: userData }, { status: 500 });
    }

    console.log('User data fetched successfully');

    // Create a JWT token
    const token = sign(
      { 
        userId: userData.id, 
        email: userData.email 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    };

    const response = NextResponse.json({
      user: { 
        id: userData.id,
        email: userData.email, 
        name: userData.name, 
        firstName: userData.first_name,
        lastName: userData.last_name,
      }
    }, { status: 200 });

    response.cookies.set('auth_token', token, cookieOptions);

    console.log('Login successful for user:', email);

    return response;

  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'An error occurred during login', details: error.message }, { status: 500 });
  }
}