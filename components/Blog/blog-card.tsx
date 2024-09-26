import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MessageCircleIcon, ShareIcon } from "lucide-react"
import Link from 'next/link'

interface BlogPostProps {
    post: {
        id: number
        date: string
        title: { rendered: string }
        content: { rendered: string }
        excerpt: { rendered: string }
        _embedded?: {
            author?: Array<{ name: string; avatar_urls?: { [key: string]: string } }>
        }
    }
}

export default function BlogPostCard({ post }: BlogPostProps) {
    const imageUrl = extractImageUrl(post.content.rendered)
    const authorName = post._embedded?.author?.[0]?.name || 'Anonymous'
    const authorAvatar = post._embedded?.author?.[0]?.avatar_urls?.['96'] || '/placeholder.svg'

    function extractImageUrl(content: string): string {
        const match = content.match(/<img.+src=(?:"|')(.+?)(?:"|')/)
        return match ? match[1] : '/placeholder.svg'
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    function stripHtml(html: string): string {
        return html.replace(/<[^>]*>/g, '')
    }

    return (
        <Card className="overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <div className="relative h-48 md:h-64 overflow-hidden">
                <Link
                    href={`/blog/${post.id}`}
                    passHref
                >
                    <Image
                        src={imageUrl}
                        alt={post.title.rendered}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 transform hover:scale-110"
                    />
                </Link>
            </div>
            <CardHeader>
                <Link href={`/blog/${post.id}`} passHref>
                    <CardTitle className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors duration-300" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                </Link>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {stripHtml(post.excerpt.rendered)}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Avatar className="transition-transform duration-300 transform hover:scale-110">
                        <AvatarImage src={authorAvatar} alt={authorName} />
                        <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{authorName}</span>
                </div>
                <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 transition-colors duration-300">
                        <MessageCircleIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 transition-colors duration-300">
                        <ShareIcon className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}