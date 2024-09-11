'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [pageContent, setPageContent] = useState<ReactNode>(children)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setLoadingProgress(0)
    
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 70) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    const timer = setTimeout(() => {
      setLoadingProgress(100)
      setIsLoading(false)
      setPageContent(children)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [pathname, children])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="relative w-40 h-40"
            animate={{
              rotate: 360,
              transition: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          >
            <motion.div
              className="absolute inset-0 border-t-4 border-white rounded-full"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
            <motion.div
              className="absolute inset-0 border-t-4 border-white rounded-full"
              style={{ clipPath: "inset(0 0 0 50%)" }}
              animate={{
                rotate: 360,
                transition: { duration: 1, repeat: Infinity, ease: "linear" }
              }}
            />
          </motion.div>
          <motion.div
            className="absolute text-4xl font-bold text-white"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            GBLACK
          </motion.div>
          <motion.div
            className="absolute bottom-10 left-0 right-0 h-1 bg-white"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: loadingProgress / 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </motion.div>
      ) : (
        <motion.div
          key={pathname}
          className="page-transition"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            initial: {
              opacity: 0,
              scale: 0.98,
            },
            animate: {
              opacity: 1,
              scale: 1,
            },
            exit: {
              opacity: 0,
              scale: 1.02,
            },
          }}
          transition={{
            duration: 0.5,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          <motion.div
            className="fixed inset-0 z-40 bg-black"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={{ originY: 0 }}
          />
          <motion.div
            className="fixed inset-0 z-30 bg-black"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.1 }}
            style={{ originY: 1 }}
          />
          {pageContent}
        </motion.div>
      )}
    </AnimatePresence>
  )
}