import type { Role, User } from '../types';

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

type LoginInput = {
  role: Role;
  email: string;
  password: string;
};

type RegisterInput = {
  role: Role;
  name: string;
  email: string;
  phone: string;
  password: string;
};

const displayName = (email: string) => {
  const base = email.trim().split('@')[0] || 'User';
  const capitalized = base
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  return capitalized || 'User';
};

export async function login({
  role,
  email,
  password,
}: LoginInput): Promise<User> {
  await delay(1200);
  if (!email.trim() || !password.trim()) {
    throw new Error('Please enter your email and password.');
  }
  return {
    id: `${role}-1`,
    name: displayName(email),
    email: email.trim(),
    role,
  };
}

export async function register({
  role,
  name,
  email,
  phone,
  password,
}: RegisterInput): Promise<User> {
  await delay(1500);
  if (!name.trim() || !email.trim() || !password.trim()) {
    throw new Error('Please fill in all required fields.');
  }
  return {
    id: `${role}-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    role,
  };
}

export async function forgotPassword(email: string): Promise<void> {
  await delay(1200);
  if (!email.trim()) {
    throw new Error('Please enter your email address.');
  }
}

export async function resetPassword(
  password: string,
  confirmPassword: string
): Promise<void> {
  await delay(1200);
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match.');
  }
}
