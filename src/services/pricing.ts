export const DELIVERY_FEE = 60;
export const RATE_PER_KM = 10;

export function calculateDistanceFee(distanceKm: number): number {
  return Math.round(distanceKm * RATE_PER_KM);
}

export function calculateTotal(distanceKm: number): number {
  return DELIVERY_FEE + calculateDistanceFee(distanceKm);
}

export function getPriceBreakdown(distanceKm: number) {
  const distanceFee = calculateDistanceFee(distanceKm);
  const total = DELIVERY_FEE + distanceFee;
  return {
    deliveryFee: DELIVERY_FEE,
    ratePerKm: RATE_PER_KM,
    distanceKm: Math.round(distanceKm * 10) / 10,
    distanceFee,
    total,
  };
}
