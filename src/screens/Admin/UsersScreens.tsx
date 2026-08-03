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

type Props = NativeStackScreenProps<AdminStackParamList, 'Users'>;

type Customer = {
  id: string;
  initials: string;
  name: string;
  phone: string;
  totalOrders: number;
  joinedDate: string;
  badgeColor: string;
  initialsColor: string;
};

const customers: Customer[] = [
  {
    id: '1',
    initials: 'SJ',
    name: 'Sarah Jenkins',
    phone: '+27 82 123 4567',
    totalOrders: 12,
    joinedDate: 'Joined Jul 2024',
    badgeColor: '#E8F2FF',
    initialsColor: '#3678E5',
  },
  {
    id: '2',
    initials: 'DM',
    name: 'David Mokoena',
    phone: '+27 73 987 6543',
    totalOrders: 8,
    joinedDate: 'Joined Jun 2024',
    badgeColor: '#FFF1D6',
    initialsColor: '#E89A12',
  },
  {
    id: '3',
    initials: 'TC',
    name: 'Thabo Cele',
    phone: '+27 81 555 0192',
    totalOrders: 15,
    joinedDate: 'Joined Mar 2024',
    badgeColor: '#E7F8EE',
    initialsColor: '#21A86A',
  },
  {
    id: '4',
    initials: 'NN',
    name: 'Naledi Ndlovu',
    phone: '+27 64 333 4455',
    totalOrders: 4,
    joinedDate: 'Joined Aug 2024',
    badgeColor: '#F0E9FF',
    initialsColor: '#7958D5',
  },
  {
    id: '5',
    initials: 'FA',
    name: 'Fatima Adams',
    phone: '+27 72 448 1105',
    totalOrders: 10,
    joinedDate: 'Joined Feb 2024',
    badgeColor: '#FFE8EF',
    initialsColor: '#D95B82',
  },
  {
    id: '6',
    initials: 'JW',
    name: 'Jason Williams',
    phone: '+27 79 221 8740',
    totalOrders: 6,
    joinedDate: 'Joined Sep 2024',
    badgeColor: '#E9F7F8',
    initialsColor: '#228A92',
  },
  {
    id: '7',
    initials: 'LK',
    name: 'Lerato Khumalo',
    phone: '+27 61 882 6301',
    totalOrders: 9,
    joinedDate: 'Joined May 2024',
    badgeColor: '#FFF4E5',
    initialsColor: '#D78624',
  },
];

export default function UsersScreen({ navigation }: Props) {
  const [searchText, setSearchText] = useState('');

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.phone.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [searchText]);

  const renderCustomer = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.customerRow}
      activeOpacity={0.8}
      onPress={() =>
        Alert.alert(
          item.name,
          `${item.phone}\n${item.totalOrders} orders\n${item.joinedDate}`
        )
      }
    >
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: item.badgeColor,
          },
        ]}
      >
        <Text
          style={[
            styles.avatarText,
            {
              color: item.initialsColor,
            },
          ]}
        >
          {item.initials}
        </Text>
      </View>

      <View style={styles.customerDetails}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.phoneNumber}>{item.phone}</Text>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.totalOrders}>
          {item.totalOrders} Orders
        </Text>
        <Text style={styles.joinedDate}>{item.joinedDate}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={renderCustomer}
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

              <Text style={styles.title}>Customers</Text>

              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Add Customer',
                    'The add-customer form will be connected here.'
                  )
                }
              >
                <Text style={styles.addCustomer}>Add Customer</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>⌕</Text>

              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search customers..."
                placeholderTextColor="#98A1AE"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.resultsText}>
              {filteredCustomers.length}{' '}
              {filteredCustomers.length === 1
                ? 'customer'
                : 'customers'}
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No customers found
            </Text>

            <Text style={styles.emptyText}>
              Try searching for another name or phone number.
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
    backgroundColor: '#FFFFFF',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  backButton: {
    width: 34,
    height: 40,
    justifyContent: 'center',
  },

  backButtonText: {
    fontSize: 34,
    color: '#173D8F',
    lineHeight: 34,
  },

  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#12263A',
  },

  addCustomer: {
    fontSize: 12,
    fontWeight: '600',
    color: '#173D8F',
  },

  searchContainer: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#D8DEE6',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  searchIcon: {
    fontSize: 22,
    color: '#8A94A3',
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#12263A',
  },

  resultsText: {
    fontSize: 11,
    color: '#98A1AE',
    marginBottom: 8,
  },

  customerRow: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F5',
    paddingVertical: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    fontSize: 13,
    fontWeight: '700',
  },

  customerDetails: {
    flex: 1,
  },

  customerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#12263A',
  },

  phoneNumber: {
    marginTop: 4,
    fontSize: 11,
    color: '#7F8997',
  },

  orderDetails: {
    alignItems: 'flex-end',
  },

  totalOrders: {
    fontSize: 12,
    fontWeight: '700',
    color: '#173D8F',
  },

  joinedDate: {
    marginTop: 4,
    fontSize: 9,
    color: '#98A1AE',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 70,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#12263A',
  },

  emptyText: {
    marginTop: 6,
    fontSize: 12,
    color: '#87909C',
    textAlign: 'center',
  },
});