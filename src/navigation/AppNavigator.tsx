import React from 'react';

import { useAuth } from '../hooks/useAuth';
import AdminNavigator from './AdminNavigator';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import DriverNavigator from './DriverNavigator';

export default function AppNavigator() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (role === 'admin') {
    return <AdminNavigator />;
  }

  if (role === 'driver') {
    return <DriverNavigator />;
  }

  return <CustomerNavigator />;
}
