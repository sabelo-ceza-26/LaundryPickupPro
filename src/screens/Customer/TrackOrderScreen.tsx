import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { useOrders } from '../../context/OrdersContext';
import type { CustomerTabNavigation, CustomerTabParamList } from '../../navigation/types';
import { ORDER_STEPS, isOrderActive, orderStepIndex, type OrderStatus } from '../../data/orders';
import { formatMoney } from '../../utils/format';

type TrackRoute = RouteProp<CustomerTabParamList, 'Track'>;

const PURPLE_DARK = '#5B21B6';
const PURPLE_MID = '#7C3AED';
const PURPLE_TINT = '#EFEAFB';
const GOLD = '#F59E0B';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E6E0F5';
const BG = '#F6F4FB';
const WHITE = '#FFFFFF';

const GRADIENT_HEADER = ['#6D28D9', '#4C1D95'] as const;

const DEFAULT_LAT = -33.9359;
const DEFAULT_LNG = 18.4632;

const statusColor: Record<OrderStatus, string> = {
  Scheduled: GOLD,
  'Picked Up': '#8B5CF6',
  'At Laundromat': '#2563EB',
  'Out for Delivery': '#F97316',
  Delivered: '#9CA3AF',
  Cancelled: '#E5484D',
};

const statusIcon: Record<OrderStatus, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Scheduled: 'calendar-clock',
  'Picked Up': 'package-variant-closed',
  'At Laundromat': 'storefront-outline',
  'Out for Delivery': 'truck-fast-outline',
  Delivered: 'check-circle-outline',
  Cancelled: 'close-circle-outline',
};

