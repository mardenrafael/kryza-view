"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function PedidosPage() {
  const [orders, setOrders] = useState<
    {
      id: string;
      status: {
        name: string;
      };
    }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
    setLoading(false);
  };

  const deleteOrder = async (id: string) => {
    try {
      await api.delete(`/api/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <>
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id} className="shadow-md">
                <CardContent>
                  <h2 className="text-lg font-semibold">{order.id}</h2>
                  <p>Status: {order.status.name}</p>
                  <Button
                    variant="destructive"
                    onClick={() => deleteOrder(order.id)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </>
      )}
    </div>
  );
}
