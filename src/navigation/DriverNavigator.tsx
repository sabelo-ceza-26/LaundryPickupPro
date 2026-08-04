import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import DriverHomeScreen from '../screens/Driver/DriverHomeScreen';
import OrderScreen from '../screens/Driver/OrderScreen';
import PickupDetailsScreen from '../screens/Driver/PickupDetailsScreen';
import DeliveryDetailsScreen from '../screens/Driver/DeliveryDetailsScreen';
import ChatScreen from '../screens/Driver/ChatScreen';
import ProfileScreen from '../screens/Driver/ProfileScreen';
import NotificationScreen from '../screens/Driver/NotificationScreen';

export type Order = {
  id: number;
  orderNumber: string;
  type: string;
  customer: string;
  address: string;
  time: string;
  status?: string;
  phone?: string;
  laundromat?: string;
  laundromatAddress?: string;
  notes?: string;
};

export type DriverTabParamList = {
  Home: undefined;
  Orders: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type DriverStackParamList = {
  DriverTabs: NavigatorScreenParams<DriverTabParamList> | undefined;

  Home: undefined;
  Orders: undefined;
  Chat: undefined;
  Profile: undefined;

  Notifications: undefined;

  OrderDetails: {
    order: Order;
  };

  DeliveryDetails: {
    order: Order;
  };
};

const Stack = createNativeStackNavigator<DriverStackParamList>();
const Tab = createBottomTabNavigator<DriverTabParamList>();

const tabIcons: Record<
  keyof DriverTabParamList,
  {
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap;
  }
> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Orders: { active: 'clipboard', inactive: 'clipboard-outline' },
  Chat: { active: 'chatbubble', inactive: 'chatbubble-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

function DriverTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#173D8F',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: styles.tabBar,
        tabBarLabel: () => null,
        tabBarIcon: ({ focused, color }) => {
          const icons = tabIcons[route.name];
          return (
            <View style={styles.tabItem}>
              <Text style={[styles.tabLabel, { color }]}>
                {route.name}
              </Text>
              <Ionicons
                name={focused ? icons.active : icons.inactive}
                size={22}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={DriverHomeScreen}
      />
      <Tab.Screen
        name="Orders"
        component={OrderScreen}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

export default function DriverNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="DriverTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="DriverTabs"
        component={DriverTabs}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    height: 78,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
});
