import { NextResponse } from 'next/server';

interface SocialLink {
  id: number;
  title: { rendered: string };
  url: string;
  platform: string;
}

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/social_link?per_page=100`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch social links');
    }

    const data: SocialLink[] = await response.json();

    const socialLinks = data.map(link => ({
      id: link.id,
      name: link.title.rendered,
      url: link.url,
      platform: link.platform,
    }));

    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error('Error fetching social links:', error);
    return NextResponse.json({ message: 'Error fetching social links' }, { status: 500 });
  }
}