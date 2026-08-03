import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DriverHomeScreen from '../screens/Driver/DriverHomeScreen';

export type DriverStackParamList = {
  Home: undefined;
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
      <Stack.Screen name="Home" component={DriverHomeScreen} />
    </Stack.Navigator>
  );
}
