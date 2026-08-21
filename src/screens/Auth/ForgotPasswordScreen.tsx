import React, { useState } from 'react';
import {
  Alert,
  Platform,
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
import { ROLE_LABELS } from '../../types';
import { isEmail, isRequired } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Forgot'>;

const isWeb = Platform.OS === 'web';

export default function ForgotPasswordScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const nextError = isRequired(email)
      ? isEmail(email)
        ? ''
        : 'Enter a valid email address.'
      : 'Email is required.';
    setEmailError(nextError);
    if (nextError) return;

    setLoading(true);
    try {
      await AuthServices.forgotPassword(email);
      Alert.alert(
        'Reset link sent',
        `We sent a password reset link to ${email.trim()}.`,
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('Reset', {
                email: email.trim(),
                role,
              }),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Request failed',
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

        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>
          No worries. Enter your email and we will send you a link to reset
          your {ROLE_LABELS[role].toLowerCase()} password.
        </Text>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={emailError}
          />

          <Button
            title="Send reset link"
            onPress={handleSend}
            loading={loading}
            style={styles.sendButton}
          />
        </View>

        <View style={styles.hintRow}>
          <Text style={styles.hintText}>Remembered it? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.hintLink}>Back to log in</Text>
          </TouchableOpacity>
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
    ...(isWeb ? {
      maxWidth: 480,
      alignSelf: 'center',
      width: '100%',
    } : {}),
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
  sendButton: {
    marginTop: 6,
  },
  hintRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 26,
  },
  hintText: {
    ...typography.body,
    color: colors.textMuted,
  },
  hintLink: {
    ...typography.body,
    fontWeight: '700',
    color: colors.accent,
  },
});