export default function TrackOrderScreen() {
  const { orders } = useOrders();
  const navigation = useNavigation<CustomerTabNavigation>();
  const route = useRoute<TrackRoute>();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const activeOrders = useMemo(() => orders.filter((o) => isOrderActive(o.status)), [orders]);

  const [selectedId, setSelectedId] = useState<string | null>(
    route.params?.order?.id ?? activeOrders[0]?.id ?? null
  );

  useEffect(() => {
    if (route.params?.order?.id) {
      setSelectedId(route.params.order.id);
    }
  }, [route.params]);

  useEffect(() => {
    if (!selectedId && activeOrders.length > 0) {
      setSelectedId(activeOrders[0].id);
    }
  }, [activeOrders, selectedId]);

  const order = orders.find((o) => o.id === selectedId) ?? activeOrders[0];

  if (!fontsLoaded) return null;

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={GRADIENT_HEADER} style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() =>
              navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')
            }
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Order</Text>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialCommunityIcons name="bell-outline" size={22} color={WHITE} />
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.empty}>
          <MaterialCommunityIcons name="map-marker-off-outline" size={52} color={PURPLE_TINT} />
          <Text style={styles.emptyTitle}>No active orders</Text>
          <Text style={styles.emptySubtitle}>
            Your active orders will show here. Book a pickup to get started.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Book')}
          >
            <LinearGradient colors={GRADIENT_HEADER} style={styles.emptyButtonGradient}>
              <Text style={styles.emptyButtonText}>Book a Pickup</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const stepIndex = orderStepIndex(order.status);
  const isDelivered = order.status === 'Delivered';
  const callDriver = () => {
    if (!order.driverPhone) return;
    Linking.openURL(`tel:${order.driverPhone}`).catch(() => undefined);
  };

  const lat = order.deliveryLat ?? DEFAULT_LAT;
  const lng = order.deliveryLng ?? DEFAULT_LNG;
  const openMaps = () => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`).catch(
      () => undefined
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={GRADIENT_HEADER} style={styles.header}>
        <View style={styles.decorCircleOne} />
        <View style={styles.decorCircleTwo} />
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() =>
            navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')
          }
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.navigate('Notifications')}
        >
          <MaterialCommunityIcons name="bell-outline" size={22} color={WHITE} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {activeOrders.length > 1 && (
          <View>
            <Text style={styles.sectionLabel}>Select order</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.orderChips}
            >
              {activeOrders.map((item) => {
                const active = item.id === order.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.orderChip, active && styles.orderChipActive]}
                    onPress={() => setSelectedId(item.id)}
                  >
                    <Text
                      style={[styles.orderChipText, active && styles.orderChipTextActive]}
                    >
                      {item.reference}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.orderCard}>
          <View style={styles.orderIcon}>
            <MaterialCommunityIcons
              name={statusIcon[order.status]}
              size={26}
              color={statusColor[order.status]}
            />
          </View>
          <View style={styles.orderBody}>
            <Text style={styles.orderReference}>{order.reference}</Text>
            <Text style={styles.orderAddress} numberOfLines={1}>
              {order.deliveryAddress}
            </Text>
          </View>
          <View style={styles.orderRight}>
            <View
              style={[styles.statusPill, { backgroundColor: `${statusColor[order.status]}1A` }]}
            >
              <View style={[styles.statusDot, { backgroundColor: statusColor[order.status] }]} />
              <Text style={[styles.orderStatusText, { color: statusColor[order.status] }]}>
                {order.status}
              </Text>
            </View>
            <Text style={styles.orderTotal}>{formatMoney(order.total)}</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.92} onPress={openMaps}>
          <View style={styles.mapCard}>
            <View style={styles.mapCanvas}>
              <Image
                source={require('../../../assets/delivery-map.png')}
                style={styles.mapImage}
                resizeMode="cover"
              />
              <View style={styles.mapPin}>
                <MaterialCommunityIcons name="map-marker" size={44} color={GOLD} />
              </View>
              <View style={styles.mapAddressTag}>
                <Text style={styles.mapAddressText} numberOfLines={1}>
                  {order.deliveryAddress}
                </Text>
              </View>
              <Text style={styles.mapAttribution}>© OpenStreetMap contributors</Text>
            </View>
            <View style={styles.mapFooter}>
              <MaterialCommunityIcons name="google-maps" size={20} color={PURPLE_DARK} />
              <Text style={styles.mapFooterText}>Open in Google Maps</Text>
              <MaterialCommunityIcons name="open-in-new" size={16} color={TEXT_MUTED} />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.timelineCard}>
          {ORDER_STEPS.map((step, index) => {
            const reached = index <= stepIndex;
            const isCurrent = index === stepIndex && !isDelivered;
            const isLast = index === ORDER_STEPS.length - 1;
            return (
              <View key={step.key} style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View
                    style={[
                      styles.timelineDot,
                      reached && styles.timelineDotReached,
                      isCurrent && styles.timelineDotCurrent,
                    ]}
                  >
                    {reached && !isCurrent && (
                      <MaterialCommunityIcons name="check" size={14} color={WHITE} />
                    )}
                    {isCurrent && (
                      <MaterialCommunityIcons name="truck-fast-outline" size={16} color={PURPLE_DARK} />
                    )}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        index < stepIndex && styles.timelineLineReached,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineBody}>
                  <Text
                    style={[
                      styles.timelineLabel,
                      reached && styles.timelineLabelReached,
                      isCurrent && styles.timelineLabelCurrent,
                    ]}
                  >
                    {step.label}
                  </Text>
                  {isCurrent && (
                    <Text style={styles.timelineHint}>
                      {isDelivered ? 'Delivered' : 'Your laundry is on the move'}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.driverCard}>
          <LinearGradient colors={GRADIENT_HEADER} style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>
              {(order.driver ?? '?').charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <View style={styles.driverBody}>
            <Text style={styles.driverLabel}>Your driver</Text>
            <Text style={styles.driverName}>{order.driver ?? 'Assigning a driver…'}</Text>
            {!!order.driverPhone && <Text style={styles.driverPhone}>{order.driverPhone}</Text>}
          </View>
          {!!order.driverPhone && (
            <TouchableOpacity style={styles.callButton} onPress={callDriver}>
              <MaterialCommunityIcons name="phone" size={20} color={WHITE} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.etaRow}>
          <View style={styles.etaIcon}>
            <MaterialCommunityIcons name="clock-fast" size={24} color={GOLD} />
          </View>
          <View style={styles.etaBody}>
            <Text style={styles.etaLabel}>Estimated delivery</Text>
            <Text style={styles.etaValue}>
              {isDelivered ? 'Delivered' : 'Today, 1:00 PM – 3:00 PM'}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color={TEXT_MUTED} />
        </View>

        <TouchableOpacity style={styles.helpRow} onPress={() => navigation.navigate('Support')}>
          <View style={styles.helpIcon}>
            <MaterialCommunityIcons name="headset" size={20} color={PURPLE_DARK} />
          </View>
          <Text style={styles.helpText}>Need help with this order?</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={TEXT_MUTED} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: 'hidden',
  },
  decorCircleOne: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: -70,
    right: -40,
  },
  decorCircleTwo: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -50,
    left: -30,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: WHITE,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    backgroundColor: BG,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 110,
  },
  sectionLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 8,
  },
  orderChips: {
    paddingBottom: 14,
  },
  orderChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: BORDER,
    marginRight: 8,
  },
  orderChipActive: {
    backgroundColor: PURPLE_DARK,
    borderColor: PURPLE_DARK,
  },
  orderChipText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_DARK,
  },
  orderChipTextActive: {
    color: WHITE,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 14,
    elevation: 1,
    shadowColor: '#3B1B8A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  orderIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: PURPLE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderBody: {
    flex: 1,
    marginLeft: 12,
  },
  orderReference: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: PURPLE_DARK,
  },
  orderAddress: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 3,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  orderStatusText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },
  orderTotal: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: TEXT_DARK,
    marginTop: 6,
  },
  mapCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#3B1B8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  mapCanvas: {
    height: 230,
    overflow: 'hidden',
    backgroundColor: '#E7E0F6',
  },
  mapImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -44,
  },
  mapAddressTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#3B1B8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapAddressText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: TEXT_DARK,
  },
  mapAttribution: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    color: '#6B7280',
  },
  mapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  mapFooterText: {
    flex: 1,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: PURPLE_DARK,
    marginLeft: 10,
  },
  timelineCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineRail: {
    alignItems: 'center',
    width: 30,
    marginRight: 12,
  },
  timelineDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#D5DCE3',
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotReached: {
    backgroundColor: PURPLE_DARK,
    borderColor: PURPLE_DARK,
  },
  timelineDotCurrent: {
    backgroundColor: PURPLE_TINT,
    borderColor: PURPLE_MID,
  },
  timelineLine: {
    width: 2,
    height: 34,
    backgroundColor: '#E1E7EC',
  },
  timelineLineReached: {
    backgroundColor: PURPLE_MID,
  },
  timelineBody: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 12,
  },
  timelineLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
  },
  timelineLabelReached: {
    color: TEXT_DARK,
  },
  timelineLabelCurrent: {
    fontFamily: 'Poppins_600SemiBold',
    color: PURPLE_DARK,
  },
  timelineHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: GOLD,
    marginTop: 2,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 14,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: WHITE,
  },
  driverBody: {
    flex: 1,
    marginLeft: 12,
  },
  driverLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
  },
  driverName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
    marginTop: 1,
  },
  driverPhone: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 1,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFFB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 14,
  },
  etaIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: PURPLE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  etaBody: {
    flex: 1,
    marginLeft: 12,
  },
  etaLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
  },
  etaValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
    marginTop: 1,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: PURPLE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpText: {
    flex: 1,
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_DARK,
    marginLeft: 10,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: TEXT_DARK,
    marginTop: 14,
  },
  emptySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 6,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 20,
    borderRadius: 16,
  },
  emptyButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  emptyButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: WHITE,
  },
});
