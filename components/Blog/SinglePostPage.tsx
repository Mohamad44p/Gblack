"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { ChevronLeft, Calendar, User, Tag, Share2, ArrowUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface PostData {
    title: string
    date: string
    author: {
        name: string
        avatar: string
    }
    category: string
    content: string
    featuredImage: string
}

export default function SinglePostPage({ post }: { post: PostData }) {
    const controls = useAnimation()
    const [ref, inView] = useInView()

    useEffect(() => {
        if (inView) {
            controls.start('visible')
        }
    }, [controls, inView])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="sticky top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-md shadow-md">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center justify-between">
                        <Link href="/blog" passHref>
                            <Button variant="ghost" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back to Blog
                            </Button>
                        </Link>
                        <Button variant="outline" className="flex items-center hover:bg-white hover:text-black transition-colors duration-300">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <motion.article
                    className="rounded-lg shadow-2xl overflow-hidden bg-gray-900"
                    initial="hidden"
                    animate={controls}
                    variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: 50 }
                    }}
                    transition={{ duration: 0.5 }}
                    ref={ref}
                >
                    <div className="p-8">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
                        <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-300 mb-8">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2" />
                                <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
                            </div>
                            <div className="flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                <span>{post.author.name}</span>
                            </div>
                            <div className="flex items-center">
                                <Tag className="h-5 w-5 mr-2" />
                                <span>{post.category}</span>
                            </div>
                        </div>

                        <div
                            className="prose prose-lg prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <motion.div
                            className="mt-12 pt-8 border-t border-gray-700"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center">
                                <Avatar className="h-16 w-16 mr-4 border-2 border-white">
                                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{post.author.name}</h3>
                                    <p className="text-gray-400">Author</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.article>
            </main>

            <Button
                className="fixed bottom-8 right-8 p-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors duration-300"
                onClick={scrollToTop}
            >
                <ArrowUp className="h-6 w-6" />
            </Button>
        </div>
    )
}