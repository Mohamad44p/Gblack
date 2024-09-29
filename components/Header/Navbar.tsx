"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface Category {
  id: number;
  name: string;
  slug: string;
}

const staticNavItems = [
  { name: "Home", href: "/" },
  { name: "All Products", href: "/all" },
  { name: "About Us", href: "/About-us" },
  { name: "Contact Us", href: "/contact-us" },
];

export default function Navbar({ categories }: { categories: Category[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menCategory = categories.find(
    (cat) => cat.name.toLowerCase() === "men"
  );
  const womenCategory = categories.find(
    (cat) => cat.name.toLowerCase() === "women"
  );

  const visibleNavItems = [
    ...staticNavItems.slice(0, 3),
    ...(menCategory
      ? [{ name: "Men", href: `/category/${menCategory.slug}` }]
      : []),
    ...(womenCategory
      ? [{ name: "Women", href: `/category/${womenCategory.slug}` }]
      : []),
    ...staticNavItems.slice(3), // Add "About Us" and "Contact Us" to visible items
  ];

  const dropdownNavItems = categories
    .filter(
      (cat) =>
        cat.name.toLowerCase() !== "men" && cat.name.toLowerCase() !== "women"
    )
    .map((cat) => ({ name: cat.name, href: `/category/${cat.slug}` }));

  return (
    <nav className="bg-black text-white py-4 px-6 border-t border-gray-800">
      <div className="container mx-auto">
        <div className="hidden md:flex justify-center space-x-8 items-center">
          {visibleNavItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="text-sm tracking-widest hover:text-gray-300 transition-colors duration-200"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          {dropdownNavItems.length > 0 && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm tracking-widest hover:text-gray-300 transition-colors duration-200">
                    More
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {dropdownNavItems.map((item) => (
                        <li key={item.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {item.name}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 right-0 bg-black z-50"
              >
                {[...visibleNavItems, ...dropdownNavItems].map((item) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className="block py-2 px-4 text-sm tracking-widest hover:bg-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
