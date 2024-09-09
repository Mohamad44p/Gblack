/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { ShoppingCart, Heart, Star, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const products = [
    { id: 1, name: 'Quantum Smartwatch', price: 299, category: 'New Arrivals', rating: 4.8, image: '/assets/img2.jpeg', description: 'Experience the future on your wrist with our advanced Quantum Smartwatch. Featuring cutting-edge health monitoring, seamless connectivity, and a sleek design.' },
    { id: 2, name: 'Nebula Wireless Earbuds', price: 159, category: 'Best Sellers', rating: 4.9, image: '/assets/img3.jpeg', description: 'Immerse yourself in crystal-clear sound with our Nebula Wireless Earbuds. Enjoy long-lasting battery life, touch controls, and a comfortable fit for all-day use.' },
    { id: 3, name: 'Zenith VR Headset', price: 499, category: 'Featured', rating: 4.7, image: '/assets/img4.jpeg', description: 'Step into new realities with our Zenith VR Headset. High-resolution displays, precise motion tracking, and ergonomic design deliver an unparalleled virtual experience.' },
    { id: 4, name: 'Eclipse Drone', price: 799, category: 'New Arrivals', rating: 4.6, image: '/assets/img7.jpeg', description: 'Capture breathtaking aerial footage with our Eclipse Drone. Featuring 4K camera, obstacle avoidance, and extended flight time for professional-grade results.' },
    { id: 5, name: 'Oasis Smart Home Hub', price: 249, category: 'Best Sellers', rating: 4.8, image: '/assets/img6.jpeg', description: 'Transform your living space with the Oasis Smart Home Hub. Control lights, temperature, security, and more with voice commands or our intuitive app.' },
    { id: 6, name: 'Mirage Holographic Display', price: 1299, category: 'Featured', rating: 4.9, image: '/assets/img1.jpeg', description: 'Bring your presentations to life with the Mirage Holographic Display. Create stunning 3D visuals that float in mid-air, perfect for businesses and tech enthusiasts alike.' },
]

const categories = ['All', 'New Arrivals', 'Best Sellers', 'Featured']

const QuickViewModal = ({ product, onClose }: {
    product: { id: number, name: string, price: number, category: string, rating: number, image: string, description: string },
    onClose: () => void
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="bg-black text-white p-8 rounded-2xl max-w-2xl w-full mx-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2">
                        <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg" />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold mb-4"
                            style={{
                                background: 'linear-gradient(to right, #fff, #888)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >{product.name}</h2>
                        <p className="text-gray-300 mb-4">{product.description}</p>
                        <div className="flex items-center mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
                            ))}
                            <span className="ml-2 text-gray-400">{product.rating}</span>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-3xl font-bold"
                                style={{
                                    background: 'linear-gradient(to right, #fff, #888)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >${product.price}</span>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                {product.category}
                            </Badge>
                        </div>
                        <div className="flex gap-4">
                            <Button className="flex-1 bg-black hover:bg-white hover:text-black   text-white">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                            </Button>
                            <Button variant="outline" className="px-3 border-white hover:bg-blue-50 hover:text-black">
                                <Heart className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function AllHome() {
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
    const [selectedProduct, setSelectedProduct] = useState<{ id: number, name: string, price: number, category: string, rating: number, image: string, description: string } | null>(null)

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(product => product.category === selectedCategory)

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            <div className="w-full bg-black bg-grid-gray-800 relative flex items-center justify-center">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-gray-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
                <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                <div className="absolute inset-0 bg-dot-white/[0.2] -z-10" />

                <div className="container mx-auto px-4 py-16 relative z-10">
                    <motion.h1
                        className="text-7xl font-extrabold mb-12 text-center"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            background: 'linear-gradient(to right, #fff, #888)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Future Tech Emporium
                    </motion.h1>

                    <motion.div
                        className="flex justify-center space-x-4 mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-white text-black'
                                    : 'bg-transparent text-white border-white hover:bg-white hover:text-black'
                                    }`}
                            >
                                {category}
                            </Button>
                        ))}
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                        layout
                    >
                        <AnimatePresence>
                            {filteredProducts.map(product => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative group"
                                    onHoverStart={() => setHoveredProduct(product.id)}
                                    onHoverEnd={() => setHoveredProduct(null)}
                                >
                                    <motion.div
                                        className="bg-white bg-opacity-5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm"
                                        whileHover={{ scale: 1.05, rotateY: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="relative overflow-hidden">
                                            <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />
                                            <motion.div
                                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                                            >
                                                <Button
                                                    className="bg-white text-black hover:bg-gray-200"
                                                    onClick={() => setSelectedProduct(product)}
                                                >
                                                    Quick View
                                                </Button>
                                            </motion.div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-3xl font-bold" style={{
                                                    background: 'linear-gradient(to right, #fff, #888)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>${product.price}</span>
                                                <Badge variant="secondary" className="bg-white text-black px-3 py-1 rounded-full">
                                                    {product.category}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'} fill-current`} />
                                                ))}
                                                <span className="ml-2 text-gray-400">{product.rating}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <Button className="flex-1 mr-2 bg-white text-black hover:bg-gray-200">
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    Add to Cart
                                                </Button>
                                                <Button variant="outline" className="px-3 border-white text-white hover:bg-white hover:text-black">
                                                    <Heart className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        className="mt-16 text-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Button className="px-8 py-3 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full">
                            <Link href="/all">
                            View All Products
                            </Link>
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {selectedProduct && (
                    <QuickViewModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}