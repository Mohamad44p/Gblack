/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Heart, Award, Settings, Package, CreditCard, MapPin, Bell, ChevronRight, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OrderDetailsModal } from '@/components/Profile/OrderDetailsModal'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { WishlistProvider, useWishlist } from '@/contexts/WishlistContext'
import { useToast } from '@/hooks/use-toast'

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    date_created: string;
    status: string;
    total: string;
    line_items: OrderItem[];
}

interface WishlistItem {
    id: number;
    name: string;
    price: string;
    image: string;
    average_rating: string;
    rating_count: number;
    attributes: { name: string; options: string[] }[];
    short_description: string;
}

const menuItems = [
    { icon: ShoppingBag, label: 'Orders', count: 0 },
    { icon: Heart, label: 'Wishlist', count: 0 },
    { icon: Award, label: 'Rewards', count: 1250 },
    { icon: Settings, label: 'Settings' },
]

function EcommerceProfileRedesignContent() {
    const [activeItem, setActiveItem] = useState('Orders');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const { user, isLoggedIn, isLoading, checkAuthStatus } = useAuth();
    const router = useRouter();
    const { wishlist, removeFromWishlist } = useWishlist();
    const { toast } = useToast();

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await checkAuthStatus();
            if (!isAuthenticated) {
                router.push('/login');
            } else {
                fetchOrders();
            }
        };

        checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkAuthStatus, router]);

    useEffect(() => {
        menuItems[0].count = orders.length;
        menuItems[1].count = wishlist.length;
    }, [orders, wishlist]);

    const fetchOrders = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
          console.log('Fetching orders for user ID:', userId);
          try {
            const response = await fetch(`/api/ordersuser?userId=${userId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data);
          } catch (error) {
            console.error('Error fetching orders:', error);
            toast({
              title: "Error",
              description: "Failed to fetch orders. Please try again.",
              variant: "destructive",
            });
          }
        } else {
          console.error('User ID is undefined'); // Debugging log
          toast({
            title: "Error",
            description: "User ID is undefined. Please try again.",
            variant: "destructive",
          });
        }
      };


    const handleRemoveFromWishlist = (productId: number) => {
        removeFromWishlist(productId);
        toast({
            title: "Removed from wishlist",
            description: "The item has been removed from your wishlist.",
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (!isLoggedIn || !user) {
        return null;
    }

    return (
        <div className="min-h-screen text-white flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl flex flex-col md:flex-row gap-8"
            >
                <div className="md:w-1/3 space-y-6">
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 overflow-hidden">
                        <CardContent className="p-6">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex items-center space-x-4"
                            >
                                <Avatar className="w-20 h-20 border-2 border-white">
                                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User Avatar" />
                                    <AvatarFallback>{user.firstName ? user.firstName.charAt(0) : 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-bold">{user.name}</h2>
                                    <p className="text-gray-300">{user.email}</p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="mt-4 flex space-x-2"
                            >
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">VIP</Badge>
                                <Badge className="bg-gradient-to-r from-purple-400 to-pink-500">Level 5</Badge>
                            </motion.div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                        <CardContent className="p-4">
                            <nav className="space-y-2">
                                {menuItems.map((item, index) => (
                                    <motion.button
                                        key={item.label}
                                        onClick={() => setActiveItem(item.label)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${activeItem === item.label ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
                                            }`}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <span className="flex items-center">
                                            <item.icon className="w-5 h-5 mr-3" />
                                            {item.label}
                                        </span>
                                        {item.count !== undefined && (
                                            <Badge variant="outline" className={cn("ml-auto",
                                                activeItem === item.label ? 'bg-white text-black' : 'text-white'
                                            )}>
                                                {item.count}
                                            </Badge>
                                        )}
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </motion.button>
                                ))}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:w-2/3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeItem}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                                <CardContent className="p-6">
                                    <h3 className="text-2xl font-bold mb-4">{activeItem}</h3>
                                    {activeItem === 'Orders' && (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <motion.div
                                                    key={order.id}
                                                    className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="flex items-center">
                                                        <Package className="w-10 h-10 mr-4 text-white" />
                                                        <div>
                                                            <h4 className="font-semibold">Order #{order.id}</h4>
                                                            <p className="text-sm text-gray-300">Ordered on {new Date(order.date_created).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="text-white border-white hover:bg-white hover:text-black"
                                                    >
                                                        View Details
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                    {activeItem === 'Wishlist' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {wishlist.map((item: WishlistItem, index) => (
                                                <motion.div
                                                    key={item.id}
                                                    className="bg-gray-700 p-4 rounded-lg flex flex-col"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                >
                                                    <div className="flex items-center mb-2">
                                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                                                        <div>
                                                            <h4 className="font-semibold">{item.name}</h4>
                                                            <p className="text-sm text-gray-300">${item.price}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleRemoveFromWishlist(item.id)}
                                                        className="text-white border-white hover:bg-white hover:text-black mt-2"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Remove
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                    {activeItem === 'Rewards' && (
                                        <div className="space-y-6">
                                            <div className="bg-gray-700 p-6 rounded-lg">
                                                <h4 className="text-xl font-semibold mb-2">Current Points</h4>
                                                <p className="text-4xl font-bold text-white">1,250</p>
                                            </div>
                                            <div className="bg-gray-700 p-6 rounded-lg">
                                                <h4 className="text-xl font-semibold mb-4">Progress to Next Reward</h4>
                                                <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
                                                    <motion.div
                                                        className="bg-white h-4 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: '70%' }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                    ></motion.div>
                                                </div>
                                                <p className="text-sm text-gray-300">175 points to next reward</p>
                                            </div>
                                        </div>
                                    )}
                                    {activeItem === 'Settings' && (
                                        <div className="space-y-4">
                                            {[
                                                { icon: CreditCard, label: 'Payment Methods' },
                                                { icon: MapPin, label: 'Shipping Addresses' },
                                                { icon: Bell, label: 'Notification Preferences' },
                                            ].map((setting, index) => (
                                                <motion.button
                                                    key={index}
                                                    className="w-full bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                >
                                                    <span className="flex items-center">
                                                        <setting.icon className="w-6 h-6 mr-3 text-white" />
                                                        {setting.label}
                                                    </span>
                                                    <ChevronRight className="w-5 h-5" />
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
            <OrderDetailsModal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />
        </div>
    )
}

export default function EcommerceProfileRedesign() {
    return (
        <WishlistProvider>
            <EcommerceProfileRedesignContent />
        </WishlistProvider>
    )
}