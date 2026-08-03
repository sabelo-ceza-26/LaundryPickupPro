import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function DriverHomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.name ?? 'D').charAt(0)}
          </Text>
        </View>
        <Text style={styles.title}>Hello, {user?.name ?? 'Driver'}</Text>
        <Text style={styles.subtitle}>
          Your driver dashboard is coming soon.
        </Text>
        <Button title="Log out" variant="outline" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarText: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '700',
  },
  title: {
    ...typography.title,
    color: colors.textStrong,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
});
