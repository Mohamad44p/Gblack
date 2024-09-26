import SinglePostPage from '@/components/Blog/SinglePostPage'
import { notFound } from 'next/navigation'

async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, { next: { revalidate: 60 } })
  
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error('Failed to fetch post')
  }

  return res.json()
}

export const revalidate = 360000;

export default async function Post({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  const postData = {
    title: post.title.rendered,
    date: post.date,
    author: {
      name: post._embedded?.author?.[0]?.name || 'Anonymous',
      avatar: post._embedded?.author?.[0]?.avatar_urls?.['96'] || '/placeholder.svg',
    },
    category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized',
    content: post.content.rendered,
    featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.svg',
  }

  return <SinglePostPage post={postData} />
}