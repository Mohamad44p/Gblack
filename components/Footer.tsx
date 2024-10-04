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
  Phone,
  Mail,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

interface AnimatedFooterProps {
  categories?: Category[];
  socialLinks?: SocialLink[];
}

const staticNavItems = [
  { name: "Home", href: "/" },
  { name: "All Products", href: "/all" },
  { name: "About Us", href: "/About-us" },
  { name: "Contact Us", href: "/contact-us" },
];

const customerServiceLinks = [
  { name: "Help & FAQs", href: "/help-faqs" },
  { name: "Terms of Conditions", href: "/terms-conditions" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Online Returns Policy", href: "/returns-policy" },
  { name: "Rewards Program", href: "/rewards" },
  { name: "Rebate Center", href: "/rebates" },
  { name: "Partners", href: "/partners" },
];

export default function AnimatedFooter({
  categories = [],
  socialLinks = [],
}: AnimatedFooterProps) {
  const controls = useAnimation();
  const [isInView, setIsInView] = useState(false);
  const [openSection, setOpenSection] = useState("Quick Links");

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("animated-footer");
      if (footer) {
        const footerPosition = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (footerPosition < windowHeight) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const prioritizedCategories = categories.sort((a, b) => {
    if (a.name.toLowerCase() === "men") return -1;
    if (b.name.toLowerCase() === "men") return 1;
    if (a.name.toLowerCase() === "women") return -1;
    if (b.name.toLowerCase() === "women") return 1;
    return 0;
  });

  const displayedCategories = prioritizedCategories.slice(0, 5);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const AccordionSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-700">
      <button
        className="w-full py-4 px-2 flex justify-between items-center text-left"
        onClick={() => toggleSection(title)}
      >
        <h3 className="text-xl font-semibold">{title}</h3>
        {openSection === title ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
      {openSection === title && <div className="py-4 px-2">{children}</div>}
    </div>
  );

  return (
    <footer
      id="animated-footer"
      className="bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4 md:px-6"
    >
      <div>
        <div className="mb-12">
          <div className="space-y-6 mb-8">
            <motion.div
              className="text-4xl md:text-5xl font-bold overflow-hidden"
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
            <p className="text-gray-400">
              Elevate your style with our premium collection of fashion and accessories.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = {
                  facebook: Facebook,
                  twitter: Twitter,
                  instagram: Instagram,
                  linkedin: Linkedin,
                  youtube: Youtube,
                  github: Github,
                }[link.platform.toLowerCase()] || Facebook;
                return (
                  <Link key={link.id} href={link.url} className="text-gray-400 hover:text-white transition-colors">
                    <Icon size={24} />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="md:hidden">
            <AccordionSection title="Quick Links">
              <ul className="space-y-3">
                {staticNavItems.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <ArrowRight size={16} className="mr-2" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionSection>

            <AccordionSection title="Categories">
              <ul className="space-y-3">
                {displayedCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                      <ArrowRight size={16} className="mr-2" />
                      {category.name}
                    </Link>
                  </li>
                ))}
                {displayedCategories.length === 0 && (
                  <li className="text-gray-400">No categories available</li>
                )}
              </ul>
            </AccordionSection>

            <AccordionSection title="Customer Service">
              <ul className="space-y-3">
                {customerServiceLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                      <ArrowRight size={16} className="mr-2" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionSection>

            <AccordionSection title="Contact Us">
              <div className="space-y-6">
                <Link
                  href="/contact-us"
                  className="inline-block bg-white text-black font-semibold py-2 px-6 rounded-md hover:bg-gray-200 transition-colors duration-300"
                >
                  Get in Touch
                </Link>
                <div className="space-y-3">
                  <p className="flex items-center text-gray-400">
                    <Phone size={20} className="mr-3" />
                    +972599605694
                  </p>
                  <p className="flex items-center text-gray-400">
                    <Mail size={20} className="mr-3" />
                    support@gblack.com
                  </p>
                </div>
              </div>
            </AccordionSection>
          </div>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">Quick Links</h3>
              <ul className="space-y-3">
                {staticNavItems.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <ArrowRight size={16} className="mr-2" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">Categories</h3>
              <ul className="space-y-3">
                {displayedCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                      <ArrowRight size={16} className="mr-2" />
                      {category.name}
                    </Link>
                  </li>
                ))}
                {displayedCategories.length === 0 && (
                  <li className="text-gray-400">No categories available</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">Customer Service</h3>
              <ul className="space-y-3">
                {customerServiceLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                      <ArrowRight size={16} className="mr-2" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">Contact Us</h3>
              <Link
                href="/contact-us"
                className="inline-block bg-white text-black font-semibold py-2 px-6 rounded-md hover:bg-gray-200 transition-colors duration-300"
              >
                Get in Touch
              </Link>
              <div className="space-y-3">
                <p className="flex items-center text-gray-400">
                  <Phone size={20} className="mr-3" />
                  +972599605694
                </p>
                <p className="flex items-center text-gray-400">
                  <Mail size={20} className="mr-3" />
                  support@gblack.com
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} GBLACK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}