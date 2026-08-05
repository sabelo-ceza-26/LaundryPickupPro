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

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const TEAL_TINT = '#E2ECEB';
const ICON_DARK = '#2B3642';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';

const GRADIENT_TEAL = [TEAL_MID, TEAL] as const;

type FilterKey = 'All' | 'Active' | 'Completed' | 'Cancelled';

const FILTERS: FilterKey[] = ['All', 'Active', 'Completed', 'Cancelled'];

const statusColor: Record<OrderStatus, string> = {
  Scheduled: '#F4A928',
  'Picked Up': '#5B48F7',
  'At Laundromat': '#2E6BFF',
  'Out for Delivery': '#00A85A',
  Delivered: '#687385',
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
          <Text style={styles.cardTotal}>{formatMoney(order.total)}</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.navigate('Notifications')}
        >
          <MaterialCommunityIcons name="bell-outline" size={22} color={ICON_DARK} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <MaterialCommunityIcons name="magnify" size={20} color={TEXT_MUTED} />
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
              <Text
                style={[styles.filterText, active && styles.filterTextActive]}
              >
                {item}
              </Text>
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
            <MaterialCommunityIcons
              name="receipt-text-outline"
              size={52}
              color={TEAL_TINT}
            />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different filter or book a new pickup.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Book')}
            >
              <LinearGradient colors={GRADIENT_TEAL} style={styles.emptyButtonGradient}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: TEXT_DARK,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F6F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F9',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    marginHorizontal: 20,
    marginBottom: 14,
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F6F9',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: TEAL,
  },
  filterText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_MUTED,
  },
  filterTextActive: {
    color: WHITE,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
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
    color: TEAL,
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
  cardTotal: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: TEXT_DARK,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
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
