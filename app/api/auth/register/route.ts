import { NextResponse } from 'next/server';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    const response = await api.post("customers", {
      email,
      username,
      password,
    });

    if (response.status === 201) {
      return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } else {
      throw new Error('Registration failed');
    }
  } catch (error: any) {
    console.error('Registration error:', error.response?.data || error.message);
    return NextResponse.json({ 
      error: 'Registration failed', 
      details: error.response?.data || error.message 
    }, { status: 400 });
  }
}