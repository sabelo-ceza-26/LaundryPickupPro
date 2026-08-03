import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '../../components/Button';
import Input from '../../components/Input';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import * as AuthServices from '../../services/AuthServices';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { isMinLength, isRequired, matches } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Reset'>;

export default function ResetPasswordScreen({ navigation, route }: Props) {
  const { email, role } = route.params;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    let nextPasswordError = '';
    let nextConfirmError = '';

    if (!isRequired(password)) {
      nextPasswordError = 'Password is required.';
    } else if (!isMinLength(password, 8)) {
      nextPasswordError = 'Password must be at least 8 characters.';
    }

    if (!isRequired(confirm)) {
      nextConfirmError = 'Please confirm your password.';
    } else if (!matches(confirm, password)) {
      nextConfirmError = 'Passwords do not match.';
    }

    setPasswordError(nextPasswordError);
    setConfirmError(nextConfirmError);

    if (nextPasswordError || nextConfirmError) return;

    setLoading(true);
    try {
      await AuthServices.resetPassword(password, confirm);
      Alert.alert(
        'Password updated',
        'Your password has been reset. You can now log in with your new password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Auth', { role }),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Reset failed',
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Set a new password</Text>
        <Text style={styles.subtitle}>
          Create a strong new password for {email}.
        </Text>

        <View style={styles.form}>
          <Input
            label="New password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            secure
            error={passwordError}
          />

          <Input
            label="Confirm new password"
            placeholder="Re-enter your new password"
            value={confirm}
            onChangeText={setConfirm}
            secure
            error={confirmError}
          />

          <Button
            title="Update password"
            onPress={handleReset}
            loading={loading}
            style={styles.updateButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  backText: {
    fontSize: 30,
    lineHeight: 32,
    color: colors.textStrong,
    marginTop: -2,
  },
  title: {
    ...typography.hero,
    color: colors.textStrong,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textMuted,
    marginTop: 8,
    lineHeight: 22,
  },
  form: {
    marginTop: 28,
  },
  updateButton: {
    marginTop: 6,
  },
});
