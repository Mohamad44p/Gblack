/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const user = await login(usernameOrEmail, password);
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-image Font-GTWalsheim">
      <div className="flex-1 md:flex-[2] p-6 md:p-12 flex flex-col justify-center">
        <h1 className="text-[#f9dcc5] text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4">
          <span className="font-saolice text-2xl md:text-3xl lg:text-4xl mx-2 md:mx-4">
            Login
          </span>
          <br />
          WELCOME
          <br className="hidden md:block" />
          BACK
        </h1>
        <p className="text-[#f3e9d9] text-base md:text-lg max-w-md">
          Sign back in to your account to access your courses and embody the art
          of being human.
        </p>
      </div>
      <div className="flex-1 bg-[#f3e9d9] mx-3 my-3 md:mx-5 p-6 md:p-12 flex flex-col justify-center">
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-[#404628] text-2xl md:text-3xl font-bold leading-tight mb-4">
            Your Account
          </h2>
          <div>
            <label
              htmlFor="usernameOrEmail"
              className="block text-[#404628] text-lg md:text-xl font-extrabold mb-2"
            >
              USERNAME OR EMAIL
            </label>
            <Input
              id="usernameOrEmail"
              type="text"
              className="w-full bg-transparent border-[#404628] border-opacity-50 text-[#3c4a2f]"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[#404628] text-lg md:text-xl font-extrabold mb-2"
            >
              PASSWORD
            </label>
            <Input
              id="password"
              type="password"
              className="w-full bg-transparent border-[#404628] border-opacity-50 text-[#404628]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#c2b280] hover:bg-[#a89a6b] text-[#404628] text-xl md:text-2xl font-medium py-2 px-4"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "LOG IN"}
          </Button>
          {error && (
            <p className="text-red-500 text-sm md:text-base">{error}</p>
          )}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 mt-4">
            <Link
              href="/forgot-password"
              className="text-[#404628] text-sm md:text-base hover:underline"
            >
              Forgot password?
            </Link>
            <Link
              href="/sign-up"
              className="text-[#404628] underline md:no-underline text-sm md:text-base hover:underline"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
