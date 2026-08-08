import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type Booking = {
  pickupAddress: string;
  deliveryAddress: string;
  pickupDate: Date;
  pickupTime: Date;
  deliveryDate: Date;
  deliveryTime: Date;
  instructions: string;
  paymentMethod: 'Card' | 'EFT' | 'Cash';
  total: number;
};

type BookingContextValue = {
  booking: Booking;
  updateBooking: (patch: Partial<Booking>) => void;
  resetBooking: () => void;
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
  pickupAddress: '',
  deliveryAddress: '',
  pickupDate: new Date(),
  pickupTime: at(9),
  deliveryDate: tomorrow(),
  deliveryTime: at(14),
  instructions: '',
  paymentMethod: 'Card',
  total: 124.5,
};

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<Booking>(defaultBooking);

  const updateBooking = useCallback((patch: Partial<Booking>) => {
    setBooking((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(defaultBooking);
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({ booking, updateBooking, resetBooking }),
    [booking, updateBooking, resetBooking]
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
