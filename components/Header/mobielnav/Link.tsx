import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const slide = {
  initial: { x: 80 },
  enter: (i: number) => ({
    x: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i }
  }),
  exit: (i: number) => ({
    x: 80,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i }
  })
}

const scale = {
  open: { scale: 1, transition: { duration: 0.3 } },
  closed: { scale: 0, transition: { duration: 0.4 } }
}

interface LinkProps {
  data: {
    name: string;
    href?: string;
    onClick?: () => void;
    index: number;
  };
  isActive: boolean;
  setSelectedIndicator: (href: string) => void;
}

export default function CustomLink({ data, isActive, setSelectedIndicator }: LinkProps) {
  const { name, href, onClick, index } = data

  return (
    <motion.div
      className="relative flex items-center mb-6"
      onMouseEnter={() => { setSelectedIndicator(href || '') }}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        variants={scale}
        animate={isActive ? "open" : "closed"}
        className="w-2 h-2 bg-white rounded-full absolute -left-4"
      ></motion.div>
      {onClick ? (
        <button onClick={onClick} className="text-4xl font-light hover:text-neutral-300 transition-colors">
          {name}
        </button>
      ) : (
        <Link href={href || '/'} className="text-4xl font-light hover:text-neutral-300 transition-colors">
          {name}
        </Link>
      )}
    </motion.div>
  )
}