import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { colors } from './src/theme/colors';

function AppContent() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default function App() {
  if (Platform.OS === 'web') {
    return (
      <SafeAreaProvider>
        <View style={styles.webStage}>
          <View style={styles.webFrame}>
            <AppContent />
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webStage: {
    flex: 1,
    width: '100%',
    backgroundColor: '#DFE5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    maxHeight: 900,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'rgba(15, 54, 63, 0.08)',
    shadowColor: '#0F363F',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 12,
  },
});
