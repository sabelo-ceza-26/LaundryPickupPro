import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AdminStackParamList } from '../../navigation/AdminNavigator';

type Props = NativeStackScreenProps<AdminStackParamList, 'Orders'>;

type OrderStatus = 'Pending' | 'In Progress' | 'Completed';

type FilterOption = 'All' | OrderStatus;

type Order = {
  id: string;
  customerName: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupDate: string;
  pickupTime: string;
  driver: string;
  amount: string;
  status: OrderStatus;
};

const FILTERS: FilterOption[] = [
  'All',
  'Pending',
  'In Progress',
  'Completed',
];

const orders: Order[] = [
  {
    id: '#SUD-9020',
    customerName: 'Sarah Jenkins',
    pickupAddress: '14 Adderley Street, Maitland',
    deliveryAddress: '14 Adderley Street, Maitland',
    pickupDate: 'Tue, July 27',
    pickupTime: '09:00 AM',
    driver: 'Sipho Nkosi',
    amount: 'R245.00',
    status: 'Pending',
  },
  {
    id: '#SUD-9021',
    customerName: 'David Mokoena',
    pickupAddress: '45 Regent Road, Woodstock',
    deliveryAddress: '45 Regent Road, Woodstock',
    pickupDate: 'Tue, July 27',
    pickupTime: '10:30 AM',
    driver: 'Thabo Dube',
    amount: 'R189.50',
    status: 'In Progress',
  },
  {
    id: '#SUD-9022',
    customerName: 'Thabelo Cele',
    pickupAddress: '22 Main Road, Observatory',
    deliveryAddress: '22 Main Road, Observatory',
    pickupDate: 'Tue, July 27',
    pickupTime: '11:00 AM',
    driver: 'Amina Jaffer',
    amount: 'R320.00',
    status: 'Completed',
  },
  {
    id: '#SUD-9023',
    customerName: 'Matthew Yako',
    pickupAddress: '173 Sir Lowry Road, Woodstock',
    deliveryAddress: '45 Regent Road, Sea Point',
    pickupDate: 'Tue, July 28',
    pickupTime: '10:30 AM',
    driver: 'David Mthembu',
    amount: 'R220.00',
    status: 'Pending',
  },
  {
    id: '#SUD-9024',
    customerName: 'Andiswa Gumede',
    pickupAddress: '10 Station Road, Maitland',
    deliveryAddress: '90 Albert Road, Woodstock',
    pickupDate: 'Tue, July 28',
    pickupTime: '12:00 PM',
    driver: 'Sipho Nkosi',
    amount: 'R150.00',
    status: 'In Progress',
  },
  {
    id: '#SUD-9025',
    customerName: 'Sarah Lee',
    pickupAddress: '17 Kloof Street, Gardens',
    deliveryAddress: '17 Kloof Street, Gardens',
    pickupDate: 'Tue, July 28',
    pickupTime: '01:30 PM',
    driver: 'Amina Jaffer',
    amount: 'R120.00',
    status: 'Completed',
  },
  {
    id: '#SUD-9026',
    customerName: 'Naledi Nkosi',
    pickupAddress: '24 Long Street, Cape Town',
    deliveryAddress: '24 Long Street, Cape Town',
    pickupDate: 'Wed, July 29',
    pickupTime: '08:30 AM',
    driver: 'Thabo Dube',
    amount: 'R275.00',
    status: 'Completed',
  },
  {
    id: '#SUD-9027',
    customerName: 'John Adams',
    pickupAddress: '62 Victoria Road, Woodstock',
    deliveryAddress: '62 Victoria Road, Woodstock',
    pickupDate: 'Wed, July 29',
    pickupTime: '09:15 AM',
    driver: 'David Mthembu',
    amount: 'R195.00',
    status: 'Pending',
  },
  {
    id: '#SUD-9028',
    customerName: 'Fatima Daniels',
    pickupAddress: '18 Lower Main Road, Observatory',
    deliveryAddress: '18 Lower Main Road, Observatory',
    pickupDate: 'Wed, July 29',
    pickupTime: '10:00 AM',
    driver: 'Sipho Nkosi',
    amount: 'R285.00',
    status: 'In Progress',
  },
  {
    id: '#SUD-9029',
    customerName: 'Jason Williams',
    pickupAddress: '30 Beach Road, Sea Point',
    deliveryAddress: '30 Beach Road, Sea Point',
    pickupDate: 'Wed, July 29',
    pickupTime: '11:30 AM',
    driver: 'Amina Jaffer',
    amount: 'R340.00',
    status: 'Completed',
  },
  {
    id: '#SUD-9030',
    customerName: 'Lerato Molefe',
    pickupAddress: '15 Roodebloem Road, Woodstock',
    deliveryAddress: '15 Roodebloem Road, Woodstock',
    pickupDate: 'Thu, July 30',
    pickupTime: '08:00 AM',
    driver: 'Thabo Dube',
    amount: 'R175.00',
    status: 'Completed',
  },
  {
    id: '#SUD-9031',
    customerName: 'Michael Jacobs',
    pickupAddress: '54 Voortrekker Road, Maitland',
    deliveryAddress: '54 Voortrekker Road, Maitland',
    pickupDate: 'Thu, July 30',
    pickupTime: '09:45 AM',
    driver: 'David Mthembu',
    amount: 'R210.00',
    status: 'Pending',
  },
  {
    id: '#SUD-9032',
    customerName: 'Zainab Khan',
    pickupAddress: '11 Durham Avenue, Woodstock',
    deliveryAddress: '11 Durham Avenue, Woodstock',
    pickupDate: 'Thu, July 30',
    pickupTime: '11:00 AM',
    driver: 'Sipho Nkosi',
    amount: 'R260.00',
    status: 'Pending',
  },
  {
    id: '#SUD-9033',
    customerName: 'Emma Brown',
    pickupAddress: '92 Main Road, Maitland',
    deliveryAddress: '92 Main Road, Maitland',
    pickupDate: 'Thu, July 30',
    pickupTime: '12:30 PM',
    driver: 'Amina Jaffer',
    amount: 'R310.00',
    status: 'In Progress',
  },
  {
    id: '#SUD-9034',
    customerName: 'Tariq Abrahams',
    pickupAddress: '25 Church Street, Woodstock',
    deliveryAddress: '25 Church Street, Woodstock',
    pickupDate: 'Fri, July 31',
    pickupTime: '09:00 AM',
    driver: 'Thabo Dube',
    amount: 'R145.00',
    status: 'Completed',
  },
  {
    id: '#SUD-9035',
    customerName: 'Jessica Moore',
    pickupAddress: '101 St Marks Road, Observatory',
    deliveryAddress: '101 St Marks Road, Observatory',
    pickupDate: 'Fri, July 31',
    pickupTime: '10:15 AM',
    driver: 'David Mthembu',
    amount: 'R230.00',
    status: 'In Progress',
  },
];

