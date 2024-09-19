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
    const {
      cart,
      customerDetails,
      shippingAddress,
      shippingZone,
      paymentMethod,
      orderDetails,
      user,
      userId,
    } = await request.json();

    const lineItems = cart.map((item: any) => ({
      product_id: item.id,
      quantity: item.quantity,
      meta_data: item.size ? [{ key: "Size", value: item.size }] : [],
    }));

    const orderData: any = {
      payment_method: paymentMethod,
      payment_method_title:
        paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer",
      set_paid: false,
      billing: {
        ...shippingAddress,
        first_name: customerDetails.first_name,
        last_name: customerDetails.last_name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        company: customerDetails.company,
      },
      shipping: {
        ...shippingAddress,
        first_name: customerDetails.first_name,
        last_name: customerDetails.last_name,
      },
      line_items: lineItems,
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: shippingZone.name,
          total: shippingZone.price.toString(),
        },
      ],
      meta_data: [
        {
          key: "gift_wrap",
          value: orderDetails.gift_wrap ? "Yes" : "No",
        },
        {
          key: "newsletter_signup",
          value: orderDetails.newsletter_signup ? "Yes" : "No",
        },
      ],
      customer_note: orderDetails.notes,
      fee_lines: [],
    };

    if (userId) {
      orderData.customer_id = parseInt(userId);
    }
    if (orderDetails.gift_wrap) {
      orderData.fee_lines = [
        {
          name: "Gift Wrap",
          total: "5.00",
          tax_status: "taxable",
          tax_class: "",
        },
      ];
    }

    console.log("Order Data:", orderData);
    const response = await api.post("orders", orderData);

    return NextResponse.json({ orderId: response.data.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
