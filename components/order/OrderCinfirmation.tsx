/* eslint-disable react/no-unescaped-entities */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { jsPDF } from "jspdf"
import { Download, CheckCircle, ShoppingBag } from 'lucide-react'

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

    doc.setFillColor(41, 37, 36)
    doc.rect(0, 0, 210, 30, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('Order Confirmation', 105, 20, { align: 'center' })

    doc.setTextColor(0, 0, 0)

    doc.setFontSize(12)
    doc.text(`Order ID: ${orderDetails.id}`, 20, 40)
    doc.text(`Date: ${new Date(orderDetails.date_created).toLocaleDateString()}`, 20, 50)
    doc.text(`Status: ${orderDetails.status}`, 20, 60)
    doc.text(`Total: $${orderDetails.total}`, 20, 70)

    doc.setFontSize(14)
    doc.text('Shipping Address:', 20, 85)
    doc.setFontSize(12)
    doc.text(`${orderDetails.shipping.first_name} ${orderDetails.shipping.last_name}`, 25, 95)
    doc.text(orderDetails.shipping.address_1, 25, 102)
    doc.text(`${orderDetails.shipping.city}, ${orderDetails.shipping.state} ${orderDetails.shipping.postcode}`, 25, 109)
    doc.text(orderDetails.shipping.country, 25, 116)

    doc.setFontSize(14)
    doc.text('Order Items:', 20, 131)
    let yPos = 141
    orderDetails.line_items.forEach((item, index) => {
      doc.setFontSize(12)
      doc.text(`${index + 1}. ${item.name} (Qty: ${item.quantity}) - $${item.total}`, 25, yPos)
      yPos += 10
    })

    doc.setFillColor(41, 37, 36)
    doc.rect(0, 280, 210, 17, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.text('Thank you for your purchase!', 105, 290, { align: 'center' })

    doc.save(`order-confirmation-${orderDetails.id}.pdf`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>We couldn't find the order you're looking for.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/')}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-stone-800 min-h-screen"
    >
      <Card className="bg-stone-900 text-white border-stone-700">
        <CardHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          >
            <CardTitle className="text-3xl flex items-center justify-center mb-4">
              <CheckCircle className="mr-2 text-green-500" size={32} />
              Order Confirmation
            </CardTitle>
          </motion.div>
          <CardDescription className="text-stone-400 text-center text-lg">
            Thank you for your purchase! Your order has been received.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-stone-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-xl">Order Details</h3>
              <p>Order ID: {orderDetails.id}</p>
              <p>Date: {new Date(orderDetails.date_created).toLocaleDateString()}</p>
              <p>Status: {orderDetails.status}</p>
              <p className="text-xl font-bold mt-2">Total: ${orderDetails.total}</p>
            </div>
            <div className="bg-stone-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-xl">Shipping Address</h3>
              <p>{orderDetails.shipping.first_name} {orderDetails.shipping.last_name}</p>
              <p>{orderDetails.shipping.address_1}</p>
              <p>{orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.postcode}</p>
              <p>{orderDetails.shipping.country}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-semibold mb-4 text-xl">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-stone-700">
                  <TableHead className="text-white">Item</TableHead>
                  <TableHead className="text-white">Quantity</TableHead>
                  <TableHead className="text-white text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.line_items.map((item, index) => (
                  <TableRow key={index} className="border-b border-stone-700">
                    <TableCell className="font-medium">
                      {item.name}
                      {item.meta_data.find((meta: any) => meta.key === 'Size') && (
                        <span className="text-sm text-gray-400"> (Size: {item.meta_data.find((meta: any) => meta.key === 'Size')?.value})</span>
                      )}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <Button
            onClick={() => router.push('/')}
            className="bg-stone-700 hover:bg-stone-600 text-white w-full sm:w-auto"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
          <Button
            onClick={generatePDF}
            variant="outline"
            className="border-stone-700 text-white hover:bg-stone-700 w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}