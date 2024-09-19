import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const response = await api.post("/wp-json/jwt-auth/v1/token", {
      username,
      password,
    });

    if (response.data.token) {
      const wpToken = response.data.token;

      cookies().set("auth", wpToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: response.data.user_id,
          email: response.data.user_email,
          name: response.data.user_nicename,
          firstName: response.data.user_firstname,
          lastName: response.data.user_lastname,
        },
        token: wpToken,
      });
    } else {
      throw new Error("Login failed: No token received");
    }
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Invalid username or password",
      },
      { status: 401 }
    );
  }
}
