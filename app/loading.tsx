'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const Particle = ({ index }: { index: number }) => (
    <motion.div
        className="absolute h-1 w-1 rounded-full bg-white opacity-50"
        initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
        }}
        animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            transition: {
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                repeatType: 'reverse',
            },
        }}
    />
)

export default function Loading() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer)
                    return 100
                }
                const diff = Math.random() * 10
                return Math.min(oldProgress + diff, 100)
            })
        }, 200)

        return () => {
            clearInterval(timer)
        }
    }, [])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
            {[...Array(20)].map((_, i) => (
                <Particle key={i} index={i} />
            ))}
            <div className="w-80 space-y-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                >
                    <svg className="mx-auto h-20 w-20 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [1, 0.8, 1],
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        times: [0, 0.5, 1],
                        repeat: Infinity,
                    }}
                    className="text-4xl font-bold text-white"
                >
                    GBLACK
                </motion.div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-800">
                    <motion.div
                        className="absolute left-0 top-0 h-full rounded-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                    <motion.div
                        className="absolute left-0 top-0 h-full w-full rounded-full bg-white opacity-30"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            times: [0, 0.5, 1],
                            repeat: Infinity,
                        }}
                    />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-sm font-light tracking-wider text-gray-300"
                >
                    CRAFTING YOUR EXCLUSIVE EXPERIENCE...
                </motion.div>
            </div>
        </div>
    )
}