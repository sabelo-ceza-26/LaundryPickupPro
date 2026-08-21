import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { calculateTotal } from '../services/pricing';
import { findClosestLaundromat } from '../services/distanceService';
import type { Laundromat } from '../constrants/services';
import { LAUNDROMATS } from '../services/laundromatService';

export type PickupType = 'home' | 'laundromat';

export type Booking = {
  pickupType: PickupType;
  pickupAddress: string;
  deliveryAddress: string;
  selectedLaundromatId: string | null;
  assignedLaundromat: Laundromat | null;
  pickupDate: Date;
  pickupTime: Date;
  deliveryDate: Date;
  deliveryTime: Date;
  instructions: string;
  paymentMethod: 'Card' | 'EFT' | 'Cash';
  bagCount: number;
  distanceKm: number;
  deliveryFee: number;
  distanceFee: number;
  total: number;
};

type BookingContextValue = {
  booking: Booking;
  updateBooking: (patch: Partial<Booking>) => void;
  resetBooking: () => void;
  laundromats: Laundromat[];
};

const at = (hour: number) => {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d;
};

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
};

const defaultBooking: Booking = {
  pickupType: 'home',
  pickupAddress: '',
  deliveryAddress: '',
  selectedLaundromatId: null,
  assignedLaundromat: null,
  pickupDate: new Date(),
  pickupTime: at(9),
  deliveryDate: tomorrow(),
  deliveryTime: at(14),
  instructions: '',
  paymentMethod: 'Card',
  bagCount: 1,
  distanceKm: 0,
  deliveryFee: 60,
  distanceFee: 0,
  total: 60,
};

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<Booking>(defaultBooking);
  const laundromats = LAUNDROMATS;

  const updateBooking = useCallback((patch: Partial<Booking>) => {
    setBooking((prev) => {
      const next = { ...prev, ...patch };

      if (patch.distanceKm !== undefined) {
        const breakdown = calculateTotal(patch.distanceKm);
        next.distanceFee = breakdown - 60;
        next.deliveryFee = 60;
        next.total = breakdown;
      }

      if (patch.pickupType !== undefined) {
        if (patch.pickupType === 'home') {
          next.selectedLaundromatId = null;
          if (next.pickupAddress.trim()) {
            const closest = findClosestLaundromat(next.pickupAddress, laundromats);
            if (closest) {
              next.assignedLaundromat = closest;
              next.deliveryAddress = closest.address;
            }
          }
        } else {
          next.assignedLaundromat = null;
          next.pickupAddress = '';
          next.deliveryAddress = '';
        }
      }

      if (patch.selectedLaundromatId !== undefined && patch.selectedLaundromatId !== null) {
        const found = laundromats.find((l) => l.id === patch.selectedLaundromatId);
        next.assignedLaundromat = found ?? null;
        next.pickupAddress = found?.address ?? '';
      }

      if (patch.pickupAddress !== undefined && next.pickupType === 'home') {
        const closest = findClosestLaundromat(patch.pickupAddress, laundromats);
        if (closest) {
          next.assignedLaundromat = closest;
          next.deliveryAddress = closest.address;
        }
      }

      return next;
    });
  }, [laundromats]);

  const resetBooking = useCallback(() => {
    setBooking(defaultBooking);
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({ booking, updateBooking, resetBooking, laundromats }),
    [booking, updateBooking, resetBooking, laundromats]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
