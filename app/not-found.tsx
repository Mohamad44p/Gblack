/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react"
import Image from "next/image"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="text-8xl md:text-9xl font-bold mb-4 relative"
        >
          <span className="relative">
            404
            <motion.span
              className="absolute top-0 left-0 w-full h-full"
              animate={{
                backgroundImage: [
                  "linear-gradient(0deg, #fff, #fff)",
                  "linear-gradient(90deg, #fff, #000)",
                  "linear-gradient(180deg, #fff, #fff)",
                  "linear-gradient(270deg, #fff, #000)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              404
            </motion.span>
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl md:text-3xl mb-8"
        >
          Oops! The page you're looking for has vanished into the void.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
        className="relative w-72 h-72 mb-8"
      >
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            animate={{
              rotate: 360,
              transition: { duration: 20 - index * 5, ease: "linear", repeat: Infinity },
            }}
            className={`absolute inset-${index * 4} rounded-full border-t-4 border-r-4 border-white`}
            style={{ opacity: 0.2 + index * 0.2 }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Image
            src="/LogoG.png"
            alt="GBLACK Logo"
            width={180}
            height={195}
            className="rounded-full"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
      >
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-white rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-colors duration-300 relative overflow-hidden"
        >
          <AnimatePresence>
            {isHovering && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute inset-0 bg-white"
              />
            )}
          </AnimatePresence>
          <ArrowLeft className="w-5 h-5 mr-2 relative z-10" aria-hidden="true" />
          <span className="relative z-10">Back to Home</span>
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

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        {[...Array(50)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
            }}
            animate={{
              y: [null, Math.random() * -100],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 2,
            }}
          >
            <Sparkles className="text-white opacity-20" size={8} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}