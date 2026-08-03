import React, { useState } from 'react';
import {
  Alert,
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
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
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

type Props = NativeStackScreenProps<BookingStackParamList, 'Step1'>;

type PickerField = 'pickupDate' | 'pickupTime' | 'deliveryDate' | 'deliveryTime';

type SectionIcon = keyof typeof MaterialCommunityIcons.glyphMap;

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const TEAL_TINT = '#E2ECEB';
const TEAL_TINT_2 = '#D3E5E3';
const ICON_DARK = '#2B3642';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';

const GRADIENT_TEAL = [TEAL_MID, TEAL] as const;
const GRADIENT_TINT = [TEAL_TINT, TEAL_TINT_2] as const;

type SectionHeaderProps = {
  title: string;
  icon: SectionIcon;
};

function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderIcon}>
        <MaterialCommunityIcons name={icon} size={15} color={colors.white} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function BookPickupScreen({ navigation }: Props) {
  const { booking, updateBooking } = useBooking();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [activePicker, setActivePicker] = useState<PickerField | null>(null);
  const [editingAddress, setEditingAddress] = useState<{
    kind: 'Pickup' | 'Delivery';
    value: string;
  } | null>(null);

  if (!fontsLoaded) return null;

  const openAddress = (kind: 'Pickup' | 'Delivery') => {
    setEditingAddress({
      kind,
      value: kind === 'Pickup' ? booking.pickupAddress : booking.deliveryAddress,
    });
  };

  const saveAddress = () => {
    if (!editingAddress) return;
    const value = editingAddress.value.trim();
    if (!value) return;
    if (editingAddress.kind === 'Pickup') {
      updateBooking({ pickupAddress: value });
    } else {
      updateBooking({ deliveryAddress: value });
    }
    setEditingAddress(null);
  };

  const pickerValue: Date =
    activePicker === 'pickupDate'
      ? booking.pickupDate
      : activePicker === 'pickupTime'
        ? booking.pickupTime
        : activePicker === 'deliveryDate'
          ? booking.deliveryDate
          : booking.deliveryTime;

  const pickerMode: 'date' | 'time' =
    activePicker === 'pickupTime' || activePicker === 'deliveryTime'
      ? 'time'
      : 'date';

  const onPickerChange = (event: DateTimePickerEvent, date?: Date) => {
    setActivePicker(null);
    if (event.type === 'set' && date) {
      switch (activePicker) {
        case 'pickupDate':
          updateBooking({ pickupDate: date });
          break;
        case 'pickupTime':
          updateBooking({ pickupTime: date });
          break;
        case 'deliveryDate':
          updateBooking({ deliveryDate: date });
          break;
        case 'deliveryTime':
          updateBooking({ deliveryTime: date });
          break;
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BookingHeader
        title="Book a Pickup"
        onBack={() => navigation.getParent()?.navigate('Home')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <BookingProgress current={1} title="Pickup details" />

        <View style={styles.section}>
          <SectionHeader title="Service" icon="truck-delivery-outline" />
          <LinearGradient colors={GRADIENT_TEAL} style={styles.serviceCard}>
            <View style={styles.serviceIcon}>
              <MaterialCommunityIcons
                name="truck-delivery-outline"
                size={26}
                color={TEAL}
              />
            </View>
            <View style={styles.serviceText}>
              <Text style={styles.serviceTitle}>Pickup &amp; Drop Off</Text>
              <Text style={styles.serviceSubtitle}>
                (We only pick up and drop off)
              </Text>
            </View>
            <View style={styles.serviceCheck}>
              <MaterialCommunityIcons name="check" size={15} color={colors.white} />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Pickup Address" icon="map-marker-outline" />
          <TouchableOpacity
            style={styles.addressCard}
            onPress={() => openAddress('Pickup')}
          >
            <LinearGradient colors={GRADIENT_TINT} style={styles.addressIcon}>
              <MaterialCommunityIcons name="map-marker-outline" size={22} color={TEAL} />
            </LinearGradient>
            <View style={styles.addressText}>
              <Text style={styles.addressLine}>{booking.pickupAddress}</Text>
              <Text style={styles.addressHint}>Where we collect your laundry</Text>
            </View>
            <View style={styles.changePill}>
              <Text style={styles.changeText}>Change</Text>
              <MaterialCommunityIcons name="chevron-right" size={14} color={TEAL} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Delivery Address" icon="home-variant-outline" />
          <TouchableOpacity
            style={styles.addressCard}
            onPress={() => openAddress('Delivery')}
          >
            <LinearGradient colors={GRADIENT_TINT} style={styles.addressIcon}>
              <MaterialCommunityIcons name="home-variant-outline" size={22} color={TEAL} />
            </LinearGradient>
            <View style={styles.addressText}>
              <Text style={styles.addressLine}>{booking.deliveryAddress}</Text>
              <Text style={styles.addressHint}>
                Where we deliver your clean laundry
              </Text>
            </View>
            <View style={styles.changePill}>
              <Text style={styles.changeText}>Change</Text>
              <MaterialCommunityIcons name="chevron-right" size={14} color={TEAL} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Pickup Date &amp; Time" icon="calendar-clock" />
          <View style={styles.fieldRow}>
            <TouchableOpacity
              style={styles.fieldCard}
              onPress={() => setActivePicker('pickupDate')}
            >
              <LinearGradient colors={GRADIENT_TINT} style={styles.fieldIcon}>
                <MaterialCommunityIcons name="calendar-outline" size={20} color={TEAL} />
              </LinearGradient>
              <Text style={styles.fieldLabel}>Pickup Date</Text>
              <Text style={styles.fieldValue}>
                {formatBookingDate(booking.pickupDate)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fieldCard}
              onPress={() => setActivePicker('pickupTime')}
            >
              <LinearGradient colors={GRADIENT_TINT} style={styles.fieldIcon}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={TEAL} />
              </LinearGradient>
              <Text style={styles.fieldLabel}>Pickup Time</Text>
              <Text style={styles.fieldValue}>
                {formatTimeWindow(booking.pickupTime)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Delivery Date &amp; Time" icon="clock-fast" />
          <View style={styles.fieldRow}>
            <TouchableOpacity
              style={styles.fieldCard}
              onPress={() => setActivePicker('deliveryDate')}
            >
              <LinearGradient colors={GRADIENT_TINT} style={styles.fieldIcon}>
                <MaterialCommunityIcons name="calendar-outline" size={20} color={TEAL} />
              </LinearGradient>
              <Text style={styles.fieldLabel}>Delivery Date</Text>
              <Text style={styles.fieldValue}>
                {formatBookingDate(booking.deliveryDate)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fieldCard}
              onPress={() => setActivePicker('deliveryTime')}
            >
              <LinearGradient colors={GRADIENT_TINT} style={styles.fieldIcon}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={TEAL} />
              </LinearGradient>
              <Text style={styles.fieldLabel}>Delivery Time</Text>
              <Text style={styles.fieldValue}>
                {formatTimeWindow(booking.deliveryTime)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Special Instructions" icon="note-edit-outline" />
          <View style={styles.instructionsWrap}>
            <MaterialCommunityIcons
              name="note-edit-outline"
              size={18}
              color={TEAL}
              style={styles.instructionsIcon}
            />
            <TextInput
              style={styles.instructionsInput}
              placeholder="Leave laundry bags on the front porch if not answered."
              placeholderTextColor={TEXT_MUTED}
              value={booking.instructions}
              onChangeText={(text) => updateBooking({ instructions: text })}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButtonTouch}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Step2')}
        >
          <LinearGradient colors={GRADIENT_TEAL} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
            <View style={styles.nextArrow}>
              <MaterialCommunityIcons name="arrow-right" size={18} color={colors.white} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {activePicker && (
        <DateTimePicker
          value={pickerValue}
          mode={pickerMode}
          onChange={onPickerChange}
        />
      )}

      <Modal
        visible={editingAddress !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingAddress(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editingAddress?.kind} Address
            </Text>
            <TextInput
              style={styles.modalInput}
              value={editingAddress?.value}
              onChangeText={(text) =>
                setEditingAddress((prev) =>
                  prev ? { ...prev, value: text } : prev
                )
              }
              placeholder="Enter address"
              placeholderTextColor={TEXT_MUTED}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setEditingAddress(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={saveAddress}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
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
  section: {
    marginTop: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEXT_DARK,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceText: {
    flex: 1,
    marginLeft: 14,
  },
  serviceTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: colors.white,
  },
  serviceSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  serviceCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  addressIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressText: {
    flex: 1,
    marginLeft: 14,
  },
  addressLine: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: TEXT_DARK,
  },
  addressHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: TEAL_TINT,
  },
  changeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: TEAL,
    marginRight: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 14,
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  fieldIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  fieldLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
  },
  fieldValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
    marginTop: 2,
  },
  instructionsWrap: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  instructionsIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  instructionsInput: {
    flex: 1,
    minHeight: 110,
    padding: 0,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: TEXT_DARK,
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
    borderTopColor: BORDER,
  },
  nextButtonTouch: {
    borderRadius: 18,
  },
  nextButton: {
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
  nextButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: colors.white,
    marginRight: 10,
  },
  nextArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  modalTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: TEXT_DARK,
    marginBottom: 14,
  },
  modalInput: {
    minHeight: 52,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    paddingHorizontal: 16,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: TEXT_DARK,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
  },
  modalCancel: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
  },
  modalCancelText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: TEXT_MUTED,
  },
  modalSave: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: TEAL,
  },
  modalSaveText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: colors.white,
  },
});
