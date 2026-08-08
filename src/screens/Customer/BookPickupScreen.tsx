import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
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
import DateTimePickerModal from '../../components/DateTimePickerModal';
import FancyAlert from '../../components/FancyAlert';
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
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';

const GRADIENT_VIBRANT = ['#2E6BFF', '#7857FF'] as const;
const GRADIENT_POP = ['#33C9B2', '#2E6BFF'] as const;
const GRADIENT_HERO = ['#17879B', '#0F4C63', '#0F363F'] as const;
const GRADIENT_NEXT = ['#17879B', '#0E5E73'] as const;

type Accent = {
  main: string;
  tint: string;
  tint2: string;
};

const ACCENTS: Record<string, Accent> = {
  teal: { main: TEAL, tint: TEAL_TINT, tint2: TEAL_TINT_2 },
  blue: { main: '#2E6BFF', tint: '#EAF0FF', tint2: '#D9E5FF' },
  purple: { main: '#7857FF', tint: '#F0EDFF', tint2: '#E0DBFF' },
  amber: { main: '#E8860B', tint: '#FFF3DC', tint2: '#FFE7B8' },
};

type SectionHeaderProps = {
  step: string;
  title: string;
  icon: SectionIcon;
  accent: Accent;
};

function SectionHeader({ step, title, icon, accent }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionHeaderStep, { backgroundColor: accent.tint }]}>
        <Text style={[styles.sectionHeaderStepText, { color: accent.main }]}>
          {step}
        </Text>
      </View>
      <View style={[styles.sectionHeaderIcon, { backgroundColor: accent.main }]}>
        <MaterialCommunityIcons name={icon} size={15} color={colors.white} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionHeaderLine} />
    </View>
  );
}

type AddressCardProps = {
  icon: SectionIcon;
  address: string;
  hint: string;
  emptyLabel: string;
  accent: Accent;
  onPress: () => void;
};

