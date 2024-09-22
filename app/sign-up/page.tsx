/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!terms) {
      setError("You must agree to the Terms & Conditions");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    try {
      await register(fullName, email, password);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-image Font-GTWalsheim">
      <div className="flex-1 md:flex-[2] p-6 md:p-12 flex flex-col justify-center">
        <h1 className="text-[#f9dcc5] text-4xl md:text-6xl lg:text-[8rem] font-bold leading-tight mb-4">
          CREATE
          <span className="font-saolice text-2xl md:text-3xl lg:text-4xl mx-2 md:mx-4">
            an
          </span>
          <br />
          ACCOUNT
        </h1>
        <p className="text-[#f3e9d9] text-base md:text-lg max-w-md">
          Create an account in order to purchase Domi's courses and access
          exclusive content.
        </p>
      </div>
      <div className="flex-1 bg-[#f3e9d9] mx-3 my-3 md:mx-5 p-6 md:p-12 flex flex-col justify-center">
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-[#404628] text-lg md:text-xl font-extrabold mb-2"
            >
              EMAIL
            </label>
            <Input
              id="email"
              type="email"
              className="w-full bg-transparent border-[#404628] border-opacity-50 text-[#404628]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="block text-[#404628] text-lg md:text-xl font-extrabold mb-2"
            >
              FULL NAME
            </label>
            <Input
              id="fullName"
              type="text"
              className="w-full bg-transparent border-[#404628] border-opacity-50 text-[#404628]"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing"
                className="border-[#404628] border-opacity-50"
                checked={marketing}
                onCheckedChange={(checked) => setMarketing(checked as boolean)}
              />
              <label
                htmlFor="marketing"
                className="text-xs md:text-sm text-[#404628]"
              >
                I consent to receive marketing emails
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                className="border-[#404628] border-opacity-50"
                checked={terms}
                onCheckedChange={(checked) => setTerms(checked as boolean)}
                required
              />
              <label
                htmlFor="terms"
                className="text-xs md:text-sm text-[#404628]"
              >
                I agree to the{" "}
                <Link
                  href="/privacy-policy"
                  className="text-[#ff0000] underline"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-[#ff0000] underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#c2b280] hover:bg-[#a89a6b] text-[#404628] font-medium py-2 px-4"
          >
            CREATE ACCOUNT
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="border-t border-black" />
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <Link
              href="/sign-in"
              className="text-[#404628] text-base md:text-xl"
            >
              Already have an account?
            </Link>
            <Link
              href="/login"
              className="text-[#404628] text-base md:text-xl underline underline-offset-8"
            >
              Login &#8599;
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
