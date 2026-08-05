import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CustomerHomeScreen from '../screens/Customer/CustomerHomeScreen';
import OrderHistoryScreen from '../screens/Customer/OrderHistoryScreen';
import TrackOrderScreen from '../screens/Customer/TrackOrderScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';
import BookingTab from './BookingNavigator';
import type { CustomerTabParamList } from './types';

export type { CustomerTabParamList };

const Tab = createBottomTabNavigator<CustomerTabParamList>();

type TabIconProps = {
  color: string;
  size: number;
};

const iconMap: Record<string, { active: keyof typeof MaterialCommunityIcons.glyphMap; inactive: keyof typeof MaterialCommunityIcons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Orders: { active: 'receipt-text', inactive: 'receipt-text-outline' },
  Book: { active: 'calendar-plus', inactive: 'calendar-plus' },
  Track: { active: 'map-marker', inactive: 'map-marker-outline' },
  Profile: { active: 'account', inactive: 'account-outline' },
};

const renderIcon = (routeName: string) => ({ color, size }: TabIconProps) => {
  const icons = iconMap[routeName] ?? { active: 'dots-horizontal', inactive: 'dots-horizontal' };
  return (
    <MaterialCommunityIcons
      name={color === '#5F6F82' ? icons.active : icons.inactive}
      size={size}
      color={color}
    />
  );
};

export default function CustomerTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#5F6F82',
        tabBarInactiveTintColor: '#2B3642',
        tabBarIcon: renderIcon(route.name),
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        tabBarStyle: styles.bar,
      })}
    >
      <Tab.Screen name="Home" component={CustomerHomeScreen} />
      <Tab.Screen name="Orders" component={OrderHistoryScreen} />
      <Tab.Screen name="Book" component={BookingTab} />
      <Tab.Screen name="Track" component={TrackOrderScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8ECF1',
    paddingTop: 6,
    paddingBottom: 6,
    height: 66,
  },
  item: {
    paddingVertical: 2,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    marginTop: 1,
  },
});
