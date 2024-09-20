"use client";

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Category {
  src: string
  name: string
  description: string
  link: string
}

interface DoubleCategoryProps {
  categories: [Category, Category]
}

const categories: [Category, Category] = [
  {
    src: "/images/Man.jpg",
    name: "Men",
    description: "Explore our collection for men",
    link: "/category/men"
  },
  {
    src: "/images/Women.jpg",
    name: "Women",
    description: "Discover our women's collection",
    link: "/category/women"
  }
]

function Double({ categories }: DoubleCategoryProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  return (
    <div className="flex h-[calc(100vh)] w-full">
      {categories.map((category, index) => (
        <motion.div
          key={category.name}
          className="relative overflow-hidden"
          initial={{ width: "50%" }}
          animate={{ width: hoverIndex === index ? "60%" : hoverIndex === null ? "50%" : "40%" }}
          onHoverStart={() => setHoverIndex(index)}
          onHoverEnd={() => setHoverIndex(null)}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Link href={category.link} className="block h-full">
            <Image
              src={category.src}
              alt={category.name}
              fill
              blurDataURL="/BlurImage.jpg"
              placeholder="blur"
              className="transition-transform object-cover duration-500 ease-in-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <h2 className="mb-4 text-5xl font-bold">{category.name}</h2>
              <p className="mb-6 text-xl text-gray-300">{category.description}</p>
              <motion.div
                className="flex items-center text-lg font-semibold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </motion.div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default function CategoryGallery() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <Double categories={categories} />
    </main>
  )
}