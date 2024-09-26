import { HtmlStrip } from '@/components/Blog/HtmlStrip'
import { Search, Mail } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BlogPostCard from '@/components/Blog/blog-card'
import Link from 'next/link'

interface BlogPost {
    id: number
    date: string
    title: {
        rendered: string
    }
    excerpt: {
        rendered: string
    }
    content: {
        rendered: string
    }
    author: number
}

async function getPosts() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, { next: { revalidate: 60 } });
    if (!res.ok) {
        throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

function extractImageUrl(content: string): string {
    const match = content.match(/<img.+?src=["'](.+?)["']/)
    return match ? match[1] : '/placeholder.svg'
}

export default async function BlogPage() {
    let blogPosts: BlogPost[] = [];
    let error: string | null = null;

    try {
        blogPosts = await getPosts();
    } catch (err) {
        console.error("Error fetching posts:", err);
        error = err instanceof Error ? err.message : "An unknown error occurred";
    }

    const featuredPost = blogPosts[0];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase();
    }

    const getFeaturedImageUrl = (post: BlogPost) => {
        return extractImageUrl(post.content.rendered);
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="sticky top-0 z-10 bg-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Outdoor Adventure Blog</h1>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
                                />
                                <Search size={20} className="absolute right-3 top-2.5" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {error && (
                    <div className="bg-red-500 text-white p-4 rounded-lg mb-8 animate-pulse">
                        <p className="font-bold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                {featuredPost && (
                    <section className="mb-16 animate-fadeIn">
                        <h2 className="text-3xl font-bold mb-8">Featured Post</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl transition-transform duration-300 transform hover:scale-105">
                                <Image
                                    src={getFeaturedImageUrl(featuredPost)}
                                    alt={featuredPost.title.rendered}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-300 transform hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <span className="bg-white text-black text-sm font-bold px-3 py-1 rounded-full mb-2 inline-block">
                                        FEATURED
                                    </span>
                                    <h3 className="text-2xl font-bold mb-2">{featuredPost.title.rendered}</h3>
                                    <p className="text-gray-300 mb-4">
                                        <HtmlStrip html={featuredPost.excerpt.rendered} maxLength={150} />
                                    </p>
                                    <Link
                                        href={`/blog/${featuredPost.id}`}
                                    >
                                        <Button className="bg-white text-black font-bold py-2 px-4 rounded-full hover:bg-gray-200 transition duration-300 transform hover:scale-105">
                                            Read More
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="rounded-lg p-8 shadow-xl">
                                <h3 className="text-2xl font-bold mb-4">Latest Posts</h3>
                                <ul className="space-y-4">
                                    {blogPosts.slice(0, 3).map((post) => (
                                        <li key={post.id} className="border-b border-gray-800 pb-4 last:border-b-0 transition-all duration-300 hover:translate-x-2">
                                            <span className="text-white text-sm">
                                                Blog
                                            </span>
                                            <h4 className="font-bold mb-1 hover:text-gray-300 transition-colors duration-300">{post.title.rendered}</h4>
                                            <p className="text-gray-400 text-sm">{formatDate(post.date)}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                )}

                <section className="mb-16 animate-fadeIn">
                    <h2 className="text-3xl font-bold mb-8">All Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map(post => (
                            <BlogPostCard key={post.id} post={post} />
                        ))}
                    </div>
                </section>

                <section className="border border-gray-400 rounded-lg p-8 shadow-xl animate-fadeIn">
                    <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                    <p className="text-gray-300 mb-6">
                        Stay up-to-date with our latest outdoor adventures, gear reviews, and travel tips.
                    </p>
                    <form className="flex">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
                        />
                        <Button type="submit" className="bg-white text-black font-bold py-2 px-6 rounded-r-full transition duration-300 flex items-center hover:bg-gray-200">
                            Subscribe
                            <Mail className="ml-2" size={20} />
                        </Button>
                    </form>
                </section>
            </main>
        </div>
    )
}