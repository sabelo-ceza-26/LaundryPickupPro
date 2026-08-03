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

type Props = NativeStackScreenProps<AdminStackParamList, 'Reports'>;

const weeklyOrders = [
  { day: 'M', value: 18 },
  { day: 'T', value: 22 },
  { day: 'W', value: 29 },
  { day: 'T', value: 25 },
  { day: 'F', value: 34 },
  { day: 'S', value: 38 },
  { day: 'S', value: 20 },
];

export default function ReportsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Reports</Text>

          <TouchableOpacity style={styles.calendarButton}>
            <Text style={styles.calendarIcon}>▣</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateCard}>
          <Text style={styles.dateText}>
            Jul 20, 2026 - Jul 29, 2026
          </Text>

          <Text style={styles.dateIcon}>▣</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>REVENUE</Text>
            <Text style={styles.statValue}>R42,850</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ORDERS</Text>
            <Text style={styles.statValue}>384</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>AVG ORDER</Text>
            <Text style={styles.statValue}>R111.50</Text>
          </View>
        </View>

        <View style={styles.reportCard}>
          <Text style={styles.cardTitle}>Weekly Orders Trend</Text>

          <View style={styles.chartContainer}>
            {weeklyOrders.map((item, index) => (
              <View key={`${item.day}-${index}`} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: item.value * 3,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.dayText}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.reportCard}>
          <Text style={styles.cardTitle}>Order Status Share</Text>

          <View style={styles.statusContent}>
            <View style={styles.donutOuter}>
              <View style={styles.donutInner}>
                <Text style={styles.donutValue}>384</Text>
                <Text style={styles.donutLabel}>Orders</Text>
              </View>
            </View>

            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, styles.deliveredDot]} />
                <Text style={styles.legendText}>Delivered</Text>
                <Text style={styles.legendValue}>62%</Text>
              </View>

              <View style={styles.legendRow}>
                <View style={[styles.legendDot, styles.progressDot]} />
                <Text style={styles.legendText}>In Progress</Text>
                <Text style={styles.legendValue}>25%</Text>
              </View>

              <View style={styles.legendRow}>
                <View style={[styles.legendDot, styles.pickupDot]} />
                <Text style={styles.legendText}>To Pick Up</Text>
                <Text style={styles.legendValue}>13%</Text>
              </View>
            </View>
          </View>
        </View>
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
    paddingTop: 14,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },

  backText: {
    fontSize: 34,
    color: '#12263A',
    lineHeight: 34,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#12263A',
  },

  calendarButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  calendarIcon: {
    fontSize: 17,
    color: '#12263A',
  },

  dateCard: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D9DEE5',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  dateText: {
    fontSize: 12,
    color: '#12263A',
    fontWeight: '500',
  },

  dateIcon: {
    fontSize: 15,
    color: '#596579',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  statCard: {
    width: '31.5%',
    minHeight: 70,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 11,
  },

  statLabel: {
    fontSize: 9,
    color: '#8A94A3',
    fontWeight: '600',
  },

  statValue: {
    marginTop: 7,
    fontSize: 15,
    fontWeight: '700',
    color: '#12263A',
  },

  reportCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#12263A',
    marginBottom: 16,
  },

 chartContainer: {
  height: 210,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
},

  barColumn: {
    flex: 1,
    alignItems: 'center',
  },

  barTrack: {
  height: 170,
  justifyContent: 'flex-end',
  alignItems: 'center',
},

  bar: {
  width: 14,
  maxHeight: 170,
  minHeight: 25,
  borderRadius: 4,
  backgroundColor: '#173D8F',
},

  dayText: {
    marginTop: 7,
    fontSize: 10,
    color: '#687385',
  },

  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  donutOuter: {
    width: 150,
    height: 150,
    borderRadius: 200,
    borderWidth: 20,
    borderColor: '#173D8F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },


  donutInner: {
    alignItems: 'center',
  },

  donutValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#12263A',
  },

  donutLabel: {
    fontSize: 9,
    color: '#87909C',
    marginTop: 2,
  },

  legend: {
    flex: 1,
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },

  deliveredDot: {
    backgroundColor: '#173D8F',
  },

  progressDot: {
    backgroundColor: '#3278F6',
  },

  pickupDot: {
    backgroundColor: '#E5A900',
  },

  legendText: {
    flex: 1,
    fontSize: 11,
    color: '#4C596A',
  },

  legendValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#12263A',
  },
});