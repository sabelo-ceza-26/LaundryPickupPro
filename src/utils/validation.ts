export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isMinLength(value: string, min: number): boolean {
  return value.length >= min;
}

export function matches(value: string, other: string): boolean {
  return value === other;
}

export function isPhone(value: string): boolean {
  return /^[+]?[\d\s-]{7,15}$/.test(value.trim());
}
