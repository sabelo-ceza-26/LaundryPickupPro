import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomerTabs from './CustomerTabs';
import NotificationsScreen from '../screens/Customer/NotificationsScreens';
import OrderDetailsScreen from '../screens/Customer/OrderDetailsScreen';
import AdressesScreen from '../screens/Customer/AdressesScreen';
import SettingsScreen from '../screens/Customer/SettingsScreen';
import SupportScreen from '../screens/Customer/SupportScreen';
import { OrdersProvider } from '../context/OrdersContext';
import type { CustomerStackParamList } from './types';

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export default function CustomerNavigator() {
  return (
    <OrdersProvider>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={CustomerTabs} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="Addresses" component={AdressesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
      </Stack.Navigator>
    </OrdersProvider>
  );
}
