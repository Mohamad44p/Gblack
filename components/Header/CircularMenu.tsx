"use client";

import React, { useState, useEffect, createElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import Curve from "./mobielnav/Curve";
import SearchModal from "./SearchModal";
import { useCart } from "@/contexts/CartContext";
import { useCartSheet } from "../Cart/cart-sheet-context";

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
  enter: { x: "0", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
  },
};

const slideIn = {
  initial: { x: 80, opacity: 0 },
  enter: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
  exit: (i: number) => ({
    x: 80,
    opacity: 0,
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
};

export default function AnimatedMenu({
  categories,
  socialLinks,
}: {
  categories: Category[];
  socialLinks: SocialLink[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const { wishlist } = useWishlist();
  const { openCart } = useCartSheet();
  const { getCartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.refresh();
    setIsOpen(false);
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

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <motion.div
        className={`fixed top-0 md:hidden left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link href="/" className="text-white text-xl font-bold">
            GBLACK
          </Link>
          <div className="flex items-center space-x-4">
            <SearchModal />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-1 rounded-full bg-primary text-primary-foreground focus:outline-none"
              onClick={openCart}
            >
              <LucideIcons.ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            </motion.button>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? (
                <LucideIcons.X size={24} />
              ) : (
                <LucideIcons.Menu size={24} />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
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
              <div className="nav space-y-6">
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
                      <motion.button
                        onClick={() => toggleCategory(item.name)}
                        className="flex items-center justify-between w-full text-2xl sm:text-3xl font-light hover:text-neutral-300 transition-colors focus:outline-none"
                        whileHover={{ x: 10 }}
                      >
                        <span className="flex items-center">
                          <item.icon className="w-6 h-6 mr-4" />
                          {item.name}
                        </span>
                        <motion.div
                          animate={{
                            rotate: openCategory === item.name ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <LucideIcons.ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </motion.button>
                    ) : item.onClick ? (
                      <motion.button
                        onClick={item.onClick}
                        className="flex items-center text-2xl sm:text-3xl font-light hover:text-neutral-300 transition-colors focus:outline-none"
                        whileHover={{ x: 10 }}
                      >
                        <item.icon className="w-6 h-6 mr-4" />
                        {item.name}
                      </motion.button>
                    ) : (
                      <Link
                        href={item.href || "/"}
                        className="flex items-center text-2xl sm:text-3xl font-light hover:text-neutral-300 transition-colors"
                        onClick={handleLinkClick}
                      >
                        <motion.div
                          className="flex items-center"
                          whileHover={{ x: 10 }}
                        >
                          <item.icon className="w-6 h-6 mr-4" />
                          {item.name}
                        </motion.div>
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
                            onClick={handleLinkClick}
                          >
                            <motion.div
                              className="flex items-center"
                              whileHover={{ x: 10 }}
                            >
                              <subItem.icon className="w-5 h-5 mr-3" />
                              {subItem.name}
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="mt-auto pt-6 border-t border-neutral-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex justify-between text-sm">
                  {socialLinks.map((link) => {
                    const IconComponent =
                      LucideIcons[link.platform as keyof typeof LucideIcons] ||
                      LucideIcons.Link;
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-neutral-300 transition-colors"
                        aria-label={link.name}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {createElement(
                          IconComponent as React.ComponentType<LucideIcons.LucideProps>,
                          { size: 20, className: "hover:text-primary" }
                        )}
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>
            <Curve />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
