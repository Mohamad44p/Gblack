import { notFound } from 'next/navigation'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"
import SingleProductPage from '@/components/singel/ProductPage'

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
})

async function getProduct(id: string) {
  try {
    const { data } = await api.get(`products/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return <SingleProductPage product={product} />
}