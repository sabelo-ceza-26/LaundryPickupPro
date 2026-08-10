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
    updateOrderStatus: (
        orderNumber: string,
        status: Order['status'],
    ) => void;
    getOrder: (orderNumber: string) => Order | undefined;
};

const seedOrders: Order[] = [
    {
        id: 1,
        orderNumber: 'ORD-1001',
        type: 'Pickup',
        customer: 'Matthew Yako',
        phone: '083 987 5462',
        address: '173 Sir Lowry, Woodstock',
        laundromat: 'Clean & Fresh Laundry',
        laundromatAddress: '17 Hanover Street, District Six',
        time: '10:30 AM',
        status: 'Assigned',
        notes: 'Leave laundry bags on the front porch if not answered.',
    },
    {
        id: 2,
        orderNumber: 'ORD-1002',
        type: 'Pickup',
        customer: 'Nosipho Dlala',
        phone: '081 123 4567',
        address: '01 Adderley Rd, Maitland',
        laundromat: 'Fresh Laundry',
        laundromatAddress: '10 Main Road',
        time: '12:00 PM',
        status: 'Pending',
        notes: 'Call before arrival.',
    },
    {
        id: 3,
        orderNumber: 'ORD-1003',
        type: 'Delivery',
        customer: 'Andiswa Gumede',
        phone: '082 345 6789',
        address: '173 Sir Lowry, Woodstock',
        laundromat: 'Sparkle Laundry',
        laundromatAddress: '22 Long Street',
        time: '11:00 AM',
        status: 'Assigned',
        notes: 'Leave with security.',
    },
    {
        id: 4,
        orderNumber: 'ORD-1004',
        type: 'Delivery',
        customer: 'Jessica Moose',
        phone: '079 123 1111',
        address: '10 St Marks, Observatory',
        laundromat: 'Sparkle Laundry',
        laundromatAddress: '22 Long Street',
        time: '15:30 PM',
        status: 'Pending',
        notes: 'Customer not home before 3pm.',
    },
];

const DriverOrdersContext =
    createContext<DriverOrdersContextValue | undefined>(undefined);

export function DriverOrdersProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [orders, setOrders] = useState<Order[]>(seedOrders);

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
        () => ({ orders, updateOrderStatus, getOrder }),
        [orders, updateOrderStatus, getOrder],
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
