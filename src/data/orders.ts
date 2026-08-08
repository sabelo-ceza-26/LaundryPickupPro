export const ORDER_STATUSES = [
  'Scheduled',
  'Picked Up',
  'At Laundromat',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type CustomerOrder = {
  id: string;
  reference: string;
  service: string;
  status: OrderStatus;
  placedAt: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryLat?: number;
  deliveryLng?: number;
  pickupWindow: string;
  deliveryWindow: string;
  driver?: string;
  driverPhone?: string;
  items: OrderItem[];
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  instructions: string;
};

export const ORDER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'Scheduled', label: 'Scheduled' },
  { key: 'Picked Up', label: 'Picked Up' },
  { key: 'At Laundromat', label: 'At Laundromat' },
  { key: 'Out for Delivery', label: 'Out for Delivery' },
  { key: 'Delivered', label: 'Delivered' },
];

export function orderStepIndex(status: OrderStatus): number {
  return ORDER_STEPS.findIndex((step) => step.key === status);
}

export function isOrderActive(status: OrderStatus): boolean {
  return status !== 'Delivered' && status !== 'Cancelled';
}

export function isOrderCancellable(status: OrderStatus): boolean {
  return status === 'Scheduled';
}

export const seedOrders: CustomerOrder[] = [
  {
    id: 'ord-1',
    reference: 'LPP-728104',
    service: 'Pickup & Drop Off',
    status: 'Out for Delivery',
    placedAt: 'Wed, Aug 5 · 9:41 AM',
    pickupAddress: '172 Sir Lowry Rd, Woodstock',
    deliveryAddress: '123 Main Road, Cape Town',
    deliveryLat: -33.9359,
    deliveryLng: 18.4632,
    pickupWindow: 'Wed, Aug 5 · 9:00 AM – 11:00 AM',
    deliveryWindow: 'Wed, Aug 5 · 1:00 PM – 3:00 PM',
    driver: 'Sipho Ndlovu',
    driverPhone: '083 456 7890',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 2, price: 55 },
      { name: 'Ironing Only (per item)', quantity: 1, price: 15 },
    ],
    deliveryFee: 45,
    total: 170,
    paymentMethod: 'Card',
    instructions: 'Leave laundry bags on the front porch if not answered.',
  },
  {
    id: 'ord-2',
    reference: 'LPP-714629',
    service: 'Pickup & Drop Off',
    status: 'Delivered',
    placedAt: 'Tue, Aug 4 · 2:15 PM',
    pickupAddress: '45 Albert Road, Woodstock',
    deliveryAddress: '45 Albert Road, Woodstock',
    deliveryLat: -33.9268,
    deliveryLng: 18.449,
    pickupWindow: 'Tue, Aug 4 · 2:00 PM – 4:00 PM',
    deliveryWindow: 'Wed, Aug 5 · 4:00 PM – 6:00 PM',
    driver: 'Sipho Ndlovu',
    driverPhone: '083 456 7890',
    items: [
      { name: 'Blanket (Double)', quantity: 1, price: 55 },
      { name: 'Wash & Fold (per kg)', quantity: 1, price: 55 },
    ],
    deliveryFee: 45,
    total: 155,
    paymentMethod: 'EFT',
    instructions: 'Call before arrival.',
  },
  {
    id: 'ord-3',
    reference: 'LPP-690342',
    service: 'Pickup & Drop Off',
    status: 'Cancelled',
    placedAt: 'Wed, Aug 5 · 8:20 AM',
    pickupAddress: '10 St Marks, Observatory',
    deliveryAddress: '10 St Marks, Observatory',
    deliveryLat: -33.9405,
    deliveryLng: 18.4595,
    pickupWindow: 'Thu, Aug 6 · 8:00 AM – 10:00 AM',
    deliveryWindow: 'Thu, Aug 6 · 3:00 PM – 5:00 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 1, price: 55 },
    ],
    deliveryFee: 45,
    total: 100,
    paymentMethod: 'Cash',
    instructions: 'Customer prefers contactless pickup.',
  },
  {
    id: 'ord-4',
    reference: 'LPP-671925',
    service: 'Pickup & Drop Off',
    status: 'Delivered',
    placedAt: 'Fri, Jul 31 · 10:05 AM',
    pickupAddress: '172 Sir Lowry Rd, Woodstock',
    deliveryAddress: '123 Main Road, Cape Town',
    deliveryLat: -33.9359,
    deliveryLng: 18.4632,
    pickupWindow: 'Fri, Jul 31 · 9:00 AM – 11:00 AM',
    deliveryWindow: 'Fri, Jul 31 · 2:00 PM – 4:00 PM',
    driver: 'Lerato Mokoena',
    driverPhone: '084 210 3344',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 3, price: 55 },
      { name: 'Wash & Iron (per kg)', quantity: 2, price: 85 },
    ],
    deliveryFee: 45,
    total: 380,
    paymentMethod: 'Card',
    instructions: 'Leave with security at the gate.',
  },
  {
    id: 'ord-5',
    reference: 'LPP-640511',
    service: 'Pickup & Drop Off',
    status: 'Cancelled',
    placedAt: 'Mon, Jul 27 · 5:48 PM',
    pickupAddress: '88 Buitenkant Street, Cape Town',
    deliveryAddress: '88 Buitenkant Street, Cape Town',
    deliveryLat: -33.9213,
    deliveryLng: 18.4242,
    pickupWindow: 'Tue, Jul 28 · 10:00 AM – 12:00 PM',
    deliveryWindow: 'Tue, Jul 28 · 4:00 PM – 6:00 PM',
    items: [
      { name: 'Wash & Fold (per kg)', quantity: 2, price: 55 },
    ],
    deliveryFee: 45,
    total: 155,
    paymentMethod: 'EFT',
    instructions: '',
  },
  {
    id: 'ord-6',
    reference: 'LPP-608843',
    service: 'Pickup & Drop Off',
    status: 'Delivered',
    placedAt: 'Mon, Jul 20 · 1:30 PM',
    pickupAddress: '172 Sir Lowry Rd, Woodstock',
    deliveryAddress: '123 Main Road, Cape Town',
    deliveryLat: -33.9359,
    deliveryLng: 18.4632,
    pickupWindow: 'Mon, Jul 20 · 1:00 PM – 3:00 PM',
    deliveryWindow: 'Tue, Jul 21 · 9:00 AM – 11:00 AM',
    driver: 'Lerato Mokoena',
    driverPhone: '084 210 3344',
    items: [
      { name: 'Comforter (Queen)', quantity: 1, price: 85 },
      { name: 'Wash & Fold (per kg)', quantity: 1, price: 55 },
    ],
    deliveryFee: 45,
    total: 185,
    paymentMethod: 'Card',
    instructions: '',
  },
];
