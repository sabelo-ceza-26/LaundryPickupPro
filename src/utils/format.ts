export function formatBookingDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTimeWindow(date: Date): string {
  const end = new Date(date.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return `${fmt(date)} – ${fmt(end)}`;
}

export function formatMoney(amount: number): string {
  return `R${amount.toFixed(2)}`;
}
