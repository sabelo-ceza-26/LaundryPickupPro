import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomerTabs from './CustomerTabs';

export type CustomerStackParamList = {
  Main: undefined;
};

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export default function CustomerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={CustomerTabs} />
    </Stack.Navigator>
  );
}
