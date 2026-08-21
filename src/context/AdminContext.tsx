import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useNotifications } from "./NotificationsContext";

export type AdminOrderStatus = "Pending" | "In Progress" | "Completed";

export type AdminOrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupDate: string;
  pickupTime: string;
  driver: string;
  driverPhone: string;
  status: AdminOrderStatus;
  placedAt: string;
  placedAtISO?: string;
  items: AdminOrderItem[];
  deliveryFee: number;
  paymentMethod: "Card" | "EFT" | "Cash";
  instructions: string;
  laundromat?: string;
  laundromatAddress?: string;
};

export type AdminCustomer = {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  joinedDate: string;
  badgeColor: string;
  initialsColor: string;
};

export type AdminDriver = {
  id: string;
  initials: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  vehicle: string;
  registration: string;
  area: "Woodstock" | "Observatory" | "Maitland";
  joinedDate: string;
  badgeColor: string;
  initialsColor: string;
};

export type PriceEntry = {
  price: number;
  enabled: boolean;
};

export type Pricing = {
  delivery: PriceEntry;
  express: PriceEntry;
};

export type AdminService = {
  id: string;
  name: string;
  price: number;
};

type AdminContextValue = {
  orders: AdminOrder[];
  customers: AdminCustomer[];
  drivers: AdminDriver[];
  pricing: Pricing;
  services: AdminService[];
  addOrder: (order: AdminOrder) => void;
  updateOrderStatus: (id: string, status: AdminOrderStatus) => void;
  updateOrder: (id: string, patch: Partial<AdminOrder>) => void;
  assignDriver: (id: string, driverName: string, driverPhone: string) => void;
  addCustomer: (customer: AdminCustomer) => void;
  updateCustomer: (id: string, patch: Partial<AdminCustomer>) => void;
  deleteCustomer: (id: string) => void;
  addDriver: (driver: AdminDriver) => void;
  updateDriver: (id: string, patch: Partial<AdminDriver>) => void;
  deleteDriver: (id: string) => void;
  updatePricing: (patch: Partial<Pricing>) => void;
  addService: (name: string, price: number) => void;
  updateService: (id: string, patch: Partial<Omit<AdminService, "id">>) => void;
  deleteService: (id: string) => void;
  validateDriverCredentials: (
    email: string,
    password: string,
  ) => AdminDriver | null;
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function getOrderTotal(order: AdminOrder): number {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return subtotal + order.deliveryFee;
}

export function getOrderSubtotal(order: AdminOrder): number {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

const seedDrivers: AdminDriver[] = [
  {
    id: "d1",
    initials: "SN",
    name: "Sipho Nkosi",
    email: "sipho@pickup.co.za",
    password: "Sipho#Nkosi",
    phone: "083 214 5567",
    vehicle: "White VW Caddy",
    registration: "CA 482-113",
    area: "Woodstock",
    joinedDate: "Joined Feb 2026",
    badgeColor: "#E8F2FF",
    initialsColor: "#3678E5",
  },
  {
    id: "d2",
    initials: "TD",
    name: "Thabo Dube",
    email: "thabo@pickup.co.za",
    password: "Thabo$Dube",
    phone: "081 556 9012",
    vehicle: "Silver Toyota Corolla",
    registration: "CA 391-887",
    area: "Maitland",
    joinedDate: "Joined Apr 2026",
    badgeColor: "#F0E9FF",
    initialsColor: "#7958D5",
  },
  {
    id: "d3",
    initials: "JE",
    name: "Jeff Erasmus",
    email: "jeff@pickup.co.za",
    password: "Jeff!Erasmus",
    phone: "072 887 3419",
    vehicle: "Blue Ford Fiesta",
    registration: "CA 218-554",
    area: "Woodstock",
    joinedDate: "Joined Jun 2026",
    badgeColor: "#E7F8EE",
    initialsColor: "#21A86A",
  },
  {
    id: "d4",
    initials: "DM",
    name: "David Mthembu",
    email: "david@pickup.co.za",
    password: "David#Mthe",
    phone: "079 412 6678",
    vehicle: "Grey Nissan Bakkie",
    registration: "CA 467-220",
    area: "Observatory",
    joinedDate: "Joined Mar 2026",
    badgeColor: "#FFF1D6",
    initialsColor: "#E89A12",
  },
  {
    id: "d5",
    initials: "LM",
    name: "Lerato Mahlangu",
    email: "lerato@pickup.co.za",
    password: "Lerato/Mahlangu",
    phone: "082 445 8899",
    vehicle: "White Toyota Bakkie",
    registration: "CA 533-091",
    area: "Maitland",
    joinedDate: "Joined Aug 2026",
    badgeColor: "#E9F7F8",
    initialsColor: "#228A92",
    
  },
  {
    id: "d6",
    initials: "ZN",
    name: "Zanele Ndlovu",
    email: "zanele@laundrypickup.co.za",
    password: "Zanele!Ndlovu1",
    phone: "078 331 5520",
    vehicle: "Red Hyundai i20",
    registration: "CA 176-338",
    area: "Observatory",
    joinedDate: "Joined Oct 2026",
    badgeColor: "#FFE8EF",
    initialsColor: "#D95B82",
  },
];

const DEFAULT_PRICING: Pricing = {
  delivery: { price: 60, enabled: true },
  express: { price: 5, enabled: true },
};

const DEFAULT_SERVICES: AdminService[] = [
  { id: "s1", name: "Wash & Fold (per kg)", price: 55 },
  { id: "s2", name: "Wash & Iron (per kg)", price: 85 },
  { id: "s3", name: "Dry Cleaning (per item)", price: 45 },
  { id: "s4", name: "Pickup & Delivery", price: 60 },
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [drivers, setDrivers] = useState<AdminDriver[]>(seedDrivers);
  const [pricing, setPricing] = useState<Pricing>(DEFAULT_PRICING);
  const [services, setServices] = useState<AdminService[]>(DEFAULT_SERVICES);
  const { pushNotification } = useNotifications();

  const addOrder = useCallback((order: AdminOrder) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback(
    (id: string, status: AdminOrderStatus) => {
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order)),
      );
    },
    [],
  );

  const updateOrder = useCallback((id: string, patch: Partial<AdminOrder>) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, ...patch } : order)),
    );
  }, []);

  const assignDriver = useCallback(
    (id: string, driverName: string, driverPhone: string) => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== id) return order;
          return {
            ...order,
            driver: driverName,
            driverPhone,
            status: order.status === "Pending" ? "In Progress" : order.status,
          };
        }),
      );
      pushNotification({
        kind: "order_assigned",
        audience: "driver",
        recipientName: driverName,
        orderId: id,
        title: "New Order Assigned",
        message: `Order ${id} has been assigned to you. Please check your Orders tab to view the details.`,
      }).catch(() => undefined);
    },
    [pushNotification],
  );

  const addCustomer = useCallback((customer: AdminCustomer) => {
    setCustomers((prev) => [customer, ...prev]);
  }, []);

  const updateCustomer = useCallback(
    (id: string, patch: Partial<AdminCustomer>) => {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === id ? { ...customer, ...patch } : customer,
        ),
      );
    },
    [],
  );

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  }, []);

  const addDriver = useCallback((driver: AdminDriver) => {
    setDrivers((prev) => [driver, ...prev]);
  }, []);

  const updateDriver = useCallback(
    (id: string, patch: Partial<AdminDriver>) => {
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === id ? { ...driver, ...patch } : driver,
        ),
      );
    },
    [],
  );

  const deleteDriver = useCallback((id: string) => {
    setDrivers((prev) => prev.filter((driver) => driver.id !== id));
  }, []);

  const validateDriverCredentials = useCallback(
    (email: string, password: string): AdminDriver | null => {
      const match = drivers.find(
        (d) =>
          d.email.toLowerCase() === email.trim().toLowerCase() &&
          d.password === password.trim(),
      );
      return match ?? null;
    },
    [drivers],
  );

  const updatePricing = useCallback((patch: Partial<Pricing>) => {
    setPricing((prev) => ({ ...prev, ...patch }));
  }, []);

  const addService = useCallback((name: string, price: number) => {
    setServices((prev) => [
      ...prev,
      { id: `svc-${Date.now()}`, name, price },
    ]);
  }, []);

  const updateService = useCallback(
    (id: string, patch: Partial<Omit<AdminService, "id">>) => {
      setServices((prev) =>
        prev.map((service) =>
          service.id === id ? { ...service, ...patch } : service,
        ),
      );
    },
    [],
  );

  const deleteService = useCallback((id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      orders,
      customers,
      drivers,
      pricing,
      services,
      addOrder,
      updateOrderStatus,
      updateOrder,
      assignDriver,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addDriver,
      updateDriver,
      deleteDriver,
      updatePricing,
      addService,
      updateService,
      deleteService,
      validateDriverCredentials,
    }),
    [
      orders,
      customers,
      drivers,
      pricing,
      services,
      addOrder,
      updateOrderStatus,
      updateOrder,
      assignDriver,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addDriver,
      updateDriver,
      deleteDriver,
      updatePricing,
      addService,
      updateService,
      deleteService,
      validateDriverCredentials,
    ],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
