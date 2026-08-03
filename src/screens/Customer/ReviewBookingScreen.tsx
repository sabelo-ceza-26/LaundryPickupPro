import React, { useState } from 'react';
import {
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
import { formatBookingDate, formatTimeWindow } from '../../utils/format';

type Props = NativeStackScreenProps<BookingStackParamList, 'Step2'>;

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';

const GRADIENT_TEAL = [TEAL_MID, TEAL] as const;

type DetailRowProps = {
  icon: Icon;
  label: string;
  value: string;
  last?: boolean;
};

function DetailRow({ icon, label, value, last }: DetailRowProps) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <View style={styles.detailIcon}>
        <MaterialCommunityIcons name={icon} size={20} color={TEAL} />
      </View>
      <View style={styles.detailBody}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

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
          <MaterialCommunityIcons
            name="information-outline"
            size={22}
            color={TEAL}
          />
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
          />
          <DetailRow
            icon="home-variant-outline"
            label="Delivery Address"
            value={booking.deliveryAddress}
          />
          <DetailRow
            icon="calendar-outline"
            label="Pickup Date & Time"
            value={`${formatBookingDate(booking.pickupDate)} · ${formatTimeWindow(booking.pickupTime)}`}
          />
          <DetailRow
            icon="clock-outline"
            label="Delivery Date & Time"
            value={`${formatBookingDate(booking.deliveryDate)} · ${formatTimeWindow(booking.deliveryTime)}`}
            last
          />
        </View>

        <View style={styles.priceNotice}>
          <MaterialCommunityIcons name="tag-outline" size={20} color={TEAL} />
          <Text style={styles.priceNoticeText}>
            The final amount will be shown on the payment screen before you
            confirm.
          </Text>
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
            colors={GRADIENT_TEAL}
            style={[
              styles.payButton,
              !confirmed && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.payButtonText}>Payment</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={colors.white} />
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
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F0F2',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  noticeText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#4A5C64',
    marginLeft: 10,
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
    backgroundColor: '#E2ECEB',
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
    justifyContent: 'space-between',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 18,
    elevation: 4,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  priceNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F5F4',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  priceNoticeText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#4A5C64',
    marginLeft: 10,
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
  buttonDisabled: {
    opacity: 0.45,
  },
});
