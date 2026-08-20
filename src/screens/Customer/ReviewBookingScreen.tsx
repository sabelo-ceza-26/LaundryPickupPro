import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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
import {
  formatBookingDate,
  formatMoney,
  formatTimeWindow,
} from '../../utils/format';
import { DELIVERY_FEE, RATE_PER_KM } from '../../services/pricing';

type Props = NativeStackScreenProps<BookingStackParamList, 'Step2'>;

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';

const GRADIENT_TOTAL = ['#2E6BFF', '#7857FF'] as const;
const GRADIENT_NEXT = ['#17879B', '#0E5E73'] as const;

type Accent = {
  main: string;
  tint: string;
};

const ACCENTS: Record<string, Accent> = {
  blue: { main: '#2E6BFF', tint: '#E4EEFF' },
  purple: { main: '#7857FF', tint: '#EFEBFF' },
  teal: { main: TEAL, tint: '#E2ECEB' },
  green: { main: '#00A85A', tint: '#DDF8E8' },
};

type DetailRowProps = {
  icon: Icon;
  label: string;
  value: string;
  accent: Accent;
  last?: boolean;
};

function DetailRow({ icon, label, value, accent, last }: DetailRowProps) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <View style={[styles.detailIcon, { backgroundColor: accent.tint }]}>
        <MaterialCommunityIcons name={icon} size={20} color={accent.main} />
      </View>
      <View style={styles.detailBody}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const isWeb = Platform.OS === 'web';

export default function ReviewBookingScreen({ navigation }: Props) {
  const { booking } = useBooking();
  const [confirmed, setConfirmed] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <BookingHeader
        title="Review Your Booking"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <BookingProgress current={2} title="Review your booking" />

        <View style={styles.notice}>
          <View style={styles.noticeIcon}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color="#2E6BFF"
            />
          </View>
          <Text style={styles.noticeText}>
            Pickup and drop-off schedules may change depending on the courier's
            route and the laundromat's operating hours.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Booking Details</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Standard</Text>
            </View>
          </View>
          <DetailRow
            icon="map-marker-outline"
            label="Pickup Address"
            value={booking.pickupAddress}
            accent={ACCENTS.blue}
          />
          <DetailRow
            icon="home-variant-outline"
            label="Delivery Address"
            value={booking.deliveryAddress}
            accent={ACCENTS.purple}
          />
          {booking.assignedLaundromat && (
            <DetailRow
              icon="washing-machine"
              label="Laundromat"
              value={`${booking.assignedLaundromat.name} — ${booking.assignedLaundromat.address}`}
              accent={ACCENTS.green}
            />
          )}
          <DetailRow
            icon="calendar-outline"
            label="Pickup Date & Time"
            value={`${formatBookingDate(booking.pickupDate)} · ${formatTimeWindow(booking.pickupTime)}`}
            accent={ACCENTS.teal}
          />
          <DetailRow
            icon="clock-outline"
            label="Delivery Date & Time"
            value={`${formatBookingDate(booking.deliveryDate)} · ${formatTimeWindow(booking.deliveryTime)}`}
            accent={ACCENTS.green}
            last
          />
        </View>

        <LinearGradient colors={GRADIENT_TOTAL} style={styles.totalCard}>
          <View style={styles.totalIcon}>
            <MaterialCommunityIcons name="cash-multiple" size={24} color="#7857FF" />
          </View>
          <View style={styles.totalBody}>
            <Text style={styles.totalLabel}>Price Breakdown</Text>
            <Text style={styles.totalHint}>
              Pickup & delivery service
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Bags</Text>
            <Text style={styles.breakdownValue}>{booking.bagCount} {booking.bagCount === 1 ? 'bag' : 'bags'}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Delivery fee</Text>
            <Text style={styles.breakdownValue}>{formatMoney(DELIVERY_FEE)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>
              Distance ({booking.distanceKm > 0 ? booking.distanceKm.toFixed(1) : '0'} km × {formatMoney(RATE_PER_KM)}/km)
            </Text>
            <Text style={styles.breakdownValue}>{formatMoney(booking.distanceFee)}</Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownTotalLabel}>Total</Text>
            <Text style={styles.breakdownTotalValue}>{formatMoney(booking.total)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Special Notes</Text>
          <Text style={styles.notesText}>
            {booking.instructions || 'No special instructions added.'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.confirmRow}
          onPress={() => setConfirmed(!confirmed)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              confirmed && styles.checkboxChecked,
            ]}
          >
            {confirmed && (
              <MaterialCommunityIcons name="check" size={14} color={colors.white} />
            )}
          </View>
          <Text style={styles.confirmText}>
            I confirm that all the booking details above are accurate.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.payButtonTouch, !confirmed && styles.buttonDisabled]}
          activeOpacity={0.9}
          disabled={!confirmed}
          onPress={() => navigation.navigate('Step3')}
        >
          <LinearGradient
            colors={GRADIENT_NEXT}
            style={[
              styles.payButton,
              !confirmed && styles.buttonDisabled,
            ]}
          >
            <MaterialCommunityIcons
              name="rocket-launch-outline"
              size={18}
              color={colors.white}
              style={styles.payButtonIcon}
            />
            <Text style={styles.payButtonText}>Payment</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={colors.white} />
            <View style={styles.payButtonShine} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: TEAL,
  },
  scroll: {
    backgroundColor: '#F7F9FB',
  },
  container: {
    paddingHorizontal: isWeb ? 32 : 20,
    paddingTop: 8,
    paddingBottom: 110,
    ...(isWeb ? { maxWidth: 600, alignSelf: 'center', width: '100%' } : {}),
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E4EEFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  noticeIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  noticeText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#1F4E79',
    marginLeft: 0,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 18,
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEXT_DARK,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E2ECEB',
  },
  badgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: TEAL,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailRowLast: {
    paddingBottom: 14,
  },
  detailIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailBody: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
  },
  detailValue: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_DARK,
    marginTop: 1,
  },
  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 18,
    elevation: 5,
    shadowColor: '#4B4BF2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
  },
  totalIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  totalBody: {
    flex: 1,
  },
  totalLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  totalHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
  },
  totalValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  breakdownCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  breakdownLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    flex: 1,
  },
  breakdownValue: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_DARK,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 8,
  },
  breakdownTotalLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEXT_DARK,
  },
  breakdownTotalValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: TEAL,
  },
  notesText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: TEXT_DARK,
    paddingVertical: 10,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingVertical: 6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#C3D1CF',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  confirmText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: '#4A5C64',
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
  backButton: {
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
  backButtonText: {
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
  buttonDisabled: {
    opacity: 0.45,
  },
});
