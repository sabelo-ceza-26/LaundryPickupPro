import React, { useState } from 'react';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import type {
  AdminOrder,
  AdminOrderItem,
} from '../context/AdminContext';
import { useAdmin } from '../context/AdminContext';
import { formatMoney } from '../utils/format';
import { isPhone, isRequired } from '../utils/validation';

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (order: AdminOrder) => void;
};

const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const PURPLE = '#7857FF';
const TEAL_HEADING = '#0E7A86';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';
const DANGER = '#E5484D';

const GRADIENT_VIBRANT = [BLUE, PURPLE] as const;

const PAYMENT_METHODS = ['Card', 'EFT', 'Cash'] as const;

const PRESET_ITEMS: { name: string; price: number; icon: Icon }[] = [
  { name: 'Wash & Fold (per kg)', price: 55, icon: 'water-outline' },
  { name: 'Wash & Iron (per kg)', price: 85, icon: 'iron' },
  { name: 'Ironing Only (per item)', price: 15, icon: 'hanger' },
  { name: 'Comforter (Queen)', price: 85, icon: 'bed-double-outline' },
  { name: 'Blanket (Double)', price: 55, icon: 'bed-outline' },
  { name: 'Curtains (per panel)', price: 40, icon: 'window-closed-variant' },
  { name: 'Towel Set', price: 45, icon: 'tshirt-crew-outline' },
  { name: 'Sneakers (per pair)', price: 35, icon: 'shoe-sneaker' },
];

let nextOrderNumber = 9036;

