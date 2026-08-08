import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type AdminOrderStatus = 'Pending' | 'In Progress' | 'Completed';

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
  items: AdminOrderItem[];
  deliveryFee: number;
  paymentMethod: 'Card' | 'EFT' | 'Cash';
  instructions: string;
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
  phone: string;
  vehicle: string;
  registration: string;
  area: 'Woodstock' | 'Observatory' | 'Maitland';
  totalTrips: number;
  joinedDate: string;
  badgeColor: string;
  initialsColor: string;
};

export type PriceEntry = {
  price: number;
  enabled: boolean;
};

export type Pricing = {
  smallLoad: PriceEntry;
  mediumLoad: PriceEntry;
  largeLoad: PriceEntry;
  bag: PriceEntry;
  delivery: PriceEntry;
  express: PriceEntry;
};

type AdminContextValue = {
  orders: AdminOrder[];
  customers: AdminCustomer[];
  drivers: AdminDriver[];
  pricing: Pricing;
  addOrder: (order: AdminOrder) => void;
  updateOrderStatus: (id: string, status: AdminOrderStatus) => void;
  addCustomer: (customer: AdminCustomer) => void;
  updateCustomer: (id: string, patch: Partial<AdminCustomer>) => void;
  deleteCustomer: (id: string) => void;
  addDriver: (driver: AdminDriver) => void;
  updateDriver: (id: string, patch: Partial<AdminDriver>) => void;
  deleteDriver: (id: string) => void;
  updatePricing: (patch: Partial<Pricing>) => void;
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function getOrderTotal(order: AdminOrder): number {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return subtotal + order.deliveryFee;
}

export function getOrderSubtotal(order: AdminOrder): number {
  return order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

const seedOrders: AdminOrder[] = [
  {
    id: '#SUD-9020',
    customerName: 'Sarah Jenkins',
    customerPhone: '+27 82 123 4567',
    pickupAddress: '14 Adderley Street, Maitland',
    deliveryAddress: '14 Adderley Street, Maitland',
    pickupDate: 'Tue, July 27',
    pickupTime: '09:00 AM',
    driver: 'Sipho Nkosi',
    driverPhone: '083 214 5567',
    status: 'Pending',
    placedAt: 'Mon, Jul 26 · 4:12 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 4, price: 55 },
      { name: 'Ironing Only (per item)', quantity: 1, price: 15 },
    ],
    deliveryFee: 45,
    paymentMethod: 'Card',
    instructions: 'Leave bags at the front gate if no one is home.',
  },
  {
    id: '#SUD-9021',
    customerName: 'David Mokoena',
    customerPhone: '+27 73 987 6543',
    pickupAddress: '45 Regent Road, Woodstock',
    deliveryAddress: '45 Regent Road, Woodstock',
    pickupDate: 'Tue, July 27',
    pickupTime: '10:30 AM',
    driver: 'Thabo Dube',
    driverPhone: '081 556 9012',
    status: 'In Progress',
    placedAt: 'Mon, Jul 26 · 5:03 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 2, price: 55 },
      { name: 'Ironing Only (per item)', quantity: 2, price: 15 },
    ],
    deliveryFee: 45,
    paymentMethod: 'EFT',
    instructions: '',
  },
  {
    id: '#SUD-9022',
    customerName: 'Thabelo Cele',
    customerPhone: '+27 81 555 0192',
    pickupAddress: '22 Main Road, Observatory',
    deliveryAddress: '22 Main Road, Observatory',
    pickupDate: 'Tue, July 27',
    pickupTime: '11:00 AM',
    driver: 'Amina Jaffer',
    driverPhone: '072 887 3419',
    status: 'Completed',
    placedAt: 'Sun, Jul 25 · 9:20 AM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 4, price: 55 },
      { name: 'Comforter (Queen)', quantity: 1, price: 85 },
    ],
    deliveryFee: 45,
    paymentMethod: 'Card',
    instructions: 'Call before delivery.',
  },
  {
    id: '#SUD-9023',
    customerName: 'Matthew Yako',
    customerPhone: '+27 64 333 4455',
    pickupAddress: '173 Sir Lowry Road, Woodstock',
    deliveryAddress: '45 Regent Road, Sea Point',
    pickupDate: 'Tue, July 28',
    pickupTime: '10:30 AM',
    driver: 'David Mthembu',
    driverPhone: '079 412 6678',
    status: 'Pending',
    placedAt: 'Mon, Jul 26 · 6:41 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 3, price: 55 },
      { name: 'Ironing Only (per item)', quantity: 1, price: 15 },
    ],
    deliveryFee: 45,
    paymentMethod: 'Cash',
    instructions: 'Different delivery address from pickup.',
  },
  {
    id: '#SUD-9024',
    customerName: 'Andiswa Gumede',
    customerPhone: '+27 72 448 1105',
    pickupAddress: '10 Station Road, Maitland',
    deliveryAddress: '90 Albert Road, Woodstock',
    pickupDate: 'Tue, July 28',
    pickupTime: '12:00 PM',
    driver: 'Sipho Nkosi',
    driverPhone: '083 214 5567',
    status: 'In Progress',
    placedAt: 'Mon, Jul 26 · 7:15 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 2, price: 55 },
      { name: 'Blanket (Double)', quantity: 1, price: 55 },
    ],
    deliveryFee: 45,
    paymentMethod: 'EFT',
    instructions: '',
  },
  {
    id: '#SUD-9025',
    customerName: 'Sarah Lee',
    customerPhone: '+27 79 221 8740',
    pickupAddress: '17 Kloof Street, Gardens',
    deliveryAddress: '17 Kloof Street, Gardens',
    pickupDate: 'Tue, July 28',
    pickupTime: '01:30 PM',
    driver: 'Amina Jaffer',
    driverPhone: '072 887 3419',
    status: 'Completed',
    placedAt: 'Sun, Jul 25 · 11:02 AM',
    items: [
      { name: 'Ironing Only (per item)', quantity: 3, price: 15 },
    ],
    deliveryFee: 45,
    paymentMethod: 'Card',
    instructions: '',
  },
  {
    id: '#SUD-9026',
    customerName: 'Naledi Nkosi',
    customerPhone: '+27 61 882 6301',
    pickupAddress: '24 Long Street, Cape Town',
    deliveryAddress: '24 Long Street, Cape Town',
    pickupDate: 'Wed, July 29',
    pickupTime: '08:30 AM',
    driver: 'Thabo Dube',
    driverPhone: '081 556 9012',
    status: 'Completed',
    placedAt: 'Sun, Jul 25 · 2:30 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 3, price: 55 },
      { name: 'Comforter (Queen)', quantity: 1, price: 85 },
    ],
    deliveryFee: 45,
    paymentMethod: 'EFT',
    instructions: 'Use the service entrance.',
  },
  {
    id: '#SUD-9027',
    customerName: 'John Adams',
    customerPhone: '+27 82 990 1122',
    pickupAddress: '62 Victoria Road, Woodstock',
    deliveryAddress: '62 Victoria Road, Woodstock',
    pickupDate: 'Wed, July 29',
    pickupTime: '09:15 AM',
    driver: 'David Mthembu',
    driverPhone: '079 412 6678',
    status: 'Pending',
    placedAt: 'Mon, Jul 26 · 8:24 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 3, price: 55 },
    ],
    deliveryFee: 45,
    paymentMethod: 'Card',
    instructions: '',
  },
  {
    id: '#SUD-9028',
    customerName: 'Fatima Daniels',
    customerPhone: '+27 83 445 7789',
    pickupAddress: '18 Lower Main Road, Observatory',
    deliveryAddress: '18 Lower Main Road, Observatory',
    pickupDate: 'Wed, July 29',
    pickupTime: '10:00 AM',
    driver: 'Sipho Nkosi',
    driverPhone: '083 214 5567',
    status: 'In Progress',
    placedAt: 'Mon, Jul 26 · 9:11 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 4, price: 55 },
      { name: 'Ironing Only (per item)', quantity: 1, price: 15 },
      { name: 'Wash & Iron (per kg)', quantity: 1, price: 85 },
    ],
    deliveryFee: 45,
    paymentMethod: 'Cash',
    instructions: 'Hypoallergenic detergent only.',
  },
  {
    id: '#SUD-9029',
    customerName: 'Jason Williams',
    customerPhone: '+27 76 334 5567',
    pickupAddress: '30 Beach Road, Sea Point',
    deliveryAddress: '30 Beach Road, Sea Point',
    pickupDate: 'Wed, July 29',
    pickupTime: '11:30 AM',
    driver: 'Amina Jaffer',
    driverPhone: '072 887 3419',
    status: 'Completed',
    placedAt: 'Sat, Jul 24 · 5:44 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 5, price: 55 },
      { name: 'Blanket (Double)', quantity: 1, price: 55 },
    ],
    deliveryFee: 45,
    paymentMethod: 'Card',
    instructions: '',
  },
  {
    id: '#SUD-9030',
    customerName: 'Lerato Molefe',
    customerPhone: '+27 62 118 3344',
    pickupAddress: '15 Roodebloem Road, Woodstock',
    deliveryAddress: '15 Roodebloem Road, Woodstock',
    pickupDate: 'Thu, July 30',
    pickupTime: '08:00 AM',
    driver: 'Thabo Dube',
    driverPhone: '081 556 9012',
    status: 'Completed',
    placedAt: 'Fri, Jul 24 · 7:00 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 2, price: 55 },
      { name: 'Comforter (Queen)', quantity: 1, price: 85 },
    ],
    deliveryFee: 45,
    paymentMethod: 'EFT',
    instructions: '',
  },
  {
    id: '#SUD-9031',
    customerName: 'Michael Jacobs',
    customerPhone: '+27 84 762 9901',
    pickupAddress: '54 Voortrekker Road, Maitland',
    deliveryAddress: '54 Voortrekker Road, Maitland',
    pickupDate: 'Thu, July 30',
    pickupTime: '09:45 AM',
    driver: 'David Mthembu',
    driverPhone: '079 412 6678',
    status: 'Pending',
    placedAt: 'Tue, Jul 27 · 8:36 AM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 3, price: 55 },
      { name: 'Ironing Only (per item)', quantity: 1, price: 15 },
    ],
    deliveryFee: 45,
    paymentMethod: 'Card',
    instructions: 'Knock loudly at the front door.',
  },
  {
    id: '#SUD-9032',
    customerName: 'Zainab Khan',
    customerPhone: '+27 71 558 2203',
    pickupAddress: '11 Durham Avenue, Woodstock',
    deliveryAddress: '11 Durham Avenue, Woodstock',
    pickupDate: 'Thu, July 30',
    pickupTime: '11:00 AM',
    driver: 'Sipho Nkosi',
    driverPhone: '083 214 5567',
    status: 'Pending',
    placedAt: 'Tue, Jul 27 · 9:48 AM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 4, price: 55 },
    ],
    deliveryFee: 45,
    paymentMethod: 'Cash',
    instructions: '',
  },
  {
    id: '#SUD-9033',
    customerName: 'Emma Brown',
    customerPhone: '+27 82 117 4455',
    pickupAddress: '92 Main Road, Maitland',
    deliveryAddress: '92 Main Road, Maitland',
    pickupDate: 'Thu, July 30',
    pickupTime: '12:30 PM',
    driver: 'Amina Jaffer',
    driverPhone: '072 887 3419',
    status: 'In Progress',
    placedAt: 'Tue, Jul 27 · 10:15 AM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 5, price: 55 },
      { name: 'Wash & Iron (per kg)', quantity: 1, price: 85 },
    ],
    deliveryFee: 45,
    paymentMethod: 'Card',
    instructions: 'Fragrance-free detergent.',
  },
  {
    id: '#SUD-9034',
    customerName: 'Tariq Abrahams',
    customerPhone: '+27 79 664 1188',
    pickupAddress: '25 Church Street, Woodstock',
    deliveryAddress: '25 Church Street, Woodstock',
    pickupDate: 'Fri, July 31',
    pickupTime: '09:00 AM',
    driver: 'Thabo Dube',
    driverPhone: '081 556 9012',
    status: 'Completed',
    placedAt: 'Wed, Jul 28 · 6:22 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 2, price: 55 },
      { name: 'Ironing Only (per item)', quantity: 1, price: 15 },
    ],
    deliveryFee: 45,
    paymentMethod: 'EFT',
    instructions: '',
  },
  {
    id: '#SUD-9035',
    customerName: 'Jessica Moore',
    customerPhone: '+27 83 902 7744',
    pickupAddress: '101 St Marks Road, Observatory',
    deliveryAddress: '101 St Marks Road, Observatory',
    pickupDate: 'Fri, July 31',
    pickupTime: '10:15 AM',
    driver: 'David Mthembu',
    driverPhone: '079 412 6678',
    status: 'In Progress',
    placedAt: 'Wed, Jul 28 · 7:05 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 3, price: 55 },
      { name: 'Blanket (Double)', quantity: 1, price: 55 },
    ],
    deliveryFee: 45,
    paymentMethod: 'Card',
    instructions: '',
  },
];

