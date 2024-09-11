import type { Metadata } from "next";
import "./globals.css";
import { Raleway } from "next/font/google";
import { Lenis } from "@/components/Lenis";
import TopBar from "@/components/Header/TopBar";
import Navbar from "@/components/Header/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import TransitionWrapper from "@/components/TransitionWrapper";

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-raleway',
})

export const metadata: Metadata = {
  title: "GBLACK",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.variable}`}>
        <AuthProvider>
          <Lenis>
            <TopBar />
            <Navbar />
            <TransitionWrapper>
              {children}
            </TransitionWrapper>
          </Lenis>
        </AuthProvider>
      </body>
    </html>
  );
}