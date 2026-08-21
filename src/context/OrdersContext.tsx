import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { CustomerOrder, OrderStatus } from '../data/orders';

type OrdersContextValue = {
  orders: CustomerOrder[];
  addOrder: (order: CustomerOrder) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getOrder: (id: string) => CustomerOrder | undefined;
};

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  const addOrder = useCallback((order: CustomerOrder) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  }, []);

  const getOrder = useCallback(
    (id: string) => orders.find((order) => order.id === id),
    [orders]
  );

  const value = useMemo<OrdersContextValue>(
    () => ({ orders, addOrder, updateOrderStatus, getOrder }),
    [orders, addOrder, updateOrderStatus, getOrder]
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextValue {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
