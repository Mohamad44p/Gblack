"use client";

import React, { useState, useEffect, createElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/contexts/WishlistContext";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import Curve from "./mobielnav/Curve";
import SearchModal from "./SearchModal";
import CartSheet from "../Cart/CartSheet";

interface SocialLink {
  id: number;
  name: string;
  url: string;
  platform: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface MenuItem {
  name: string;
  href?: string;
  onClick?: () => void;
  icon: React.ElementType;
  subItems?: MenuItem[];
}

const menuSlide = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

const slideIn = {
  initial: { x: 80, opacity: 0 },
  enter: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
  exit: (i: number) => ({
    x: 80,
    opacity: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
};

export default function AnimatedMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [socialResponse, categoriesResponse] = await Promise.all([
          fetch("/api/get-social-links"),
          fetch("/api/categories"),
        ]);

        if (socialResponse.ok && categoriesResponse.ok) {
          const socialData = await socialResponse.json();
          const categoriesData = await categoriesResponse.json();
          setSocialLinks(socialData);
          setCategories(categoriesData.categories);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  const menuItems: MenuItem[] = [
    { name: "Home", href: "/", icon: LucideIcons.Home },
    {
      name: "Products",
      icon: LucideIcons.ShoppingBag,
      subItems: [
        { name: "All Products", href: "/all", icon: LucideIcons.Grid },
        ...categories.map((cat) => ({
          name: cat.name,
          href: `/category/${cat.slug}`,
          icon: LucideIcons.Tag,
        })),
      ],
    },
    ...(isLoggedIn
      ? [
        { name: "Profile", href: "/profile", icon: LucideIcons.User },
        { name: "Logout", onClick: handleLogout, icon: LucideIcons.LogOut },
      ]
      : [
        { name: "Register", href: "/sign-up", icon: LucideIcons.UserPlus },
        { name: "Login", href: "/login", icon: LucideIcons.LogIn },
      ]),
    { name: "Wishlist", href: "/wishlist", icon: LucideIcons.Heart },
  ];

  const toggleCategory = (name: string) => {
    setOpenCategory(openCategory === name ? null : name);
  };

  return (
    <>
      <div className={`fixed top-0 md:hidden left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link href="/" className="text-white text-xl font-bold">GBLACK</Link>
          <div className="flex items-center space-x-4">

            <SearchModal />
            <Link href="/wishlist" aria-label="Wishlist" className="text-white">
              <LucideIcons.Heart size={24} />
            </Link>
            <CartSheet />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <LucideIcons.X size={24} /> : <LucideIcons.Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuSlide}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed inset-y-0 right-0 w-full sm:w-[390px] bg-black text-white z-40 overflow-y-auto"
          >
            <div className="h-full flex flex-col justify-between p-6 sm:p-10 pt-20">
              <div
                onMouseLeave={() => {
                  setSelectedIndicator(pathname);
                }}
                className="nav space-y-6"
              >
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    custom={index}
                    variants={slideIn}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="relative"
                  >
                    {item.subItems ? (
                      <button
                        onClick={() => toggleCategory(item.name)}
                        className="flex items-center justify-between w-full text-2xl sm:text-3xl font-light hover:text-neutral-300 transition-colors focus:outline-none"
                      >
                        <span className="flex items-center">
                          <item.icon className="w-6 h-6 mr-4" />
                          {item.name}
                        </span>
                        <LucideIcons.ChevronDown
                          className={`w-5 h-5 transition-transform ${openCategory === item.name ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                    ) : item.onClick ? (
                      <button
                        onClick={item.onClick}
                        className="flex items-center text-2xl sm:text-3xl font-light hover:text-neutral-300 transition-colors focus:outline-none"
                      >
                        <item.icon className="w-6 h-6 mr-4" />
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        href={item.href || "/"}
                        className="flex items-center text-2xl sm:text-3xl font-light hover:text-neutral-300 transition-colors"
                      >
                        <item.icon className="w-6 h-6 mr-4" />
                        {item.name}
                      </Link>
                    )}
                    {item.subItems && openCategory === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 ml-10 space-y-2"
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href || "/"}
                            className="flex items-center text-lg sm:text-xl font-light hover:text-neutral-300 transition-colors"
                          >
                            <subItem.icon className="w-5 h-5 mr-3" />
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto pt-6 border-t border-neutral-800">
                <div className="flex justify-between text-sm">
                  {socialLinks.map((link) => {
                    const IconComponent =
                      LucideIcons[link.platform as keyof typeof LucideIcons] ||
                      LucideIcons.Link;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-neutral-300 transition-colors"
                        aria-label={link.name}
                      >
                        {createElement(
                          IconComponent as React.ComponentType<LucideIcons.LucideProps>,
                          { size: 20, className: "hover:text-primary" }
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            <Curve />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}