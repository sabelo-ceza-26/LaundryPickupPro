import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DriverHomeScreen from '../screens/Driver/DriverHomeScreen';
import PickupDetailsScreen from '../screens/Driver/PickupDetailsScreen';
import DeliveryDetailsScreen from '../screens/Driver/DeliveryDetailsScreen';

export type DriverStackParamList = {
  Home: undefined;

  OrderDetails: {
    order: {
      id: number;
      orderNumber: string;
      type: string;
      customer: string;
      address: string;
      time: string;
      receiver?: string;
      receiverAddress?: string;
      phone?: string;
      laundromat?: string;
      laundromatAddress?: string;
      notes?: string;
    };
  };

  DeliveryDetails: {
    order: {
      id: number;
      orderNumber: string;
      type: string;
      customer: string;
      address: string;
      time: string;
      receiver?: string;
      receiverAddress?: string;
      phone?: string;
      laundromat?: string;
      laundromatAddress?: string;
      notes?: string;
    };
  };
};

const Stack = createNativeStackNavigator<DriverStackParamList>();

export default function DriverNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={DriverHomeScreen}
      />

      <Stack.Screen
        name="OrderDetails"
        component={PickupDetailsScreen}
      />

      <Stack.Screen
        name="DeliveryDetails"
        component={DeliveryDetailsScreen}
      />
    </Stack.Navigator>
  );
}