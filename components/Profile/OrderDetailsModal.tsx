import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

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

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[60vh]">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Order #{order.id}</h3>
              <p className="text-sm text-gray-500">Date: {new Date(order.date_created).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Status: {order.status}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Items:</h4>
              {order.line_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="font-semibold text-lg">
              Total: ${order.total}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}