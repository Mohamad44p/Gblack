import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/profile',
                    '/checkout',
                    '/order-confirmation',
                    '/api/',
                ],
            },
        ],
        sitemap: 'https://gblack.com/sitemap.xml',
        host: 'http://gblack.ps',
    }
}