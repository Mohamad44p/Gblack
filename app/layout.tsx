import type { Metadata } from "next";
import "./globals.css";
import { Raleway } from "next/font/google";
import { Lenis } from "@/components/Lenis";
import TopBar from "@/components/Header/TopBar";
import Navbar from "@/components/Header/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { WishlistProvider } from "@/contexts/WishlistContext";
import dynamic from "next/dynamic";
import CircularMenu from "@/components/Header/CircularMenu";

const AnimatedFooter = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GBLACK - Your Fashion Destination",
  description:
    "Discover the latest fashion trends and shop your favorite styles at GBLACK.",
  icons: {
    icon: "/Tabp-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Lenis>
                <header>
                  <TopBar />
                  <Navbar />
                </header>
                {children}
                <CircularMenu />
                <Toaster />
                <AnimatedFooter />
              </Lenis>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}