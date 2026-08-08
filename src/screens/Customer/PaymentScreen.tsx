import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
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
import type { Booking } from '../../context/BookingContext';
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

const GRADIENT_SUMMARY = ['#2E6BFF', '#7857FF'] as const;
const GRADIENT_NEXT = ['#17879B', '#0E5E73'] as const;
const GRADIENT_REF = ['#00A85A', '#0B7A50'] as const;

type MethodMeta = {
  color: string;
  tint: string;
};

const METHOD_META: Record<PaymentMethod, MethodMeta> = {
  card: { color: '#2E6BFF', tint: '#E4EEFF' },
  eft: { color: '#0E9AA7', tint: '#D6F0F4' },
  cash: { color: '#00A85A', tint: '#DDF8E8' },
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  card: 'Card',
  eft: 'EFT',
  cash: 'Cash',
};

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
  const { booking, updateBooking } = useBooking();
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
  const [confirmVisible, setConfirmVisible] = useState(false);

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
    updateBooking({ paymentMethod: PAYMENT_LABEL[method] as Booking['paymentMethod'] });
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      navigation.navigate('Success');
    }, 1500);
  };

  const handleCancel = () => {
    setConfirmVisible(true);
  };

  const keepPaying = () => setConfirmVisible(false);

  const confirmCancel = () => {
    setConfirmVisible(false);
    navigation.goBack();
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

        <LinearGradient colors={GRADIENT_SUMMARY} style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons name="basket-outline" size={22} color="#7857FF" />
          </View>
          <View style={styles.summaryBody}>
            <Text style={styles.summaryLabel}>Laundry Pickup Booking</Text>
            <Text style={styles.summaryHint}>
              {booking.pickupAddress}
            </Text>
          </View>
          <Text style={styles.summaryValue}>{formatMoney(booking.total)}</Text>
        </LinearGradient>

        <Text style={styles.sectionLabel}>Payment Method</Text>
        <View style={styles.methodRow}>
          {(
            [
              ['card', 'credit-card-outline'],
              ['eft', 'bank-transfer'],
              ['cash', 'cash'],
            ] as [PaymentMethod, string][]
          ).map(([key, iconName]) => {
            const meta = METHOD_META[key];
            const selected = method === key;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.methodCard,
                  selected && {
                    borderColor: meta.color,
                    backgroundColor: meta.tint,
                  },
                ]}
                onPress={() => setMethod(key)}
              >
                <MaterialCommunityIcons
                  name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
                  size={22}
                  color={selected ? meta.color : TEXT_MUTED}
                />
                <Text
                  style={[
                    styles.methodText,
                    selected && { color: meta.color },
                    selected && styles.methodTextSelected,
                  ]}
                >
                  {key === 'card' ? 'Card' : key === 'eft' ? 'EFT' : 'Cash'}
                </Text>
                {selected && (
                  <View style={[styles.methodCheck, { backgroundColor: meta.color }]}>
                    <MaterialCommunityIcons name="check" size={12} color={colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
            <View style={styles.cashNoteIcon}>
              <MaterialCommunityIcons name="cash-check" size={20} color="#00A85A" />
            </View>
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
          <LinearGradient colors={GRADIENT_NEXT} style={styles.payButton}>
            {paying ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="lock-check-outline"
                  size={18}
                  color={colors.white}
                  style={styles.payButtonIcon}
                />
                <Text style={styles.payButtonText}>Pay Now</Text>
                <MaterialCommunityIcons name="lock" size={16} color={colors.white} />
              </>
            )}
            <View style={styles.payButtonShine} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={keepPaying}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <MaterialCommunityIcons name="close-circle-outline" size={36} color="#E5484D" />
            </View>
            <Text style={styles.confirmTitle}>Cancel payment?</Text>
            <Text style={styles.confirmDesc}>
              Your booking details will be kept, but you'll be taken back to
              review and can try again.
            </Text>
            <TouchableOpacity
              style={styles.confirmKeepBtn}
              onPress={keepPaying}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="credit-card-outline" size={16} color={TEAL} />
              <Text style={styles.confirmKeepText}>Keep paying</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmDangerBtn}
              onPress={confirmCancel}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="close" size={16} color="#FFFFFF" />
              <Text style={styles.confirmDangerText}>Yes, cancel payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#4B4BF2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
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
    color: '#FFFFFF',
  },
  summaryHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  summaryValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
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
    backgroundColor: '#DDF8E8',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 16,
  },
  cashNoteIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashNoteText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: '#1F6B44',
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
    backgroundColor: '#E4EEFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  eftReferenceLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#1F4E79',
  },
  eftReferenceValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#2E6BFF',
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
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#0E5E73',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  payButtonIcon: {
    marginRight: 8,
  },
  payButtonShine: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 90,
    height: 120,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    transform: [{ rotate: '20deg' }],
  },
  payButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: colors.white,
    marginRight: 8,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.55)',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
    elevation: 14,
    shadowColor: '#0F363F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  confirmIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FDE7E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  confirmTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1F2933',
    marginBottom: 6,
  },
  confirmDesc: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmKeepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: TEAL,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  confirmKeepText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEAL,
    marginLeft: 6,
  },
  confirmDangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 15,
    backgroundColor: '#E5484D',
  },
  confirmDangerText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
