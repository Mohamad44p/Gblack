/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShippingZone {
  id: number
  name: string
  price: number
}

interface CustomerDetails {
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
}

interface ShippingAddress {
  address_1: string
  address_2: string
  city: string
  state: string
  postcode: string
  country: string
}

interface OrderDetails {
  notes: string
  gift_wrap: boolean
  newsletter_signup: boolean
}

export default function EnhancedCheckout() {
  const { cart, clearCart, getCartTotal } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
  })
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  })
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    notes: '',
    gift_wrap: false,
    newsletter_signup: false,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: 'customer' | 'shipping' | 'order'
  ) => {
    const { name, value } = e.target
    switch (section) {
      case 'customer':
        setCustomerDetails(prev => ({ ...prev, [name]: value }))
        break
      case 'shipping':
        setShippingAddress(prev => ({ ...prev, [name]: value }))
        break
      case 'order':
        setOrderDetails(prev => ({ ...prev, [name]: value }))
        break
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setOrderDetails(prev => ({ ...prev, [name]: checked }))
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

    const user = localStorage.getItem('user')
    const userId = localStorage.getItem('userId')
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          customerDetails,
          shippingAddress,
          shippingZone: selectedZone,
          paymentMethod: isCashOnDelivery ? 'cod' : 'bacs',
          orderDetails,
          user: user ? JSON.parse(user) : null,
          userId,
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
      router.push(`/order-confirmation/${data.orderId}`)
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card className="text-white border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl">1. Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={customerDetails.first_name}
                    onChange={(e) => handleInputChange(e, 'customer')}
                    required
                    className="border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={customerDetails.last_name}
                    onChange={(e) => handleInputChange(e, 'customer')}
                    required
                    className="border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => handleInputChange(e, 'customer')}
                  required
                  className="border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(e) => handleInputChange(e, 'customer')}
                  required
                  className="border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  name="company"
                  value={customerDetails.company}
                  onChange={(e) => handleInputChange(e, 'customer')}
                  className="border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card className="text-white border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl">2. Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address_1">Address Line 1</Label>
                <Input
                  id="address_1"
                  name="address_1"
                  value={shippingAddress.address_1}
                  onChange={(e) => handleInputChange(e, 'shipping')}
                  required
                  className="border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="address_2">Address Line 2 (Optional)</Label>
                <Input
                  id="address_2"
                  name="address_2"
                  value={shippingAddress.address_2}
                  onChange={(e) => handleInputChange(e, 'shipping')}
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
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    required
                    className="border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    required
                    className="border-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postcode">Postcode/ZIP</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={shippingAddress.postcode}
                    onChange={(e) => handleInputChange(e, 'shipping')}
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
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    required
                    className="border-gray-700 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card className="text-white border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl">3. Shipping & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shipping-zone">Shipping Method</Label>
                <Select onValueChange={(value) => setSelectedZone(shippingZones.find(zone => zone.id.toString() === value) || null)}>
                  <SelectTrigger className="border-gray-700 text-white">
                    <SelectValue placeholder="Select a shipping method" />
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
              <div>
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={orderDetails.notes}
                  onChange={(e) => handleInputChange(e, 'order')}
                  className="border-gray-700 text-white"
                  placeholder="Any special instructions for your order?"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gift-wrap"
                  checked={orderDetails.gift_wrap}
                  onCheckedChange={(checked) => handleCheckboxChange('gift_wrap', checked as boolean)}
                />
                <Label htmlFor="gift-wrap">Gift wrap ($5)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter-signup"
                  checked={orderDetails.newsletter_signup}
                  onCheckedChange={(checked) => handleCheckboxChange('newsletter_signup', checked as boolean)}
                />
                <Label htmlFor="newsletter-signup">Sign up for our newsletter</Label>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            <div className="mt-6 flex justify-between">
              {step > 1 && (
                <Button type="button" onClick={() => setStep(step - 1)} variant="outline">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={() => setStep(step + 1)} className="ml-auto">
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="ml-auto" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      Place Order
                      <ShoppingBag className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
        <div className="lg:col-span-1">
          <Card className="text-white border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <ShoppingBag className="mr-2" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    {item.size && <p className="text-sm text-gray-400">Size: {item.size}</p>}
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
                  <span>{selectedZone ? `$${selectedZone.price.toFixed(2)}` : 'TBD'}</span>
                </div>
                {orderDetails.gift_wrap && (
                  <div className="flex justify-between mt-2">
                    <span>Gift Wrap</span>
                    <span>$5.00</span>
                  </div>
                )}
                <div className="flex justify-between mt-4 text-lg font-bold">
                  <span>Total</span>
                  <span>${(totalWithShipping + (orderDetails.gift_wrap ? 5 : 0)).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}