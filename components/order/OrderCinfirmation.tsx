/* eslint-disable react/no-unescaped-entities */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { jsPDF } from "jspdf"
import { Download, CheckCircle, ShoppingBag, Truck, Calendar, CreditCard } from 'lucide-react'

interface OrderDetails {
  id: string
  status: string
  date_created: string
  total: string
  line_items: Array<{
    name: string
    quantity: number
    total: string
    meta_data: Array<{
      key: string
      value: string
    }>
  }>
  shipping: {
    first_name: string
    last_name: string
    address_1: string
    city: string
    state: string
    postcode: string
    country: string
  }
}

export default function OrderConfirmation({ params }: { params: { id: string } }) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [totalWithExtras, setTotalWithExtras] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch order details')
        const data = await response.json()
        setOrderDetails(data)
        const orderTotal = parseFloat(data.total)
        const shippingTotal = parseFloat(data.shipping_total)
        const giftWrapFee = data.meta_data.find((meta: any) => meta.key === 'gift_wrap')?.value === 'Yes' ? 5 : 0
        const newTotal = (orderTotal + shippingTotal + giftWrapFee).toFixed(2)
        setTotalWithExtras(newTotal)
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [params.id])

  const generatePDF = () => {
    if (!orderDetails) return

    const doc = new jsPDF()

    // Set background color
    doc.setFillColor(41, 37, 36)
    doc.rect(0, 0, 210, 297, 'F')

    // Header
    doc.setFillColor(82, 74, 72)
    doc.roundedRect(10, 10, 190, 40, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Order Confirmation', 105, 30, { align: 'center' })
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Order ID: ${orderDetails.id}`, 105, 40, { align: 'center' })

    // Order Details
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Order Details', 20, 70)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${new Date(orderDetails.date_created).toLocaleDateString()}`, 20, 80)
    doc.text(`Status: ${orderDetails.status}`, 20, 90)
    doc.text(`Total: ${totalWithExtras} NIS`, 20, 100)

    // Shipping Address
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Shipping Address', 20, 120)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`${orderDetails.shipping.first_name} ${orderDetails.shipping.last_name}`, 20, 130)
    doc.text(orderDetails.shipping.address_1, 20, 140)
    doc.text(`${orderDetails.shipping.city}, ${orderDetails.shipping.state} ${orderDetails.shipping.postcode}`, 20, 150)
    doc.text(orderDetails.shipping.country, 20, 160)

    // Order Items
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Order Items', 20, 180)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    let yPos = 190
    orderDetails.line_items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} (Qty: ${item.quantity}) - ${item.total} NIS`, 25, yPos)
      yPos += 10
    })

    // Footer
    doc.setFillColor(82, 74, 72)
    doc.roundedRect(10, 267, 190, 20, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.text('Thank you for your purchase!', 105, 280, { align: 'center' })

    doc.save(`order-confirmation-${orderDetails.id}.pdf`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-stone-900 min-h-screen">
        <Card className="bg-stone-800 text-white border-stone-700">
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2 bg-stone-700" />
            <Skeleton className="h-4 w-32 bg-stone-700" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2 bg-stone-700" />
            <Skeleton className="h-4 w-full mb-2 bg-stone-700" />
            <Skeleton className="h-4 w-full bg-stone-700" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-stone-900 min-h-screen">
        <Card className="bg-stone-800 text-white border-stone-700">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription className="text-stone-400">We couldn't find the order you're looking for.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/')} className="bg-stone-700 hover:bg-stone-600 text-white">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-stone-900 min-h-screen"
    >
      <Card className="bg-stone-800 text-white border-stone-700 overflow-hidden">
        <CardHeader className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500 to-blue-500 opacity-20"
          />
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <CardTitle className="text-4xl flex items-center justify-center mb-4">
              <CheckCircle className="mr-2 text-green-500" size={40} />
              Order Confirmed
            </CardTitle>
          </motion.div>
          <CardDescription className="text-stone-300 text-center text-lg">
            Thank you for your purchase! Your order has been received and is being processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <AnimatePresence>
            <motion.div
              key="order-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-stone-700 p-6 rounded-lg shadow-lg">
                <h3 className="font-semibold mb-4 text-2xl flex items-center">
                  <Calendar className="mr-2 text-blue-400" size={24} />
                  Order Details
                </h3>
                <p className="mb-2"><strong>Order ID:</strong> {orderDetails.id}</p>
                <p className="mb-2"><strong>Date:</strong> {new Date(orderDetails.date_created).toLocaleDateString()}</p>
                <p className="mb-2"><strong>Status:</strong> {orderDetails.status}</p>
                <p className="text-2xl font-bold mt-4 text-green-400">Total: {totalWithExtras} NIS</p>
              </div>
              <div className="bg-stone-700 p-6 rounded-lg shadow-lg">
                <h3 className="font-semibold mb-4 text-2xl flex items-center">
                  <Truck className="mr-2 text-blue-400" size={24} />
                  Shipping Address
                </h3>
                <p className="mb-2">{orderDetails.shipping.first_name} {orderDetails.shipping.last_name}</p>
                <p className="mb-2">{orderDetails.shipping.address_1}</p>
                <p className="mb-2">{orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.postcode}</p>
                <p>{orderDetails.shipping.country}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h3 className="font-semibold mb-4 text-2xl flex items-center">
              <ShoppingBag className="mr-2 text-blue-400" size={24} />
              Order Items
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-stone-600">
                    <TableHead className="text-white">Item</TableHead>
                    <TableHead className="text-white">Quantity</TableHead>
                    <TableHead className="text-white text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails.line_items.map((item, index) => (
                    <TableRow key={index} className="border-b border-stone-600">
                      <TableCell className="font-medium">
                        {item.name}
                        {item.meta_data.find((meta: any) => meta.key === 'Size') && (
                          <span className="text-sm text-stone-400"> (Size: {item.meta_data.find((meta: any) => meta.key === 'Size')?.value})</span>
                        )}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.total} NIS</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 bg-stone-700 mt-8 p-6 rounded-b-lg">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => router.push('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={generatePDF}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}