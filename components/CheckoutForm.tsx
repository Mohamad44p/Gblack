"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

interface ShippingZone {
  id: number;
  name: string;
  price: number;
}

const customerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().optional(),
});

const shippingSchema = z.object({
  address_1: z.string().min(1, "Address is required"),
  address_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().min(1, "Country is required"),
});

const orderSchema = z.object({
  notes: z.string().optional(),
  gift_wrap: z.boolean(),
  newsletter_signup: z.boolean(),
});

export default function EnhancedCheckout() {
  const { cart, clearCart, getCartTotal } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const customerForm = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
    },
  });

  const shippingForm = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
    },
  });

  const orderForm = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      notes: "",
      gift_wrap: false,
      newsletter_signup: false,
    },
  });

  useEffect(() => {
    fetchShippingZones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchShippingZones = async () => {
    try {
      const response = await fetch("/api/shipping-zones");
      if (!response.ok) throw new Error("Failed to fetch shipping zones");
      const data = await response.json();
      setShippingZones(data);
    } catch (error) {
      console.error("Error fetching shipping zones:", error);
      toast({
        title: "Error",
        description: "Failed to fetch shipping zones. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedZone) {
      toast({
        title: "Error",
        description: "Please select a shipping zone.",
        variant: "destructive",
      });
      return;
    }

    const isCustomerValid = await customerForm.trigger();
    const isShippingValid = await shippingForm.trigger();
    const isOrderValid = await orderForm.trigger();

    if (!isCustomerValid || !isShippingValid || !isOrderValid) {
      toast({
        title: "Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const customerData = customerForm.getValues();
    const shippingData = shippingForm.getValues();
    const orderData = orderForm.getValues();

    const user = localStorage.getItem("user");
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          customerDetails: customerData,
          shippingAddress: shippingData,
          shippingZone: selectedZone,
          paymentMethod: isCashOnDelivery ? "cod" : "bacs",
          orderDetails: orderData,
          user: user ? JSON.parse(user) : null,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();

      toast({
        title: "Order placed successfully!",
        description: `Your order number is: ${data.orderId}`,
      });

      clearCart();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalWithShipping = useMemo(() => {
    return (
      getCartTotal() +
      (selectedZone?.price || 0) +
      (orderForm.watch("gift_wrap") ? 5 : 0)
    );
  }, [getCartTotal, selectedZone, orderForm]);

  const validateStep = async (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return await customerForm.trigger();
      case 2:
        return await shippingForm.trigger();
      case 3:
        return (await orderForm.trigger()) && selectedZone !== null;
      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    const isValid = await validateStep(step);
    if (isValid) {
      setStep(step + 1);
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

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
                    {...customerForm.register("first_name")}
                    className="border-gray-700 text-white"
                  />
                  {customerForm.formState.errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {customerForm.formState.errors.first_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    {...customerForm.register("last_name")}
                    className="border-gray-700 text-white"
                  />
                  {customerForm.formState.errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {customerForm.formState.errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...customerForm.register("email")}
                  className="border-gray-700 text-white"
                />
                {customerForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {customerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...customerForm.register("phone")}
                  className="border-gray-700 text-white"
                />
                {customerForm.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {customerForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  {...customerForm.register("company")}
                  className="border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="text-white border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl">
                2. Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address_1">Address Line 1</Label>
                <Input
                  id="address_1"
                  {...shippingForm.register("address_1")}
                  className="border-gray-700 text-white"
                />
                {shippingForm.formState.errors.address_1 && (
                  <p className="text-red-500 text-sm mt-1">
                    {shippingForm.formState.errors.address_1.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="address_2">Address Line 2 (Optional)</Label>
                <Input
                  id="address_2"
                  {...shippingForm.register("address_2")}
                  className="border-gray-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...shippingForm.register("city")}
                    className="border-gray-700 text-white"
                  />
                  {shippingForm.formState.errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {shippingForm.formState.errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    {...shippingForm.register("state")}
                    className="border-gray-700 text-white"
                  />
                  {shippingForm.formState.errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {shippingForm.formState.errors.state.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postcode">Postcode/ZIP</Label>
                  <Input
                    id="postcode"
                    {...shippingForm.register("postcode")}
                    className="border-gray-700 text-white"
                  />
                  {shippingForm.formState.errors.postcode && (
                    <p className="text-red-500 text-sm mt-1">
                      {shippingForm.formState.errors.postcode.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...shippingForm.register("country")}
                    className="border-gray-700 text-white"
                  />
                  {shippingForm.formState.errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {shippingForm.formState.errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="text-white border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl">3. Shipping & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shipping-zone">Choose your Area</Label>
                <Select
                  onValueChange={(value) =>
                    setSelectedZone(
                      shippingZones.find(
                        (zone) => zone.id.toString() === value
                      ) || null
                    )
                  }
                >
                  <SelectTrigger className="border-gray-700 text-white">
                    <SelectValue placeholder="Select your area" />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingZones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id.toString()}>
                        {zone.name} - {zone.price.toFixed(2)} NIS
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedZone && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select your area
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select
                  onValueChange={(value) =>
                    setIsCashOnDelivery(value === "cod")
                  }
                  defaultValue="cod"
                >
                  <SelectTrigger className="border-gray-700 text-white">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  {...orderForm.register("notes")}
                  className="border-gray-700 text-white"
                  placeholder="Any special instructions for your order?"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gift-wrap"
                  checked={orderForm.watch("gift_wrap")}
                  onCheckedChange={(checked) =>
                    orderForm.setValue("gift_wrap", checked as boolean)
                  }
                />
                <Label htmlFor="gift-wrap">Gift wrap (5 NIS)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter-signup"
                  checked={orderForm.watch("newsletter_signup")}
                  onCheckedChange={(checked) =>
                    orderForm.setValue("newsletter_signup", checked as boolean)
                  }
                />
                <Label htmlFor="newsletter-signup">
                  Sign up for our newsletter
                </Label>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">

      <div className="lg:col-span-1 lg:order-2">
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
                    <Image
                      src={item.image}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      priority
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity}
                    </p>
                    {item.size && (
                      <p className="text-sm text-gray-400">Size: {item.size}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} NIS
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{getCartTotal().toFixed(2)} NIS</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Shipping</span>
                  <span>
                    {selectedZone
                      ? `${selectedZone.price.toFixed(2)} NIS`
                      : "TBD"}
                  </span>
                </div>
                {orderForm.watch("gift_wrap") && (
                  <div className="flex justify-between mt-2">
                    <span>Gift Wrap</span>
                    <span>5.00 NIS</span>
                  </div>
                )}
                <div className="flex justify-between mt-4 text-lg font-bold">
                  <span>Total</span>
                  <span>{totalWithShipping.toFixed(2)} NIS</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        <div className="lg:col-span-2 lg:order-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 3) {
                handleSubmit();
              } else {
                handleNextStep();
              }
            }}
          >
            {renderStepContent()}
            <div className="mt-6 flex justify-between">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              )}
              {step < 3 ? (
                <Button type="submit" className="ml-auto">
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
      </div>
    </div>
  );
}
