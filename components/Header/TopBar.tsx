'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { User, Heart, Facebook, Instagram, Twitter, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SearchModal from "./SearchModal"
import { useAuthCheck } from "@/lib/hooks/useAuthCheck"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import CartSheet from "../Cart/CartSheet"
import { useWishlist } from "@/contexts/WishlistContext"

export default function TopBar() {
  const [lang, setLang] = useState<"en" | "ar">("en")
  const { isLoggedIn, user, logout } = useAuth()
  const router = useRouter()
  const { wishlist } = useWishlist()
  
  const handleLogout = async () => {
    await logout()
    router.refresh()
  }

  return (
    <motion.header
      className="bg-black text-white py-4 px-6"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
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
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="focus:outline-none"
                  >
                    <User size={20} />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center">
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    <span className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div>
                <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                  <Link href="/sign-up">Register</Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}
          </div>
          <SearchModal />
          <Link href="/wishlist">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="focus:outline-none relative"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </motion.button>
          </Link>
          <CartSheet />
        </div>
      </div>
    </motion.header>
  )
}