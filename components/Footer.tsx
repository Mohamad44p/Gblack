"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import {
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Facebook,
  Twitter,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface AnimatedFooterProps {
  categories?: Category[];
}

const staticNavItems = [
  { name: "Home", href: "/" },
  { name: "All Products", href: "/all" },
  { name: "About Us", href: "/About-us" },
  { name: "Contact Us", href: "/contact-us" },
];

export default function AnimatedFooter({
  categories = [],
}: AnimatedFooterProps) {
  const controls = useAnimation();
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("animated-footer");
      if (footer) {
        const footerPosition = footer.getBoundingClientRect().top;
        const windowHeight =
          typeof window !== "undefined" ? window.innerHeight : 0;
        if (footerPosition < windowHeight) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
  };

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    },
  };

  const displayedCategories = categories.slice(0, 5);

  return (
    <footer
      id="animated-footer"
      className="bg-black text-white py-12 px-4 md:px-6"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {staticNavItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-gray-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {displayedCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="hover:text-gray-300"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {displayedCategories.length === 0 && (
                <li>No categories available</li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/About-us" className="hover:text-gray-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-gray-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3 lg:col-span-1">
            <Link
              href="/contact-us"
              className="inline-block bg-[#FF5C00] text-white py-2 px-6 rounded-md hover:bg-[#FF7D00] transition-colors duration-300"
            >
              CONTACT US
            </Link>
            <div className="mt-6 space-y-1">
              <p>Customer Service: +972599605694</p>
              <p>Email: support@gblack.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 flex flex-col items-center">
          <motion.div
            className="text-6xl md:text-8xl font-bold mb-8 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {"GBLACK".split("").map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                style={{ display: "inline-block" }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
          <div className="flex justify-between items-center w-full flex-wrap gap-4">
            <div className="flex space-x-4">
              <Link
                href="/privacy-policy"
                className="text-sm hover:text-gray-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-use"
                className="text-sm hover:text-gray-300"
              >
                Terms of Use
              </Link>
              <Link
                href="/shipping-returns"
                className="text-sm hover:text-gray-300"
              >
                Shipping & Returns
              </Link>
            </div>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} GBLACK. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-gray-300">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Github size={20} />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Youtube size={20} />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Twitter size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
