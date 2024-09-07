/* eslint-disable @next/next/no-img-element */
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface OrderDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    order: {
        id: number
        date: string
        items: Array<{
            id: number
            name: string
            price: number
            image: string
        }>
        total: number
    }
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-white">Order #{order.id}</h3>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <p className="text-gray-300 mb-4">Ordered on: {order.date}</p>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg"
                                >
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-white">{item.name}</h4>
                                        <p className="text-gray-300">${item.price.toFixed(2)}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-600">
                            <p className="text-xl font-bold text-white">Total: ${order.total.toFixed(2)}</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}