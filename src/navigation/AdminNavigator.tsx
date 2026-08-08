import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminLoginScreen from '../screens/Admin/AdminLoginScreen';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import OrdersScreen from '../screens/Admin/OrdersScreen';
import UsersScreen from '../screens/Admin/UsersScreens';
import DriversScreen from '../screens/Admin/DriversScreens';
import ReportsScreen from '../screens/Admin/ReportsScreen';
import PaymentScreen from '../screens/Admin/PaymentScreen';
import SettingsScreen from '../screens/Admin/SettingsScreen';
import { AdminProvider } from '../context/AdminContext';

export type AdminStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Orders: undefined;
  Users: undefined;
  Drivers: undefined;
  Reports: undefined;
  Payments: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export default function AdminNavigator() {
  return (
    <AdminProvider>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={AdminLoginScreen} />
        <Stack.Screen name="Dashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="Drivers" component={DriversScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="Payments" component={PaymentScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </AdminProvider>
  );
}