"use client"
import React, { useState, useEffect } from "react";

type Order = {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: string[];
  total: string;
};

type OrderCardProps = {
  order: Order;
  onRemove: (id: string) => void;
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onRemove }) => {
  return (
    <div className="m-5">
        <div className="bg-white p-4 rounded-lg shadow-md w-80 border border-1">
      <h2 className="text-lg font-semibold text-gray-800">Order #{order.id}</h2>
      <p className="text-sm text-gray-600">Placed on: {order.date}</p>
      
      <div className="mt-2">
        <p className="font-medium">Customer: {order.customerName}</p>
        <p className="text-sm text-gray-700">Email: {order.customerEmail}</p>
      </div>
      
      <div className="mt-2 border-t pt-2">
        <p className="font-medium">Items:</p>
        <ul className="list-disc ml-4 text-sm text-gray-700">
          {order.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-2 border-t pt-2">
        <p className="font-medium">Total: ${order.total}</p>
      </div>

      <button
        onClick={() => onRemove(order.id)}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
      >
        Remove Order
      </button>
    </div>
    </div>
  );
};

export default function OrderTracker() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const mockOrders: Order[] = Array.from({ length: 10 }, (_, i) => ({
      id: (i + 1).toString(),
      date: new Date().toLocaleDateString(),
      customerName: `Customer ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,
      items: ["Product A", "Product B", "Product C"],
      total: (Math.random() * 100 + 20).toFixed(2),
    }));
    setOrders(mockOrders);
  }, []);

  const removeOrder = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  return (
      <div className=""> 
        {orders.map(order => (
          <OrderCard key={order.id} order={order} onRemove={removeOrder} />
        ))}
      </div>
  );
}