const seedCustomers: AdminCustomer[] = [
  {
    id: 'c1',
    initials: 'SJ',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    phone: '+27 82 123 4567',
    totalOrders: 12,
    joinedDate: 'Joined Jul 2026',
    badgeColor: '#E8F2FF',
    initialsColor: '#3678E5',
  },
  {
    id: 'c2',
    initials: 'DM',
    name: 'David Mokoena',
    email: 'david.mokoena@gmail.com',
    phone: '+27 73 987 6543',
    totalOrders: 8,
    joinedDate: 'Joined Jun 2026',
    badgeColor: '#FFF1D6',
    initialsColor: '#E89A12',
  },
  {
    id: 'c3',
    initials: 'TC',
    name: 'Thabo Cele',
    email: 'thabo.cele@gmail.com',
    phone: '+27 81 555 0192',
    totalOrders: 15,
    joinedDate: 'Joined Mar 2026',
    badgeColor: '#E7F8EE',
    initialsColor: '#21A86A',
  },
  {
    id: 'c4',
    initials: 'NN',
    name: 'Naledi Ndlovu',
    email: 'naledi.ndlovu@gmail.com',
    phone: '+27 64 333 4455',
    totalOrders: 4,
    joinedDate: 'Joined Aug 2026',
    badgeColor: '#F0E9FF',
    initialsColor: '#7958D5',
  },
  {
    id: 'c5',
    initials: 'FA',
    name: 'Fatima Adams',
    email: 'fatima.adams@gmail.com',
    phone: '+27 72 448 1105',
    totalOrders: 10,
    joinedDate: 'Joined Feb 2026',
    badgeColor: '#FFE8EF',
    initialsColor: '#D95B82',
  },
  {
    id: 'c6',
    initials: 'JW',
    name: 'Jason Williams',
    email: 'jason.williams@gmail.com',
    phone: '+27 79 221 8740',
    totalOrders: 6,
    joinedDate: 'Joined Sep 2026',
    badgeColor: '#E9F7F8',
    initialsColor: '#228A92',
  },
  {
    id: 'c7',
    initials: 'LK',
    name: 'Lerato Khumalo',
    email: 'lerato.khumalo@gmail.com',
    phone: '+27 61 882 6301',
    totalOrders: 9,
    joinedDate: 'Joined May 2026',
    badgeColor: '#FFF4E5',
    initialsColor: '#D78624',
  },
];