function currentStamp(): string {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} · ${time}`;
}

export default function AdminAddOrderModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const { pricing, drivers } = useAdmin();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [driver, setDriver] = useState('');
  const [driverPhone, setDriverPhone] = useState('083 000 0000');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_METHODS)[number]>('Card');
  const [items, setItems] = useState<AdminOrderItem[]>([
    { name: 'Wash & Fold (per kg)', quantity: 1, price: 55 },
  ]);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customError, setCustomError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = pricing.delivery.enabled ? pricing.delivery.price : 0;

  const reset = () => {
    setName('');
    setPhone('');
    setPickupAddress('');
    setDeliveryAddress('');
    setPickupDate('');
    setPickupTime('');
    setDriver('');
    setDriverPhone('083 000 0000');
    setInstructions('');
    setPaymentMethod('Card');
    setItems([{ name: 'Wash & Fold (per kg)', quantity: 1, price: 55 }]);
    setCustomName('');
    setCustomPrice('');
    setCustomError('');
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const addPreset = (preset: { name: string; price: number }) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.name === preset.name);
      if (existing) {
        return prev.map((item) =>
          item.name === preset.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { name: preset.name, quantity: 1, price: preset.price }];
    });
  };

  const changeQty = (name: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const addCustomItem = () => {
    const trimmedName = customName.trim();
    const price = Number(customPrice);

    if (!trimmedName) {
      setCustomError('Enter an item name');
      return;
    }
    if (!customPrice.trim() || Number.isNaN(price) || price <= 0) {
      setCustomError('Enter a valid price');
      return;
    }
    setCustomError('');

    setItems((prev) => {
      const existing = prev.find((item) => item.name === trimmedName);
      if (existing) {
        return prev.map((item) =>
          item.name === trimmedName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { name: trimmedName, quantity: 1, price }];
    });
    setCustomName('');
    setCustomPrice('');
  };

  const handleSubmit = () => {
    const next: Record<string, string> = {};
    if (!isRequired(name)) next.name = 'Enter the customer name';
    if (phone.trim() && !isPhone(phone)) next.phone = 'Enter a valid phone';
    if (!isRequired(pickupAddress)) next.pickupAddress = 'Enter a pickup address';
    if (!isRequired(deliveryAddress)) next.deliveryAddress = 'Enter a delivery address';
    if (!isRequired(pickupDate)) next.pickupDate = 'Enter the pickup date';
    if (!isRequired(pickupTime)) next.pickupTime = 'Enter the pickup time';
    if (!isRequired(driver)) next.driver = 'Enter the driver name';
    if (items.length === 0) next.items = 'Add at least one item';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const order: AdminOrder = {
      id: `#SUD-${nextOrderNumber++}`,
      customerName: name.trim(),
      customerPhone: phone.trim() || 'Not provided',
      pickupAddress: pickupAddress.trim(),
      deliveryAddress: deliveryAddress.trim(),
      pickupDate: pickupDate.trim(),
      pickupTime: pickupTime.trim(),
      driver: driver.trim(),
      driverPhone: driverPhone || '083 000 0000',
      status: 'Pending',
      placedAt: currentStamp(),
      items,
      deliveryFee,
      paymentMethod,
      instructions: instructions.trim(),
    };

    reset();
    onSubmit(order);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.sheet}>
          <LinearGradient colors={GRADIENT_VIBRANT} style={styles.header}>
            <View style={styles.shine} />
            <View style={styles.headerRow}>
              <View style={styles.headerIcon}>
                <MaterialCommunityIcons name="plus" size={22} color={WHITE} />
              </View>
              <Text style={styles.headerTitle}>Add Order</Text>
              <TouchableOpacity
                style={styles.closeButton}
                activeOpacity={0.85}
                onPress={handleClose}
              >
                <MaterialCommunityIcons name="close" size={20} color={WHITE} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionLabel}>Customer</Text>
            <View style={[styles.inputField, errors.name && styles.inputError]}>
              <MaterialCommunityIcons name="account-outline" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Customer name"
                placeholderTextColor={TEXT_MUTED}
                autoCapitalize="words"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <View style={[styles.inputField, errors.phone && styles.inputError]}>
              <MaterialCommunityIcons name="phone-outline" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone (optional)"
                placeholderTextColor={TEXT_MUTED}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            <Text style={styles.sectionLabel}>Pickup</Text>
            <View style={[styles.inputField, errors.pickupAddress && styles.inputError]}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.input}
                value={pickupAddress}
                onChangeText={setPickupAddress}
                placeholder="Pickup address"
                placeholderTextColor={TEXT_MUTED}
              />
            </View>
            {errors.pickupAddress && (
              <Text style={styles.errorText}>{errors.pickupAddress}</Text>
            )}

            <View style={styles.rowTwo}>
              <View style={[styles.inputField, styles.rowTwoItem, errors.pickupDate && styles.inputError]}>
                <MaterialCommunityIcons name="calendar-outline" size={18} color={TEXT_MUTED} />
                <TextInput
                  style={styles.input}
                  value={pickupDate}
                  onChangeText={setPickupDate}
                  placeholder="Date"
                  placeholderTextColor={TEXT_MUTED}
                />
              </View>
              <View style={[styles.inputField, styles.rowTwoItem, errors.pickupTime && styles.inputError]}>
                <MaterialCommunityIcons name="clock-outline" size={18} color={TEXT_MUTED} />
                <TextInput
                  style={styles.input}
                  value={pickupTime}
                  onChangeText={setPickupTime}
                  placeholder="Time"
                  placeholderTextColor={TEXT_MUTED}
                />
              </View>
            </View>
            {(errors.pickupDate || errors.pickupTime) && (
              <Text style={styles.errorText}>
                {errors.pickupDate || errors.pickupTime}
              </Text>
            )}

            <Text style={styles.sectionLabel}>Delivery</Text>
            <View style={[styles.inputField, errors.deliveryAddress && styles.inputError]}>
              <MaterialCommunityIcons name="home-variant-outline" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.input}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                placeholder="Delivery address"
                placeholderTextColor={TEXT_MUTED}
              />
            </View>
            {errors.deliveryAddress && (
              <Text style={styles.errorText}>{errors.deliveryAddress}</Text>
            )}

            <Text style={styles.sectionLabel}>Driver</Text>
            <View style={styles.driverWrap}>
              {drivers.length === 0 ? (
                <View style={[styles.inputField, errors.driver && styles.inputError]}>
                  <MaterialCommunityIcons name="account-tie-outline" size={18} color={TEXT_MUTED} />
                  <TextInput
                    style={styles.input}
                    value={driver}
                    onChangeText={setDriver}
                    placeholder="Assigned driver"
                    placeholderTextColor={TEXT_MUTED}
                  />
                </View>
              ) : (
                drivers.map((d) => {
                  const selected = driver === d.name;
                  return (
                    <TouchableOpacity
                      key={d.id}
                      style={[styles.driverChip, selected && styles.driverChipActive]}
                      activeOpacity={0.85}
                      onPress={() => {
                        setDriver(selected ? '' : d.name);
                        setDriverPhone(selected ? '' : d.phone);
                      }}
                    >
                      {selected ? (
                        <LinearGradient colors={GRADIENT_VIBRANT} style={styles.driverChipGradient}>
                          <MaterialCommunityIcons name="check" size={14} color={WHITE} />
                          <Text style={styles.driverChipTextActive}>{d.name}</Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.driverChipInner}>
                          <MaterialCommunityIcons name="account-tie-outline" size={14} color={BLUE} />
                          <Text style={styles.driverChipText}>{d.name}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
            {errors.driver && <Text style={styles.errorText}>{errors.driver}</Text>}

            <Text style={styles.sectionLabel}>Items</Text>
            <View style={styles.presetWrap}>
              {PRESET_ITEMS.map((preset) => (
                <TouchableOpacity
                  key={preset.name}
                  style={styles.presetChip}
                  activeOpacity={0.85}
                  onPress={() => addPreset(preset)}
                >
                  <MaterialCommunityIcons name={preset.icon} size={14} color={BLUE} />
                  <Text style={styles.presetText}>{preset.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customWrap}>
              <View style={[styles.inputField, styles.customNameField, customError && styles.inputError]}>
                <MaterialCommunityIcons name="creation-outline" size={18} color={TEXT_MUTED} />
                <TextInput
                  style={styles.input}
                  value={customName}
                  onChangeText={setCustomName}
                  placeholder="Custom item name"
                  placeholderTextColor={TEXT_MUTED}
                />
              </View>
              <View style={[styles.inputField, styles.customPriceField, customError && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  value={customPrice}
                  onChangeText={setCustomPrice}
                  placeholder="Price"
                  placeholderTextColor={TEXT_MUTED}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity
                style={styles.customAddButton}
                activeOpacity={0.85}
                onPress={addCustomItem}
              >
                <LinearGradient colors={GRADIENT_VIBRANT} style={styles.customAddGradient}>
                  <MaterialCommunityIcons name="plus" size={16} color={WHITE} />
                  <Text style={styles.customAddText}>Add</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {customError && <Text style={styles.errorText}>{customError}</Text>}

            {items.map((item) => (
              <View key={item.name} style={styles.itemRow}>
                <View style={styles.itemIcon}>
                  <MaterialCommunityIcons name="shopping-outline" size={15} color={BLUE} />
                </View>
                <View style={styles.itemBody}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    {formatMoney(item.price)} each
                  </Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepButton}
                    activeOpacity={0.85}
                    onPress={() => changeQty(item.name, -1)}
                  >
                    <MaterialCommunityIcons name="minus" size={15} color={TEXT_DARK} />
                  </TouchableOpacity>
                  <Text style={styles.stepQty}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.stepButton}
                    activeOpacity={0.85}
                    onPress={() => changeQty(item.name, 1)}
                  >
                    <MaterialCommunityIcons name="plus" size={15} color={TEXT_DARK} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemLineTotal}>
                  {formatMoney(item.price * item.quantity)}
                </Text>
              </View>
            ))}
            {errors.items && <Text style={styles.errorText}>{errors.items}</Text>}

            <Text style={styles.sectionLabel}>Payment</Text>
            <View style={styles.paymentRow}>
              {PAYMENT_METHODS.map((method) => {
                const selected = paymentMethod === method;
                return (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.paymentChip,
                      selected && styles.paymentChipActive,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => setPaymentMethod(method)}
                  >
                    {selected && (
                      <LinearGradient
                        colors={GRADIENT_VIBRANT}
                        style={styles.paymentChipGradient}
                      >
                        <Text style={styles.paymentTextActive}>{method}</Text>
                      </LinearGradient>
                    )}
                    {!selected && <Text style={styles.paymentText}>{method}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>Special instructions</Text>
            <View style={styles.textAreaField}>
              <TextInput
                style={styles.textArea}
                value={instructions}
                onChangeText={setInstructions}
                placeholder="Optional notes for the driver"
                placeholderTextColor={TEXT_MUTED}
                multiline
              />
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Order total</Text>
              <Text style={styles.summaryValue}>
                {formatMoney(
                  items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  ) + deliveryFee
                )}
              </Text>
            </View>

            <TouchableOpacity style={styles.saveTouch} activeOpacity={0.9} onPress={handleSubmit}>
              <LinearGradient colors={GRADIENT_VIBRANT} style={styles.saveButton}>
                <MaterialCommunityIcons name="check" size={18} color={WHITE} />
                <Text style={styles.saveText}>Create Order</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#F5F7FA',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '94%',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 90,
    height: 120,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    transform: [{ rotate: '20deg' }],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: WHITE,
    marginLeft: 12,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flexGrow: 0,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  sectionLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEAL_HEADING,
    marginBottom: 8,
    marginTop: 10,
  },
  inputField: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputError: {
    borderColor: DANGER,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: TEXT_DARK,
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: DANGER,
    marginTop: -6,
    marginBottom: 8,
  },
  rowTwo: {
    flexDirection: 'row',
  },
  rowTwoItem: {
    flex: 1,
  },
  rowTwoItemLast: {
    marginLeft: 10,
  },
  presetWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLUE_TINT,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },
  presetText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    color: BLUE,
    marginLeft: 5,
  },
  driverWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  driverChip: {
    flexDirection: 'row',
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: WHITE,
  },
  driverChipActive: {
    borderColor: 'transparent',
  },
  driverChipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  driverChipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  driverChipText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    color: BLUE,
    marginLeft: 5,
  },
  driverChipTextActive: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: WHITE,
    marginLeft: 5,
  },
  customWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  customNameField: {
    flex: 1,
    marginRight: 8,
  },
  customPriceField: {
    width: 96,
    marginLeft: 8,
  },
  customAddButton: {
    borderRadius: 14,
    marginLeft: 10,
  },
  customAddGradient: {
    height: 50,
    minWidth: 74,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  customAddText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: WHITE,
    marginLeft: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  itemIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: BLUE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBody: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_DARK,
  },
  itemPrice: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    color: TEXT_MUTED,
    marginTop: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  stepButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#F3F6F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepQty: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEXT_DARK,
    marginHorizontal: 8,
    minWidth: 16,
    textAlign: 'center',
  },
  itemLineTotal: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: TEXT_DARK,
    minWidth: 52,
    textAlign: 'right',
  },
  paymentRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  paymentChip: {
    borderRadius: 14,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: WHITE,
  },
  paymentChipActive: {
    borderColor: 'transparent',
  },
  paymentChipGradient: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_MUTED,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  paymentTextActive: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: WHITE,
  },
  textAreaField: {
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  textArea: {
    minHeight: 64,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: TEXT_DARK,
    textAlignVertical: 'top',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  summaryLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_DARK,
  },
  summaryValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: BLUE,
  },
  saveTouch: {
    borderRadius: 16,
  },
  saveButton: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  saveText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: WHITE,
    marginLeft: 8,
  },
});
