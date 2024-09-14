import OrderConfirmation from "@/components/order/OrderCinfirmation";

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  return <OrderConfirmation params={params} />
}