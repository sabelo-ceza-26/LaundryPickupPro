import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from '../screens/Auth/AuthScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import RoleSelectionScreen from '../screens/Auth/RoleSelectionScreen';
import SplashScreen from '../screens/Auth/SplashScreen';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../types';

export type AuthStackParamList = {
  Splash: undefined;
  Role: undefined;
  Auth: { role: Role; mode?: 'login' | 'register' };
  Forgot: { role: Role };
  Reset: { email: string; role: Role };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  const { hasSignedInBefore, lastRole } = useAuth();
  const role = lastRole ?? 'customer';

  return (
    <Stack.Navigator
      initialRouteName={hasSignedInBefore ? 'Auth' : 'Splash'}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Role" component={RoleSelectionScreen} />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        initialParams={{ role, mode: 'login' }}
      />
      <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
      <Stack.Screen name="Reset" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
