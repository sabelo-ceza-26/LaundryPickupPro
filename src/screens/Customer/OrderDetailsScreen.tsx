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
import { useOrders } from '../../context/OrdersContext';
import type { CustomerStackParamList } from '../../navigation/types';
import type { OrderStatus } from '../../data/orders';
import { isOrderActive, isOrderCancellable } from '../../data/orders';
import { formatMoney } from '../../utils/format';

type Props = NativeStackScreenProps<CustomerStackParamList, 'OrderDetails'>;

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const TEAL_TINT = '#E2ECEB';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';
const colorsDanger = '#E5484D';

const GRADIENT_TEAL = [TEAL_MID, TEAL] as const;

const statusColor: Record<OrderStatus, string> = {
  Scheduled: '#F4A928',
  'Picked Up': '#5B48F7',
  'At Laundromat': '#2E6BFF',
  'Out for Delivery': '#00A85A',
  Delivered: '#687385',
  Cancelled: '#E5484D',
};

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
        <MaterialCommunityIcons name={icon} size={18} color={TEAL} />
      </View>
      <View style={styles.detailBody}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function OrderDetailsScreen({ navigation, route }: Props) {
  const { order: initialOrder } = route.params;
  const { orders, updateOrderStatus } = useOrders();
  const order = orders.find((o) => o.id === initialOrder.id) ?? initialOrder;
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const color = statusColor[order.status];
  const active = isOrderActive(order.status);
  const cancellable = isOrderCancellable(order.status);
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleTrack = () => {
    navigation.navigate('Main', { screen: 'Track', params: { order } });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel order',
      `Are you sure you want to cancel ${order.reference}?`,
      [
        { text: 'Keep order', style: 'cancel' },
        {
          text: 'Cancel order',
          style: 'destructive',
          onPress: () => {
            updateOrderStatus(order.id, 'Cancelled');
            Alert.alert('Order cancelled', `${order.reference} has been cancelled.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BookingHeader title="Order Details" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={GRADIENT_TEAL} style={styles.hero}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name="basket-outline" size={26} color={TEAL} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroService}>{order.service}</Text>
            <Text style={styles.heroReference}>{order.reference}</Text>
          </View>
          <View style={styles.heroTotal}>
            <Text style={styles.heroTotalValue}>{formatMoney(order.total)}</Text>
            <Text style={styles.heroTotalLabel}>Total</Text>
          </View>
        </LinearGradient>

        <View style={styles.statusRow}>
          <View style={[styles.statusPill, { backgroundColor: `${color}1A` }]}>
            <MaterialCommunityIcons name="information-outline" size={16} color={color} />
            <Text style={[styles.statusText, { color }]}>{order.status}</Text>
          </View>
          <Text style={styles.placedText}>Placed {order.placedAt}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items</Text>
          {order.items.map((item, index) => (
            <View
              key={`${item.name}-${index}`}
              style={[styles.itemRow, index === order.items.length - 1 && styles.itemRowLast]}
            >
              <View style={styles.itemIcon}>
                <MaterialCommunityIcons name="tshirt-crew-outline" size={18} color={TEAL} />
              </View>
              <View style={styles.itemBody}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                {formatMoney(item.price * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.totalDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatMoney(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery fee</Text>
            <Text style={styles.totalValue}>{formatMoney(order.deliveryFee)}</Text>
          </View>
          <View style={styles.grandRow}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>{formatMoney(order.total)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Schedule &amp; Addresses</Text>
          <DetailRow
            icon="map-marker-outline"
            label="Pickup Address"
            value={order.pickupAddress}
          />
          <DetailRow
            icon="home-variant-outline"
            label="Delivery Address"
            value={order.deliveryAddress}
          />
          <DetailRow
            icon="calendar-outline"
            label="Pickup Window"
            value={order.pickupWindow}
          />
          <DetailRow
            icon="clock-outline"
            label="Delivery Window"
            value={order.deliveryWindow}
            last
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment</Text>
          <DetailRow
            icon="credit-card-outline"
            label="Payment Method"
            value={order.paymentMethod}
            last
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Special Instructions</Text>
          <Text style={styles.notesText}>
            {order.instructions || 'No special instructions added.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {active && (
          <TouchableOpacity
            style={[styles.footerButton, styles.primaryButtonTouch]}
            activeOpacity={0.9}
            onPress={handleTrack}
          >
            <LinearGradient colors={GRADIENT_TEAL} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Track Order</Text>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color={WHITE} />
            </LinearGradient>
          </TouchableOpacity>
        )}
        {cancellable && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scroll: {
    backgroundColor: '#F7F9FB',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    marginBottom: 14,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
    marginLeft: 14,
  },
  heroService: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: WHITE,
  },
  heroReference: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  heroTotal: {
    alignItems: 'flex-end',
  },
  heroTotalValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: WHITE,
  },
  heroTotalLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  statusText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    marginLeft: 6,
  },
  placedText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEXT_DARK,
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F4',
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: TEAL_TINT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBody: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_DARK,
  },
  itemQty: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 1,
  },
  itemPrice: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEXT_DARK,
  },
  totalDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
  },
  totalValue: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_DARK,
  },
  grandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  grandLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEXT_DARK,
  },
  grandValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: TEAL,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F4',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: TEAL_TINT,
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
  notesText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: TEXT_DARK,
    paddingVertical: 8,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footerButton: {
    marginBottom: 10,
  },
  primaryButtonTouch: {
    borderRadius: 18,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 18,
    elevation: 4,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  primaryButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: WHITE,
    marginRight: 8,
  },
  cancelButton: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colorsDanger,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: colorsDanger,
  },
});
