import React from 'react';
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
import { useBooking } from '../../context/BookingContext';
import type { BookingStackParamList } from '../../navigation/BookingNavigator';
import { colors } from '../../theme/colors';
import { formatBookingDate, formatMoney, formatTimeWindow } from '../../utils/format';

type Props = NativeStackScreenProps<BookingStackParamList, 'Success'>;

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';

const GRADIENT_TEAL = [TEAL_MID, TEAL] as const;

const reference = `LPP-${Math.floor(100000 + Math.random() * 900000)}`;

export default function BookingSuccessScreen({ navigation }: Props) {
  const { booking, resetBooking } = useBooking();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleDone = () => {
    resetBooking();
    navigation.getParent()?.navigate('Home');
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BookingHeader title="Booking Confirmed" onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.checkCircle}>
            <MaterialCommunityIcons name="check" size={44} color={colors.white} />
          </View>
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>
            Your laundry pickup has been scheduled successfully.
          </Text>
        </View>

        <View style={styles.referenceChip}>
          <Text style={styles.referenceLabel}>Booking reference</Text>
          <Text style={styles.referenceValue}>{reference}</Text>
        </View>

        <LinearGradient colors={GRADIENT_TEAL} style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <MaterialCommunityIcons name="basket-outline" size={20} color={colors.white} />
            <Text style={styles.summaryHeaderText}>Pickup &amp; Drop Off</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pickup</Text>
            <Text style={styles.summaryValue}>{booking.pickupAddress}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>When</Text>
            <Text style={styles.summaryValue}>
              {formatBookingDate(booking.pickupDate)} ·{' '}
              {formatTimeWindow(booking.pickupTime)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>{booking.deliveryAddress}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>
              {formatMoney(booking.total)}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="email-outline" size={18} color={TEAL} />
          <Text style={styles.infoText}>
            A confirmation email with these details has been sent to you.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.doneButtonTouch}
          activeOpacity={0.9}
          onPress={handleDone}
        >
          <LinearGradient colors={GRADIENT_TEAL} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>Done</Text>
            <MaterialCommunityIcons name="check" size={18} color={colors.white} />
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
    paddingTop: 32,
    paddingBottom: 110,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  checkCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: TEXT_DARK,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  referenceChip: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8ECF1',
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 22,
  },
  referenceLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    color: TEXT_MUTED,
    textTransform: 'uppercase',
  },
  referenceValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: TEAL,
    marginTop: 2,
    letterSpacing: 1,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryHeaderText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: colors.white,
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  summaryValue: {
    flex: 1,
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: colors.white,
    textAlign: 'right',
    marginLeft: 16,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginVertical: 6,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  summaryTotalLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: colors.white,
  },
  summaryTotalValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F5F4',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#4A5C64',
    marginLeft: 10,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8ECF1',
  },
  doneButtonTouch: {
    borderRadius: 18,
  },
  doneButton: {
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
  doneButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: colors.white,
    marginRight: 8,
  },
});
