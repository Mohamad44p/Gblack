'use client'

import { useState, useEffect, createElement } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { User, Heart, LogOut } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SearchModal from "./SearchModal"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import CartSheet from "../Cart/CartSheet"
import { useWishlist } from "@/contexts/WishlistContext"

interface SocialLink {
  id: number;
  name: string;
  url: string;
  platform: string;
}

export default function TopBar() {
  const [lang, setLang] = useState<"en" | "ar">("en")
  const { isLoggedIn, user, logout } = useAuth()
  const router = useRouter()
  const { wishlist } = useWishlist()
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch('/api/get-social-links');
        if (response.ok) {
          const data = await response.json();
          setSocialLinks(data);
        } else {
          console.error('Failed to fetch social links');
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleLogout = async () => {
    await logout()
    router.refresh()
  }

  return (
    <motion.header
      className="bg-black hidden md:block text-white py-4 px-6"
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
            {socialLinks.map((link) => {
              const IconComponent = LucideIcons[link.platform as keyof typeof LucideIcons] || LucideIcons.Link;
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {createElement(IconComponent as React.ComponentType<LucideIcons.LucideProps>, { size: 20, className: "hover:text-primary" })}
                  <span className="sr-only">{link.name}</span>
                </motion.a>
              );
            })}
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