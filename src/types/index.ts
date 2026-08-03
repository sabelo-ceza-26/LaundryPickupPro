export type Role = 'customer' | 'driver' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
};

export const ROLE_LABELS: Record<Role, string> = {
  customer: 'Customer',
  driver: 'Driver',
  admin: 'Administrator',
};