const seedDrivers: AdminDriver[] = [
  {
    id: 'd1',
    initials: 'SN',
    name: 'Sipho Nkosi',
    phone: '083 214 5567',
    vehicle: 'White VW Caddy',
    registration: 'CA 482-113',
    area: 'Woodstock',
    totalTrips: 342,
    joinedDate: 'Joined Feb 2026',
    badgeColor: '#E8F2FF',
    initialsColor: '#3678E5',
  },
  {
    id: 'd2',
    initials: 'TD',
    name: 'Thabo Dube',
    phone: '081 556 9012',
    vehicle: 'Silver Toyota Corolla',
    registration: 'CA 391-887',
    area: 'Maitland',
    totalTrips: 289,
    joinedDate: 'Joined Apr 2026',
    badgeColor: '#F0E9FF',
    initialsColor: '#7958D5',
  },
  {
    id: 'd3',
    initials: 'AJ',
    name: 'Amina Jaffer',
    phone: '072 887 3419',
    vehicle: 'Blue Ford Fiesta',
    registration: 'CA 218-554',
    area: 'Woodstock',
    totalTrips: 176,
    joinedDate: 'Joined Jun 2026',
    badgeColor: '#E7F8EE',
    initialsColor: '#21A86A',
  },
  {
    id: 'd4',
    initials: 'DM',
    name: 'David Mthembu',
    phone: '079 412 6678',
    vehicle: 'Grey Nissan Bakkie',
    registration: 'CA 467-220',
    area: 'Observatory',
    totalTrips: 221,
    joinedDate: 'Joined Mar 2026',
    badgeColor: '#FFF1D6',
    initialsColor: '#E89A12',
  },
  {
    id: 'd5',
    initials: 'LM',
    name: 'Lerato Mahlangu',
    phone: '082 445 8899',
    vehicle: 'White Toyota Bakkie',
    registration: 'CA 533-091',
    area: 'Maitland',
    totalTrips: 134,
    joinedDate: 'Joined Aug 2026',
    badgeColor: '#E9F7F8',
    initialsColor: '#228A92',
  },
  {
    id: 'd6',
    initials: 'ZN',
    name: 'Zanele Ndlovu',
    phone: '078 331 5520',
    vehicle: 'Red Hyundai i20',
    registration: 'CA 176-338',
    area: 'Observatory',
    totalTrips: 98,
    joinedDate: 'Joined Oct 2026',
    badgeColor: '#FFE8EF',
    initialsColor: '#D95B82',
  },
];

