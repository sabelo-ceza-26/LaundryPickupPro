import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import BookingHeader from '../../components/BookingHeader';
import BookingProgress from '../../components/BookingProgress';
import { useBooking } from '../../context/BookingContext';
import type { BookingStackParamList } from '../../navigation/BookingNavigator';
import { colors } from '../../theme/colors';
import { formatMoney } from '../../utils/format';

type Props = NativeStackScreenProps<BookingStackParamList, 'Step3'>;

type PaymentMethod = 'card' | 'eft' | 'cash';

type CardErrors = {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
};

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';

const GRADIENT_TEAL = [TEAL_MID, TEAL] as const;

const EFT_REFERENCE = `LPP-${Math.floor(100000 + Math.random() * 900000)}`;

const formatCardNumber = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export default function PaymentScreen({ navigation }: Props) {
  const { booking } = useBooking();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<CardErrors>({});
  const [paying, setPaying] = useState(false);

  if (!fontsLoaded) return null;

  const validate = (): boolean => {
    const next: CardErrors = {};
    const digits = cardNumber.replace(/\s/g, '');
    if (digits.length < 12) next.cardNumber = 'Enter a valid card number.';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      next.expiry = 'Use MM/YY.';
    }
    if (!/^\d{3,4}$/.test(cvv)) next.cvv = 'Enter a valid CVV.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePayNow = () => {
    if (paying) return;
    if (method === 'card' && !validate()) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      navigation.navigate('Success');
    }, 1500);
  };

  const handleCancel = () => {
    Alert.alert('Cancel payment', 'Are you sure you want to cancel?', [
      { text: 'Keep paying', style: 'cancel' },
      {
        text: 'Cancel',
        style: 'destructive',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BookingHeader
        title="Payment"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BookingProgress current={3} title="Payment details" />

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons name="basket-outline" size={22} color={colors.white} />
          </View>
          <View style={styles.summaryBody}>
            <Text style={styles.summaryLabel}>Laundry Pickup Booking</Text>
            <Text style={styles.summaryHint}>
              {booking.pickupAddress}
            </Text>
          </View>
          <Text style={styles.summaryValue}>{formatMoney(booking.total)}</Text>
        </View>

        <Text style={styles.sectionLabel}>Payment Method</Text>
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[
              styles.methodCard,
              method === 'card' && styles.methodCardSelected,
            ]}
            onPress={() => setMethod('card')}
          >
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={22}
              color={method === 'card' ? TEAL : TEXT_MUTED}
            />
            <Text
              style={[
                styles.methodText,
                method === 'card' && styles.methodTextSelected,
              ]}
            >
              Card
            </Text>
            {method === 'card' && (
              <View style={styles.methodCheck}>
                <MaterialCommunityIcons name="check" size={12} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              method === 'eft' && styles.methodCardSelected,
            ]}
            onPress={() => setMethod('eft')}
          >
            <MaterialCommunityIcons
              name="bank-transfer"
              size={22}
              color={method === 'eft' ? TEAL : TEXT_MUTED}
            />
            <Text
              style={[
                styles.methodText,
                method === 'eft' && styles.methodTextSelected,
              ]}
            >
              EFT
            </Text>
            {method === 'eft' && (
              <View style={styles.methodCheck}>
                <MaterialCommunityIcons name="check" size={12} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              method === 'cash' && styles.methodCardSelected,
            ]}
            onPress={() => setMethod('cash')}
          >
            <MaterialCommunityIcons
              name="cash"
              size={22}
              color={method === 'cash' ? TEAL : TEXT_MUTED}
            />
            <Text
              style={[
                styles.methodText,
                method === 'cash' && styles.methodTextSelected,
              ]}
            >
              Cash
            </Text>
            {method === 'cash' && (
              <View style={styles.methodCheck}>
                <MaterialCommunityIcons name="check" size={12} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {method === 'card' && (
          <View style={styles.cardForm}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View
              style={[
                styles.inputField,
                !!errors.cardNumber && styles.inputFieldError,
              ]}
            >
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={20}
                color={TEXT_MUTED}
              />
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={(text) => {
                  setCardNumber(formatCardNumber(text));
                  setErrors((prev) => ({ ...prev, cardNumber: undefined }));
                }}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={TEXT_MUTED}
                keyboardType="number-pad"
              />
            </View>
            {!!errors.cardNumber && (
              <Text style={styles.inputError}>{errors.cardNumber}</Text>
            )}

            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <View
                  style={[
                    styles.inputField,
                    !!errors.expiry && styles.inputFieldError,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={20}
                    color={TEXT_MUTED}
                  />
                  <TextInput
                    style={styles.input}
                    value={expiry}
                    onChangeText={(text) => {
                      setExpiry(formatExpiry(text));
                      setErrors((prev) => ({ ...prev, expiry: undefined }));
                    }}
                    placeholder="MM/YY"
                    placeholderTextColor={TEXT_MUTED}
                    keyboardType="number-pad"
                  />
                </View>
                {!!errors.expiry && (
                  <Text style={styles.inputError}>{errors.expiry}</Text>
                )}
              </View>

              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View
                  style={[
                    styles.inputField,
                    !!errors.cvv && styles.inputFieldError,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="shield-lock-outline"
                    size={20}
                    color={TEXT_MUTED}
                  />
                  <TextInput
                    style={styles.input}
                    value={cvv}
                    onChangeText={(text) => {
                      setCvv(text.replace(/\D/g, '').slice(0, 4));
                      setErrors((prev) => ({ ...prev, cvv: undefined }));
                    }}
                    placeholder="123"
                    placeholderTextColor={TEXT_MUTED}
                    keyboardType="number-pad"
                    secureTextEntry
                  />
                </View>
                {!!errors.cvv && (
                  <Text style={styles.inputError}>{errors.cvv}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {method === 'eft' && (
          <View style={styles.eftCard}>
            <View style={styles.eftHeader}>
              <MaterialCommunityIcons name="bank-outline" size={22} color={TEAL} />
              <Text style={styles.eftTitle}>Bank Transfer Details</Text>
            </View>
            <View style={styles.eftRow}>
              <Text style={styles.eftLabel}>Bank</Text>
              <Text style={styles.eftValue}>First National Bank</Text>
            </View>
            <View style={styles.eftRow}>
              <Text style={styles.eftLabel}>Account holder</Text>
              <Text style={styles.eftValue}>Laundry Pickup Pro (Pty) Ltd</Text>
            </View>
            <View style={styles.eftRow}>
              <Text style={styles.eftLabel}>Account number</Text>
              <Text style={styles.eftValue}>62815091234</Text>
            </View>
            <View style={styles.eftRow}>
              <Text style={styles.eftLabel}>Branch code</Text>
              <Text style={styles.eftValue}>250655</Text>
            </View>
            <View style={styles.eftReference}>
              <Text style={styles.eftReferenceLabel}>Use this reference</Text>
              <Text style={styles.eftReferenceValue}>{EFT_REFERENCE}</Text>
            </View>
          </View>
        )}

        {method === 'cash' && (
          <View style={styles.cashNote}>
            <MaterialCommunityIcons name="cash-check" size={22} color={TEAL} />
            <Text style={styles.cashNoteText}>
              Pay the driver in cash when your laundry is collected.
            </Text>
          </View>
        )}

        <View style={styles.secureRow}>
          <MaterialCommunityIcons name="lock-outline" size={16} color={TEAL} />
          <Text style={styles.secureText}>
            Your payment is securely encrypted.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={paying}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.payButtonTouch}
          activeOpacity={0.9}
          disabled={paying}
          onPress={handlePayNow}
        >
          <LinearGradient colors={GRADIENT_TEAL} style={styles.payButton}>
            {paying ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Text style={styles.payButtonText}>Pay Now</Text>
                <MaterialCommunityIcons name="lock" size={16} color={colors.white} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    backgroundColor: '#F7F9FB',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryBody: {
    flex: 1,
    marginLeft: 12,
  },
  summaryLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
  },
  summaryHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  summaryValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: TEAL,
  },
  sectionLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEXT_DARK,
    marginBottom: 12,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodCard: {
    width: '31%',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: BORDER,
    paddingVertical: 18,
    alignItems: 'center',
    position: 'relative',
  },
  methodCardSelected: {
    borderColor: TEAL,
    backgroundColor: '#F4F8F7',
  },
  methodText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: TEXT_MUTED,
    marginTop: 8,
  },
  methodTextSelected: {
    color: TEAL,
    fontFamily: 'Poppins_600SemiBold',
  },
  methodCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardForm: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginTop: 16,
  },
  inputLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 8,
  },
  inputField: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  inputFieldError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: TEXT_DARK,
  },
  inputError: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: colors.danger,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  inputHalf: {
    width: '48%',
  },
  cashNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F5F4',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 16,
  },
  cashNoteText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: '#4A5C64',
    marginLeft: 10,
  },
  eftCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 16,
  },
  eftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eftTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
    marginLeft: 8,
  },
  eftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F3F4',
  },
  eftLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
  },
  eftValue: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_DARK,
  },
  eftReference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F8F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  eftReferenceLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
  },
  eftReferenceValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEAL,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  secureText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginLeft: 6,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  cancelButton: {
    height: 58,
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: TEAL,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cancelButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: TEAL,
  },
  payButtonTouch: {
    flex: 1.4,
    borderRadius: 18,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderRadius: 18,
    elevation: 4,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  payButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: colors.white,
    marginRight: 8,
  },
});