function AddressCard({
  icon,
  address,
  hint,
  emptyLabel,
  accent,
  onPress,
}: AddressCardProps) {
  const isEmpty = !address.trim();
  return (
    <LinearGradient
      colors={[accent.tint, accent.tint2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.addressCard}
    >
      <TouchableOpacity style={styles.addressInner} onPress={onPress}>
        <View style={styles.addressIcon}>
          <MaterialCommunityIcons name={icon} size={22} color={accent.main} />
        </View>
        <View style={styles.addressText}>
          <Text
            style={[styles.addressLine, isEmpty && styles.addressPlaceholder]}
            numberOfLines={2}
          >
            {address || emptyLabel}
          </Text>
          <Text style={styles.addressHint}>{hint}</Text>
        </View>
        <View style={styles.changePill}>
          <Text style={[styles.changeText, { color: accent.main }]}>
            {isEmpty ? 'Add' : 'Change'}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={14} color={accent.main} />
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
}

type DateTimeCardProps = {
  icon: SectionIcon;
  label: string;
  value: string;
  accent: Accent;
  onPress: () => void;
};

function DateTimeCard({ icon, label, value, accent, onPress }: DateTimeCardProps) {
  return (
    <TouchableOpacity style={styles.fieldCard} onPress={onPress}>
      <LinearGradient
        colors={[accent.tint, accent.tint2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fieldCardBg}
      >
        <View style={styles.fieldIcon}>
          <MaterialCommunityIcons name={icon} size={20} color={accent.main} />
        </View>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text
          style={[styles.fieldValue, { color: accent.main }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {value}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function BookPickupScreen({ navigation }: Props) {
  const { booking, updateBooking } = useBooking();
  const scrollViewRef = useRef<ScrollView>(null);
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
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(
    null
  );

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

  const pickerTitle: string =
    activePicker === 'pickupDate'
      ? 'Pickup Date'
      : activePicker === 'pickupTime'
        ? 'Pickup Time'
        : activePicker === 'deliveryDate'
          ? 'Delivery Date'
          : 'Delivery Time';

  const pickerValue: Date =
    activePicker === 'pickupDate'
      ? booking.pickupDate
      : activePicker === 'pickupTime'
        ? booking.pickupTime
        : activePicker === 'deliveryDate'
          ? booking.deliveryDate
          : booking.deliveryTime;

  const onPickerSelect = (date: Date) => {
    if (!activePicker) return;
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
  };

  const handleNext = () => {
    const missing: string[] = [];
    if (!booking.pickupAddress.trim()) {
      missing.push('a pickup address');
    }
    if (!booking.deliveryAddress.trim()) {
      missing.push('a delivery address');
    }
    if (missing.length > 0) {
      setAlert({
        title: 'Almost there',
        message: `Please add ${missing.join(' and ')} before continuing.`,
      });
      return;
    }
    navigation.navigate('Step2');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BookingHeader
        title="Book a Pickup"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scroll}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
        >
        <LinearGradient colors={GRADIENT_HERO} style={styles.hero}>
          <View style={styles.heroCircleA} />
          <View style={styles.heroCircleB} />
          <View style={styles.heroCircleC} />
          <View style={styles.heroRow}>
            <View style={styles.heroContent}>
              <View style={styles.heroTitleRow}>
                <Text style={styles.heroTitle}>Schedule your </Text>
                <LinearGradient
                  colors={GRADIENT_POP}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.heroHighlight}
                >
                  <Text style={styles.heroHighlightText}>pickup</Text>
                </LinearGradient>
              </View>
              <Text style={styles.heroSubtitle}>
                Tell us where and when to collect your laundry.
              </Text>
            </View>
            <View style={styles.heroIconWrap}>
              <LinearGradient
                colors={GRADIENT_VIBRANT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroIconCircle}
              >
                <MaterialCommunityIcons
                  name="truck-delivery-outline"
                  size={40}
                  color={colors.white}
                />
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.progressWrap}>
          <BookingProgress current={1} title="Pickup details" />
        </View>

        <View style={styles.section}>
          <SectionHeader
            step="1"
            title="Addresses"
            icon="map-marker-outline"
            accent={ACCENTS.blue}
          />
          <AddressCard
            icon="map-marker-outline"
            address={booking.pickupAddress}
            hint="Where we collect your laundry"
            emptyLabel="Add your pickup address"
            accent={ACCENTS.blue}
            onPress={() => openAddress('Pickup')}
          />
          <AddressCard
            icon="home-variant-outline"
            address={booking.deliveryAddress}
            hint="Where we deliver your laundry"
            emptyLabel="Add your delivery address"
            accent={ACCENTS.purple}
            onPress={() => openAddress('Delivery')}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader
            step="2"
            title="Schedule"
            icon="calendar-clock"
            accent={ACCENTS.purple}
          />
          <View style={styles.fieldRow}>
            <DateTimeCard
              icon="calendar-outline"
              label="Pickup Date"
              value={formatBookingDate(booking.pickupDate)}
              accent={ACCENTS.blue}
              onPress={() => setActivePicker('pickupDate')}
            />
            <DateTimeCard
              icon="clock-outline"
              label="Pickup Time"
              value={formatTimeWindow(booking.pickupTime)}
              accent={ACCENTS.blue}
              onPress={() => setActivePicker('pickupTime')}
            />
          </View>
          <View style={styles.fieldRow}>
            <DateTimeCard
              icon="calendar-outline"
              label="Delivery Date"
              value={formatBookingDate(booking.deliveryDate)}
              accent={ACCENTS.purple}
              onPress={() => setActivePicker('deliveryDate')}
            />
            <DateTimeCard
              icon="clock-outline"
              label="Delivery Time"
              value={formatTimeWindow(booking.deliveryTime)}
              accent={ACCENTS.purple}
              onPress={() => setActivePicker('deliveryTime')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            step="3"
            title="Special Instructions"
            icon="note-edit-outline"
            accent={ACCENTS.amber}
          />
          <LinearGradient
            colors={[ACCENTS.amber.tint, ACCENTS.amber.tint2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.instructionsWrap}
          >
            <View style={styles.instructionsIcon}>
              <MaterialCommunityIcons
                name="note-edit-outline"
                size={18}
                color={ACCENTS.amber.main}
              />
            </View>
            <TextInput
              style={styles.instructionsInput}
              placeholder="Anything else we should know? (optional)"
              placeholderTextColor={TEXT_MUTED}
              value={booking.instructions}
              onChangeText={(text) => updateBooking({ instructions: text })}
              onFocus={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
              multiline
              textAlignVertical="top"
            />
          </LinearGradient>
        </View>

        <View style={styles.submitWrap}>
          <Text style={styles.footerHint}>
            You can review everything before confirming.
          </Text>
          <TouchableOpacity
            style={styles.nextButtonTouch}
            activeOpacity={0.9}
            onPress={handleNext}
          >
            <LinearGradient colors={GRADIENT_NEXT} style={styles.nextButton}>
              <MaterialCommunityIcons
                name="rocket-launch-outline"
                size={20}
                color={colors.white}
                style={styles.nextIcon}
              />
              <Text style={styles.nextButtonText}>Next</Text>
              <View style={styles.nextArrow}>
                <MaterialCommunityIcons name="arrow-right" size={18} color={colors.white} />
              </View>
              <View style={styles.nextShine} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePickerModal
        visible={activePicker !== null}
        mode={activePicker === 'pickupTime' || activePicker === 'deliveryTime' ? 'time' : 'date'}
        title={pickerTitle}
        value={pickerValue}
        onChange={onPickerSelect}
        onClose={() => setActivePicker(null)}
      />

      <FancyAlert
        visible={alert !== null}
        title={alert?.title ?? ''}
        message={alert?.message ?? ''}
        icon="alert-circle-outline"
        iconColor="#E5484D"
        iconBackground="#FDE7E8"
        buttonText="Got it"
        onClose={() => setAlert(null)}
      />

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
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: TEAL,
  },
  scroll: {
    backgroundColor: '#F3F6FC',
  },
  container: {
    paddingBottom: 36,
  },
  hero: {
    borderRadius: 28,
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 26,
    paddingHorizontal: 22,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },
  heroCircleA: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(120, 87, 255, 0.22)',
    top: -70,
    right: -50,
  },
  heroCircleB: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(46, 107, 255, 0.24)',
    bottom: -32,
    right: 110,
  },
  heroCircleC: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(51, 201, 178, 0.28)',
    top: 18,
    left: -14,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroContent: {
    flex: 1,
    paddingRight: 12,
  },
  heroTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: colors.white,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  heroHighlight: {
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 2,
  },
  heroHighlightText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: colors.white,
  },
  heroSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12.5,
    lineHeight: 19,
    color: 'rgba(255, 255, 255, 0.82)',
    marginTop: 4,
  },
  heroIconWrap: {
    alignItems: 'center',
  },
  heroIconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressWrap: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderStep: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: TEAL_TINT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionHeaderStepText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: TEAL,
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
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
    marginLeft: 10,
  },
  addressCard: {
    borderRadius: 18,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  addressInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  addressIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
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
  addressPlaceholder: {
    fontFamily: 'Poppins_400Regular',
    color: TEXT_MUTED,
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
    backgroundColor: colors.white,
  },
  changeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    marginRight: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fieldCard: {
    width: '48%',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  fieldCardBg: {
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  fieldIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.white,
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
    borderRadius: 18,
    flexDirection: 'row',
    padding: 16,
    overflow: 'hidden',
  },
  instructionsIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionsInput: {
    flex: 1,
    minHeight: 90,
    padding: 0,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: TEXT_DARK,
  },
  submitWrap: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  footerHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 8,
  },
  nextButtonTouch: {
    borderRadius: 18,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#0E5E73',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
  },
  nextShine: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 90,
    height: 120,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    transform: [{ rotate: '20deg' }],
  },
  nextIcon: {
    marginRight: 8,
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