const DEFAULT_PRICING: Pricing = {
  smallLoad: { price: 55, enabled: true },
  mediumLoad: { price: 45, enabled: true },
  largeLoad: { price: 35, enabled: true },
  bag: { price: 120, enabled: true },
  delivery: { price: 60, enabled: true },
  express: { price: 95, enabled: false },
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<AdminOrder[]>(seedOrders);
  const [customers, setCustomers] = useState<AdminCustomer[]>(seedCustomers);
  const [drivers, setDrivers] = useState<AdminDriver[]>(seedDrivers);
  const [pricing, setPricing] = useState<Pricing>(DEFAULT_PRICING);

  const addOrder = useCallback((order: AdminOrder) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback(
    (id: string, status: AdminOrderStatus) => {
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order))
      );
    },
    []
  );

  const addCustomer = useCallback((customer: AdminCustomer) => {
    setCustomers((prev) => [customer, ...prev]);
  }, []);

  const updateCustomer = useCallback(
    (id: string, patch: Partial<AdminCustomer>) => {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === id ? { ...customer, ...patch } : customer
        )
      );
    },
    []
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
        prev.map((driver) => (driver.id === id ? { ...driver, ...patch } : driver))
      );
    },
    []
  );

  const deleteDriver = useCallback((id: string) => {
    setDrivers((prev) => prev.filter((driver) => driver.id !== id));
  }, []);

  const updatePricing = useCallback((patch: Partial<Pricing>) => {
    setPricing((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      orders,
      customers,
      drivers,
      pricing,
      addOrder,
      updateOrderStatus,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addDriver,
      updateDriver,
      deleteDriver,
      updatePricing,
    }),
    [
      orders,
      customers,
      drivers,
      pricing,
      addOrder,
      updateOrderStatus,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addDriver,
      updateDriver,
      deleteDriver,
      updatePricing,
    ]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