export default function OrdersScreen({ navigation }: Props) {
  const [selectedFilter, setSelectedFilter] =
    useState<FilterOption>('All');
  const [searchText, setSearchText] = useState('');

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesFilter =
        selectedFilter === 'All' ||
        order.status === selectedFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.customerName.toLowerCase().includes(normalizedSearch) ||
        order.pickupAddress.toLowerCase().includes(normalizedSearch) ||
        order.deliveryAddress.toLowerCase().includes(normalizedSearch) ||
        order.driver.toLowerCase().includes(normalizedSearch) ||
        order.status.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [searchText, selectedFilter]);

  const getStatusContainerStyle = (status: OrderStatus) => {
    if (status === 'Pending') {
      return styles.pendingBadge;
    }

    if (status === 'In Progress') {
      return styles.inProgressBadge;
    }

    return styles.completedBadge;
  };

  const getStatusTextStyle = (status: OrderStatus) => {
    if (status === 'Pending') {
      return styles.pendingText;
    }

    if (status === 'In Progress') {
      return styles.inProgressText;
    }

    return styles.completedText;
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.orderCard}
      onPress={() =>
        Alert.alert(
          item.id,
          `${item.customerName}\n\nDriver: ${item.driver}\nStatus: ${item.status}\nTotal: ${item.amount}`
        )
      }
    >
      <View style={styles.cardTopRow}>
        <Text style={styles.orderId}>{item.id}</Text>

        <View
          style={[
            styles.statusBadge,
            getStatusContainerStyle(item.status),
          ]}
        >
          <Text style={getStatusTextStyle(item.status)}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.customerName}>{item.customerName}</Text>

      <View style={styles.addressSection}>
        <Text style={styles.addressText}>
          Pickup: {item.pickupAddress}
        </Text>

        <Text style={styles.addressText}>
          Deliver: {item.deliveryAddress}
        </Text>
      </View>

      <Text style={styles.driverText}>
        Driver: {item.driver}
      </Text>

      <View style={styles.divider} />

      <View style={styles.cardBottomRow}>
        <Text style={styles.dateText}>
          {item.pickupDate} · {item.pickupTime}
        </Text>

        <Text style={styles.amount}>{item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>‹</Text>
              </TouchableOpacity>

              <Text style={styles.title}>Orders</Text>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  Alert.alert(
                    'Add Order',
                    'Order will be added.'
                  )
                }
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search orders..."
                placeholderTextColor="#98A1AE"
                autoCapitalize="none"
              />

              <Text style={styles.searchIcon}>⌕</Text>
            </View>

            <View style={styles.filtersRow}>
              {FILTERS.map((filter) => {
                const isSelected = selectedFilter === filter;

                return (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterButton,
                      isSelected && styles.selectedFilterButton,
                    ]}
                    onPress={() => setSelectedFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        isSelected && styles.selectedFilterText,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.resultText}>
              {filteredOrders.length}{' '}
              {filteredOrders.length === 1 ? 'order' : 'orders'} found
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No orders found
            </Text>

            <Text style={styles.emptyText}>
              Try another search term or filter.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    color: '#173D8F',
    fontSize: 38,
    lineHeight: 38,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#12263A',
  },

  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#173D8F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
  },

  searchContainer: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D5DAE1',
    paddingLeft: 18,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    color: '#12263A',
    fontSize: 15,
  },

  searchIcon: {
    color: '#111827',
    fontSize: 25,
  },

  filtersRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  filterButton: {
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#DCE1E8',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },

  selectedFilterButton: {
    backgroundColor: '#173D8F',
    borderColor: '#173D8F',
  },

  filterText: {
    color: '#667085',
    fontSize: 11,
    fontWeight: '500',
  },

  selectedFilterText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  resultText: {
    fontSize: 12,
    color: '#87909C',
    marginBottom: 10,
    marginLeft: 2,
  },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#12263A',
  },

  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B3A',
    marginTop: 8,
  },

  addressSection: {
    marginTop: 6,
  },

  addressText: {
    color: '#7C8795',
    fontSize: 11,
    lineHeight: 17,
  },

  driverText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#EDF0F3',
    marginTop: 10,
    marginBottom: 9,
  },

  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateText: {
    color: '#87909C',
    fontSize: 10,
  },

  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#12263A',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  pendingBadge: {
    backgroundColor: '#FFF0B8',
  },

  inProgressBadge: {
    backgroundColor: '#E4EEFF',
  },

  completedBadge: {
    backgroundColor: '#DDF8E8',
  },

  pendingText: {
    color: '#E19A00',
    fontSize: 10,
    fontWeight: '600',
  },

  inProgressText: {
    color: '#3278F6',
    fontSize: 10,
    fontWeight: '600',
  },

  completedText: {
    color: '#00A85A',
    fontSize: 10,
    fontWeight: '600',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 70,
  },

  emptyTitle: {
    color: '#12263A',
    fontSize: 18,
    fontWeight: '700',
  },

  emptyText: {
    color: '#87909C',
    fontSize: 13,
    marginTop: 6,
  },
});