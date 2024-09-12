'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ShoppingBag } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShippingZone {
  id: number
  name: string
  price: number
}

interface ShippingAddress {
  first_name: string
  last_name: string
  address_1: string
  address_2: string
  city: string
  state: string
  postcode: string
  country: string
}

export default function EnhancedCheckout() {
  const { cart, clearCart, getCartTotal } = useCart()
  const { toast } = useToast()
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  })
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([])
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null)
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchShippingZones()
  }, [])

  const fetchShippingZones = async () => {
    try {
      const response = await fetch('/api/shipping-zones')
      if (!response.ok) throw new Error('Failed to fetch shipping zones')
      const data = await response.json()
      setShippingZones(data)
    } catch (error) {
      console.error('Error fetching shipping zones:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch shipping zones. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedZone) {
      toast({
        title: 'Error',
        description: 'Please select a shipping zone.',
        variant: 'destructive',
      })
      return
    }
    setIsLoading(true)

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          shippingAddress,
          shippingZone: selectedZone,
          paymentMethod: isCashOnDelivery ? 'cod' : 'bacs',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const data = await response.json()

      toast({
        title: 'Order placed successfully!',
        description: `Your order number is: ${data.orderId}`,
      })

      clearCart()
    } catch (error) {
      console.error('Error creating order:', error)
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalWithShipping = getCartTotal() + (selectedZone?.price || 0)

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card className="text-white border-gray-800">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={shippingAddress.first_name}
                    onChange={handleInputChange}
                    required
                    className="border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={shippingAddress.last_name}
                    onChange={handleInputChange}
                    required
                    className="border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address_1">Address Line 1</Label>
                <Input
                  id="address_1"
                  name="address_1"
                  value={shippingAddress.address_1}
                  onChange={handleInputChange}
                  required
                  className="border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="address_2">Address Line 2</Label>
                <Input
                  id="address_2"
                  name="address_2"
                  value={shippingAddress.address_2}
                  onChange={handleInputChange}
                  className="border-gray-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                    className="border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    required
                    className="border-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={shippingAddress.postcode}
                    onChange={handleInputChange}
                    required
                    className="border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    required
                    className="border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="shipping-zone">Shipping Zone</Label>
                <Select onValueChange={(value) => setSelectedZone(shippingZones.find(zone => zone.id.toString() === value) || null)}>
                  <SelectTrigger className="border-gray-700 text-white">
                    <SelectValue placeholder="Select a shipping zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingZones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id.toString()}>
                        {zone.name} - ${zone.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cash-on-delivery"
                  checked={isCashOnDelivery}
                  onCheckedChange={(checked) => setIsCashOnDelivery(checked as boolean)}
                />
                <Label htmlFor="cash-on-delivery">Cash on Delivery</Label>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </Button>
        </form>
        <div className="lg:col-span-1">
          <Card className="text-white border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="mr-2" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Shipping</span>
                  <span>${selectedZone ? selectedZone.price.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between mt-4 text-lg font-bold">
                  <span>Total</span>
                  <span>${totalWithShipping.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}