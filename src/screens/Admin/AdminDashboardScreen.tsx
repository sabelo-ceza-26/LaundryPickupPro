import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AdminStackParamList } from '../../navigation/AdminNavigator';

type Props = NativeStackScreenProps<
  AdminStackParamList,
  'Dashboard'
>;

const orders = [
    {
        id: '#SUD-9020',
        name: 'Sarah Jenkins',
        status: 'Pending',
        amount: 'R245.00'
    },
    {
        id: 'SUD-9021',
        name: 'David Mokoena', 
        status: 'In Progress',
        amount: 'R180.50'
    },
    {
        id: '#SUD-9022',
        name: 'Thabelo Cele',
        status: 'Completed',
        amount: 'R320.00',

    },
    {
        id: '#SUD-9023',
        name: 'Matthew Yako',
        status: 'Pending',
        amount: 'R220.00',
    },
    {
        id: '#SUD-9024',
        name: 'Andiswa Guemede',
        status: 'In Progress',
        amount: 'R150.00',
    },
    {
        id: '#SUD-9025',
        name: 'Sarah Lee',
        status: 'Completed',
        amount: 'R120.00',
    },

];
export default function AdminDashboardScreen({
  navigation,
}: Props) {

  const getStatusStyle = (status: string) => {
    if (status === 'Pending') {
      return styles.pendingStatus;
    }

    if (status === 'In Progress') {
      return styles.progressStatus;
    }

    return styles.completedStatus;
  };

  const getStatusTextStyle = (status: string) => {
    if (status === 'Pending') {
      return styles.pendingText;
    }

    if (status === 'In Progress') {
      return styles.progressText;
    }

    return styles.completedText;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Welcome back, Admin</Text>
          </View>

          <TouchableOpacity
  style={styles.avatar}
  onPress={() => navigation.navigate('Settings')}
>
  <Text style={styles.avatarText}>A</Text>
</TouchableOpacity>
        </View>
        <View style={styles.statsGrid}>
  <View style={styles.statCard}>
    <View style={[styles.sideLine, styles.blueLine]} />
    <Text style={styles.statLabel}>Total Orders</Text>
    <Text style={styles.statValue}>1,284</Text>
  </View>

  <View style={styles.statCard}>
    <View style={[styles.sideLine, styles.purpleLine]} />
    <Text style={styles.statLabel}>Active Drivers</Text>
    <Text style={styles.statValue}>18</Text>
  </View>

  <View style={styles.statCard}>
    <View style={[styles.sideLine, styles.orangeLine]} />
    <Text style={styles.statLabel}>Pending Pickups</Text>
    <Text style={styles.statValue}>42</Text>
  </View>

  <TouchableOpacity
  style={styles.statCard}
  onPress={() => navigation.navigate('Reports')}
>
  <View style={[styles.sideLine, styles.greenLine]} />
  <Text style={styles.statLabel}>Total Revenue</Text>
  <Text style={styles.statValue}>R42,850</Text>
</TouchableOpacity>
</View>

<TouchableOpacity
  style={styles.customersButton}
  onPress={() => navigation.navigate('Users')}
>
  <View>
    <Text style={styles.customersButtonTitle}>Customers</Text>

    <Text style={styles.customersButtonSubtitle}>
      View and manage customer accounts
    </Text>
  </View>

  <Text style={styles.customersArrow}>›</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.customersButton}
  onPress={() => navigation.navigate('Payments')}
>
  <View>
    <Text style={styles.customersButtonTitle}>
      Services & Pricing
    </Text>

    <Text style={styles.customersButtonSubtitle}>
      Manage laundry prices and delivery fees
    </Text>
  </View>

  <Text style={styles.customersArrow}>›</Text>
</TouchableOpacity>



        <View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Recent Orders</Text>

  <TouchableOpacity
    onPress={() => navigation.navigate('Orders')}
  >
    <Text style={styles.viewAll}>View All</Text>
  </TouchableOpacity>
</View>

{orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.customerName}>{order.name}</Text>
            </View>

            <View style={styles.orderRight}>
              <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
                <Text style={getStatusTextStyle(order.status)}>
                  {order.status}
                </Text>
              </View>

              <Text style={styles.amount}>{order.amount}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#12263A',
  },

  subtitle: {
    fontSize: 13,
    color: '#7A8492',
    marginTop: 3,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#173D8F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    height: 92,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },

  sideLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },

  blueLine: {
    backgroundColor: '#2E6BFF',
  },

  purpleLine: {
    backgroundColor: '#7857FF',
  },

  orangeLine: {
    backgroundColor: '#F4A928',
  },

  greenLine: {
    backgroundColor: '#00B887',
  },

  statLabel: {
    fontSize: 12,
    color: '#687385',
  },

  statValue: {
    fontSize: 23,
    fontWeight: '700',
    color: '#12263A',
    marginTop: 8,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#12263A',
  },

  viewAll: {
    fontSize: 12,
    color: '#173D8F',
    fontWeight: '600',
  },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#12263A',
  },

  customerName: {
    fontSize: 12,
    color: '#87909C',
    marginTop: 3,
  },

  orderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },

  pendingStatus: {
    backgroundColor: '#FFF0B8',
  },

  progressStatus: {
    backgroundColor: '#E4EEFF',
  },

  completedStatus: {
    backgroundColor: '#DDF8E8',
  },

  pendingText: {
    color: '#E19A00',
    fontSize: 10,
    fontWeight: '600',
  },

  progressText: {
    color: '#3278F6',
    fontSize: 10,
    fontWeight: '600',
  },

  completedText: {
    color: '#00A85A',
    fontSize: 10,
    fontWeight: '600',
  },

  amount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#12263A',
  },

  customersButton: {
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  paddingHorizontal: 16,
  paddingVertical: 15,
  marginTop: 4,
  marginBottom: 16,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderLeftWidth: 4,
  borderLeftColor: '#1F8A70',
  elevation: 2,
},

customersButtonTitle: {
  fontSize: 15,
  fontWeight: '700',
  color: '#12263A',
},

customersButtonSubtitle: {
  fontSize: 11,
  color: '#87909C',
  marginTop: 4,
},

customersArrow: {
  fontSize: 30,
  color: '#1F8A70',
  lineHeight: 30,
},
});
