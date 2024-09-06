"use client"

import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import CategoryGallery from '../HomeCategory/Double'

export default function SecSection() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.01, ease: "easeOut" },
    },
  }

  const createTypingAnimation = (text: string, className: string) => (
    <motion.span className={className}>
      {text.split("").map((char, index) => (
        <motion.span key={`${char}-${index}`} variants={letterVariants}>
          {char}
        </motion.span>
      ))}
    </motion.span>
  )

  return (
    <main className="min-h-screen px-4 py-32 text-white md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.h1
          ref={ref}
          className="mb-16 text-center text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-5xl"
          variants={titleVariants}
          initial="hidden"
          animate={controls}
        >
          {createTypingAnimation("For men and women who want to feel seen and valued.", "block")}
        </motion.h1>

        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#facc15] to-[#ecc010] opacity-75 blur"></div>
          <div className="relative overflow-hidden rounded-lg">
            <CategoryGallery />
          </div>
        </motion.div>
      </div>
    </main>
  )
}