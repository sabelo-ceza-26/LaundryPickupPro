import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { useOrders } from '../../context/OrdersContext';
import type { CustomerTabNavigation } from '../../navigation/types';
import type { CustomerOrder, OrderStatus } from '../../data/orders';
import { isOrderActive } from '../../data/orders';
import { formatMoney } from '../../utils/format';

const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const PURPLE = '#7857FF';
const TEAL_HEADING = '#0E7A86';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';

const GRADIENT_VIBRANT = [BLUE, PURPLE] as const;

type FilterKey = 'All' | 'Active' | 'Completed' | 'Cancelled';

const FILTERS: FilterKey[] = ['All', 'Active', 'Completed', 'Cancelled'];

const statusColor: Record<OrderStatus, string> = {
  Scheduled: '#E8960C',
  'Picked Up': '#7857FF',
  'At Laundromat': '#2E6BFF',
  'Out for Delivery': '#00A85A',
  Delivered: '#0E9AA7',
  Cancelled: '#E5484D',
};

const statusIcon: Record<OrderStatus, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Scheduled: 'calendar-clock',
  'Picked Up': 'truck-check-outline',
  'At Laundromat': 'storefront-outline',
  'Out for Delivery': 'truck-delivery-outline',
  Delivered: 'package-variant-closed-check',
  Cancelled: 'close-circle-outline',
};

function matchesFilter(order: CustomerOrder, filter: FilterKey): boolean {
  switch (filter) {
    case 'Active':
      return isOrderActive(order.status);
    case 'Completed':
      return order.status === 'Delivered';
    case 'Cancelled':
      return order.status === 'Cancelled';
    default:
      return true;
  }
}

type OrderCardProps = {
  order: CustomerOrder;
  onPress: () => void;
};

function OrderCard({ order, onPress }: OrderCardProps) {
  const color = statusColor[order.status];
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={[styles.cardAccent, { backgroundColor: color }]} />
      <View style={[styles.cardIcon, { backgroundColor: `${color}1A` }]}>
        <MaterialCommunityIcons name={statusIcon[order.status]} size={24} color={color} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardReference}>{order.reference}</Text>
          <View style={[styles.statusPill, { backgroundColor: `${color}1A` }]}>
            <Text style={[styles.statusText, { color }]}>{order.status}</Text>
          </View>
        </View>
        <Text style={styles.cardService}>{order.service}</Text>
        <Text style={styles.cardAddress} numberOfLines={1}>
          {order.pickupAddress}
        </Text>
        <View style={styles.cardBottomRow}>
          <Text style={styles.cardDate}>{order.placedAt}</Text>
          <View style={[styles.cardTotalChip, { backgroundColor: `${color}1A` }]}>
            <Text style={[styles.cardTotal, { color }]}>{formatMoney(order.total)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function OrderHistoryScreen() {
  const { orders } = useOrders();
  const navigation = useNavigation<CustomerTabNavigation>();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [filter, setFilter] = useState<FilterKey>('All');
  const [searchText, setSearchText] = useState('');

  const filteredOrders = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return orders.filter(
      (order) =>
        matchesFilter(order, filter) &&
        (query.length === 0 ||
          order.reference.toLowerCase().includes(query) ||
          order.pickupAddress.toLowerCase().includes(query) ||
          order.deliveryAddress.toLowerCase().includes(query))
    );
  }, [orders, filter, searchText]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={GRADIENT_VIBRANT} style={styles.headerBanner}>
        <View style={styles.shine} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialCommunityIcons name="bell-outline" size={22} color={WHITE} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchWrap}>
        <View style={styles.searchIconChip}>
          <MaterialCommunityIcons name="magnify" size={18} color={BLUE} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by reference or address"
          placeholderTextColor={TEXT_MUTED}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <MaterialCommunityIcons name="close-circle" size={18} color={TEXT_MUTED} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const active = filter === item;
          return (
            <TouchableOpacity
              key={item}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setFilter(item)}
            >
              {active ? (
                <LinearGradient
                  colors={GRADIENT_VIBRANT}
                  style={styles.filterChipActiveGradient}
                >
                  <Text style={[styles.filterText, styles.filterTextActive]}>{item}</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.filterText}>{item}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons
                name="receipt-text-outline"
                size={52}
                color={BLUE}
              />
            </View>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different filter or book a new pickup.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Book')}
            >
              <LinearGradient colors={GRADIENT_VIBRANT} style={styles.emptyButtonGradient}>
                <Text style={styles.emptyButtonText}>Book a Pickup</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderDetails', { order: item })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  headerBanner: {
    marginBottom: 14,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: WHITE,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingHorizontal: 10,
    height: 50,
    marginHorizontal: 20,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  searchIconChip: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: BLUE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: TEXT_DARK,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  filterChip: {
    borderRadius: 20,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: WHITE,
  },
  filterChipActive: {
    borderColor: 'transparent',
  },
  filterChipActiveGradient: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_MUTED,
    paddingHorizontal: 15,
    paddingVertical: 8,
    textAlign: 'center',
  },
  filterTextActive: {
    color: WHITE,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardAccent: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginRight: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardReference: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEAL_HEADING,
    letterSpacing: 0.3,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
  },
  cardService: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: TEXT_DARK,
    marginTop: 4,
  },
  cardAddress: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cardDate: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
  },
  cardTotalChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardTotal: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    color: TEXT_DARK,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: BLUE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
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
