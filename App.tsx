import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AdminNavigator from './src/navigation/AdminNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AdminNavigator />
    </NavigationContainer>
  );
}