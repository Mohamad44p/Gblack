/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="text-6xl md:text-8xl font-bold mb-4"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl md:text-2xl mb-8"
        >
          Oops! The page you're looking for has vanished into the void.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
        className="relative w-64 h-64 mb-8"
      >
        <motion.div
          animate={{
            rotate: 360,
            transition: { duration: 20, ease: "linear", repeat: Infinity },
          }}
          className="absolute inset-0 rounded-full border-t-4 border-white opacity-20"
        />
        <motion.div
          animate={{
            rotate: -360,
            transition: { duration: 15, ease: "linear", repeat: Infinity },
          }}
          className="absolute inset-4 rounded-full border-t-4 border-white opacity-40"
        />
        <motion.div
          animate={{
            rotate: 360,
            transition: { duration: 10, ease: "linear", repeat: Infinity },
          }}
          className="absolute inset-8 rounded-full border-t-4 border-white opacity-60"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Image
            src="/LogoG.png"
            alt="GBLACK Logo"
            width={1800}
            height={1950}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-white rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
          Back to Home
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 text-sm text-gray-400"
      >
        GBLACK - Where style meets the void.
      </motion.p>
    </div>
  );
}
