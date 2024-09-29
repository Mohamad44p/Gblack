import type { Metadata } from "next";
import "./globals.css";
import { Raleway } from "next/font/google";
import { Lenis } from "@/components/Lenis";
import TopBar from "@/components/Header/TopBar";
import Navbar from "@/components/Header/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { WishlistProvider } from "@/contexts/WishlistContext";
import dynamic from "next/dynamic";
import CircularMenu from "@/components/Header/CircularMenu";
import { CartSheetProvider } from "@/components/Cart/cart-sheet-context";
import { CartProvider } from "@/contexts/CartContext";
import CartSheet from "@/components/Cart/CartSheet";

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

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

async function getSocialLinks() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/get-social-links`,
    {
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch social links");
  return res.json();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categoriesData, socialLinksData] = await Promise.all([
    getCategories(),
    getSocialLinks(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${raleway.variable} font-sans`}>
        <AuthProvider>
          <Lenis>
            <CartSheetProvider>
              <CartProvider>
                <WishlistProvider>
                  <header>
                    <TopBar socialLinks={socialLinksData} />
                    <Navbar categories={categoriesData.categories} />
                  </header>
                  <CircularMenu
                    socialLinks={socialLinksData}
                    categories={categoriesData.categories}
                  />
                  <div className="hidden">
                    <CartSheet />
                  </div>
                  <section className="pt-16 md:pt-0">{children}</section>
                  <Toaster />
                  <AnimatedFooter categories={categoriesData.categories} />
                </WishlistProvider>
              </CartProvider>
            </CartSheetProvider>
          </Lenis>
        </AuthProvider>
      </body>
    </html>
  );
}
