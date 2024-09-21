'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="flex justify-center mb-8"
          >
            <Image
              src="/LogoG.png"
              alt="404 Illustration"
              width={1800}
              height={1994}
              className="w-full bg-black h-20"
            />
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Oops! Something went wrong.
            </h2>
            <p className="text-center text-gray-600 mb-8">
              We apologize for the inconvenience. Please try again later or contact support if the problem persists.
            </p>
          </motion.div>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-pink-500 text-white rounded-full font-semibold flex items-center space-x-2 hover:bg-pink-600 transition duration-300"
              onClick={reset}
            >
              <AlertCircle size={20} />
              <span>Try Again</span>
            </motion.button>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-orange-400 text-white rounded-full font-semibold flex items-center space-x-2 hover:bg-orange-500 transition duration-300"
              >
                <ArrowLeft size={20} />
                <span>Go Back</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}