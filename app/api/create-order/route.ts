import { NextRequest, NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function POST(request: NextRequest) {
  try {
    const { cart, shippingAddress, shippingZone, paymentMethod } = await request.json();

    const lineItems = cart.map((item: any) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const orderData = {
      payment_method: paymentMethod,
      payment_method_title: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
      set_paid: false,
      billing: shippingAddress,
      shipping: shippingAddress,
      line_items: lineItems,
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: shippingZone.name,
          total: shippingZone.price.toString()
        }
      ]
    };

    const response = await api.post("orders", orderData);

    return NextResponse.json({ orderId: response.data.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}