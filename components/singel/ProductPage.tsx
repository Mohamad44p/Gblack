'use client'

import { useState, useEffect } from 'react'
import ImageGallery from "@/components/singel/ImageGallery"
import { Button } from "@/components/ui/button"
import { Star, Truck, Share2, ShoppingCart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from '@/hooks/use-toast'
import { WishlistButton } from "@/components/WishlistButton"
import { useCart } from "@/contexts/CartContext"
import { openCart } from "@/lib/hooks/events"

interface ProductAttribute {
    id: number
    name: string
    options: string[]
}

interface ProductCategory {
    id: number
    name: string
    slug: string
}

interface ProductImage {
    id: number
    src: string
    alt: string
}

interface ShippingZone {
    id: number
    name: string
    price: number
}

interface ProductProps {
    id: number
    name: string
    slug: string
    permalink: string
    price: string
    regular_price: string
    sale_price: string
    on_sale: boolean
    description: string
    short_description: string
    average_rating: string
    rating_count: number
    images: ProductImage[]
    categories: ProductCategory[]
    attributes: ProductAttribute[]
    stock_quantity: number
    sku: string
    weight: string
    dimensions: {
        length: string
        width: string
        height: string
    }
}

export default function SingleProductPage({ product }: { product: ProductProps }) {
    const [selectedSize, setSelectedSize] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [shippingZones, setShippingZones] = useState<ShippingZone[]>([])
    const { addToCart } = useCart()

    useEffect(() => {
        fetch('/api/shipping-zones')
            .then(response => response.json())
            .then(data => setShippingZones(data))
            .catch(error => console.error('Error fetching shipping zones:', error))
    }, [])

    const sizes = product.attributes.find(attr => attr.name === 'Size')?.options || []
    const isOnSale = product.sale_price !== '' && product.sale_price !== product.regular_price

    const handleAddToCart = () => {
        if (sizes.length > 0 && !selectedSize) {
            toast({
                title: "Please select a size",
                description: "You must select a size before adding to cart.",
                variant: "destructive",
            })
            return
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: isOnSale ? product.sale_price : product.regular_price,
            image: product.images[0]?.src || '/BlurImage.jpg',
            quantity: quantity,
            size: selectedSize,
        })
        toast({
            title: "Added to cart",
            description: `${quantity} x ${product.name} (Size: ${selectedSize || 'N/A'}) added to your cart.`,
        })
        openCart()
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.short_description,
                url: product.permalink,
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error))
        } else {
            toast({
                title: "Share",
                description: "Copy this link: " + product.permalink,
            })
        }
    }

    return (
        <div className="min-h-screen py-12 bg-black text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                    <ImageGallery images={product.images} />
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <div className="mb-2 md:mb-3">
                            <span className="mb-0.5 inline-block text-gray-400">
                                {product.categories.map(cat => cat.name).join(' > ')}
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                {product.name}
                            </h1>
                        </div>

                        <div className="mb-6 flex items-center gap-3 md:mb-10">
                            <Button className="rounded-full gap-2" variant="outline">
                                <span className="text-sm font-medium">{product.average_rating}</span>
                                <Star className="h-4 w-4 fill-current" />
                            </Button>
                            <span className="text-sm transition duration-100">
                                {product.rating_count} Ratings
                            </span>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold md:text-3xl">
                                    ${isOnSale ? product.sale_price : product.regular_price}
                                </span>
                                {isOnSale && (
                                    <span className="mb-0.5 text-red-500 line-through">
                                        ${product.regular_price}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm text-gray-400">
                                Incl. VAT plus shipping
                            </span>
                        </div>

                        {sizes.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">Select Size</h2>
                                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex gap-2">
                                    {sizes.map((size) => (
                                        <div key={size}>
                                            <RadioGroupItem
                                                value={size.toLowerCase()}
                                                id={`size-${size.toLowerCase()}`}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={`size-${size.toLowerCase()}`}
                                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 text-sm font-semibold peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-gray-800 cursor-pointer"
                                            >
                                                {size}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        )}

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Quantity</h2>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </Button>
                                <Input
                                    type="number"
                                    min="1"
                                    max={product.stock_quantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.min(product.stock_quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                                    className="w-16 text-center"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                >
                                    +
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-2.5 mb-6">
                            <Button
                                className="flex-1 mr-2 bg-white text-black hover:bg-gray-200"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                            </Button>
                            <Button variant="secondary" className="flex-1">
                                Buy now
                            </Button>
                            <WishlistButton product={{
                                id: product.id,
                                name: product.name,
                                price: isOnSale ? product.sale_price : product.regular_price,
                                image: product.images[0]?.src || '/BlurImage.jpg'
                            }} />
                            <Button variant="outline" size="icon" onClick={handleShare}>
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>

                        <Tabs defaultValue="description" className="w-full">
                            <TabsList>
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                            </TabsList>
                            <TabsContent value="description" className="mt-4">
                                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            </TabsContent>
                            <TabsContent value="details" className="mt-4">
                                <ul className="list-disc pl-5">
                                    <li>SKU: {product.sku}</li>
                                    <li>Weight: {product.weight}</li>
                                    <li>Dimensions: {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height}</li>
                                    {product.attributes.map((attr) => (
                                        <li key={attr.id}>{attr.name}: {attr.options.join(', ')}</li>
                                    ))}
                                </ul>
                            </TabsContent>
                            <TabsContent value="shipping" className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">Shipping Zones and Rates:</h3>
                                {shippingZones.map((zone) => (
                                    <div key={zone.id} className="mb-2">
                                        <p><strong>{zone.name}:</strong> ${zone.price.toFixed(2)}</p>
                                    </div>
                                ))}
                                <p className="mt-4">
                                    Free standard shipping on orders over $100. Expedited and international
                                    shipping options available at checkout. Please allow 1-3 business days for processing.
                                </p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}