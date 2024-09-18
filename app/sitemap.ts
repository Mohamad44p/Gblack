import { MetadataRoute } from 'next'

async function getProductIds(): Promise<number[]> {
    // Fetch product IDs from your API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?per_page=100`)
    const data = await res.json()
    return data.products.map((product: any) => product.id)
}

async function getCategoryIds(): Promise<string[]> {
    // Fetch category slugs from your API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
    const data = await res.json()
    return data.categories.map((category: any) => category.slug)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'http://gblack.ps'
    const lastModified = new Date()

    const productIds = await getProductIds()
    const categoryIds = await getCategoryIds()

    const routes = [
        '',
        '/all',
        '/login',
        '/sign-up',
        '/wishlist',
        '/profile',
        '/order-confirmation',
        '/checkout',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }))

    const productRoutes = productIds.map((id) => ({
        url: `${baseUrl}/product/${id}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    const categoryRoutes = categoryIds.map((slug) => ({
        url: `${baseUrl}/category/${slug}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [...routes, ...productRoutes, ...categoryRoutes]
}