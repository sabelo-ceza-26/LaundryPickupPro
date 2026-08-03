import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BookPickupScreen from '../screens/Customer/BookPickupScreen';
import ReviewBookingScreen from '../screens/Customer/ReviewBookingScreen';
import PaymentScreen from '../screens/Customer/PaymentScreen';
import BookingSuccessScreen from '../screens/Customer/BookingSuccessScreen';
import { BookingProvider } from '../context/BookingContext';

export type BookingStackParamList = {
  Step1: undefined;
  Step2: undefined;
  Step3: undefined;
  Success: undefined;
};

const Stack = createNativeStackNavigator<BookingStackParamList>();

function BookingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Step1"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Step1" component={BookPickupScreen} />
      <Stack.Screen name="Step2" component={ReviewBookingScreen} />
      <Stack.Screen name="Step3" component={PaymentScreen} />
      <Stack.Screen name="Success" component={BookingSuccessScreen} />
    </Stack.Navigator>
  );
}

export default function BookingTab() {
  return (
    <BookingProvider>
      <BookingNavigator />
    </BookingProvider>
  );
}
