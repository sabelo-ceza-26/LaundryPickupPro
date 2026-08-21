import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';

import type { Order } from '../navigation/DriverNavigator';

type DriverOrdersContextValue = {
    orders: Order[];
    addOrder: (order: Order) => void;
    updateOrderStatus: (
        orderNumber: string,
        status: Order['status'],
    ) => void;
    getOrder: (orderNumber: string) => Order | undefined;
};

const DriverOrdersContext =
    createContext<DriverOrdersContextValue | undefined>(undefined);

export function DriverOrdersProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [orders, setOrders] = useState<Order[]>([]);

    const addOrder = useCallback((order: Order) => {
        setOrders((prev) => [order, ...prev]);
    }, []);

    const updateOrderStatus = useCallback(
        (
            orderNumber: string,
            status: Order['status'],
        ) => {
            setOrders((prev) =>
                prev.map((order) =>
                    order.orderNumber === orderNumber
                        ? { ...order, status }
                        : order,
                ),
            );
        },
        [],
    );

    const getOrder = useCallback(
        (orderNumber: string) =>
            orders.find((order) => order.orderNumber === orderNumber),
        [orders],
    );

    const value = useMemo<DriverOrdersContextValue>(
        () => ({ orders, addOrder, updateOrderStatus, getOrder }),
        [orders, addOrder, updateOrderStatus, getOrder],
    );

    return (
        <DriverOrdersContext.Provider value={value}>
            {children}
        </DriverOrdersContext.Provider>
    );
}

export function useDriverOrders(): DriverOrdersContextValue {
    const context = useContext(DriverOrdersContext);
    if (context === undefined) {
        throw new Error(
            'useDriverOrders must be used within a DriverOrdersProvider',
        );
    }
    return context;
}
