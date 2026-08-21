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

export type OrderPickupType = 'home' | 'laundromat';

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
  pickupType?: OrderPickupType;
  driver?: string;
  driverPhone?: string;
  items: OrderItem[];
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  instructions: string;
  laundromat?: string;
  laundromatAddress?: string;
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
