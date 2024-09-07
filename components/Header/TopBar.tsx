'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, User, ShoppingBag, Heart, Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TopBar() {
  const [lang, setLang] = useState<"en" | "ar">("en")

  return (
    <motion.header
      className="bg-black text-white py-4 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                {lang === "en" ? "EN" : "AR"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLang("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("ar")}>العربية</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden md:flex space-x-4">
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Facebook size={18} />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram size={18} />
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Twitter size={18} />
            </motion.a>
          </div>
        </div>

        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src="/LogoG.png"
            alt="GBLACK Logo"
            width={400}
            height={400}
            className="w-auto h-8"
          />
        </Link>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
              <Link href="/sign-up">Register</Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
              <Link href="/login">Login</Link>
            </Button>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="focus:outline-none"
          >
            <Search size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="focus:outline-none"
          >
            <Link href="/profile">
              <User size={20} />
            </Link>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="focus:outline-none"
          >
            <Heart size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="focus:outline-none relative"
          >
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}