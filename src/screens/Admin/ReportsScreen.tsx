import React, { useMemo } from 'react';
import {
  Platform,
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

import type { AdminStackParamList } from '../../navigation/AdminNavigator';
import { useAdmin } from '../../context/AdminContext';
import {
  computeReportStats,
  type StatusShareEntry,
} from '../../services/reportsService';
import { formatMoney } from '../../utils/format';

type Props = NativeStackScreenProps<AdminStackParamList, 'Reports'>;

const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const PURPLE = '#7857FF';
const TEAL_HEADING = '#0E7A86';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';

const GRADIENT_VIBRANT = [BLUE, PURPLE] as const;

type Stat = {
  label: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string;
  color: string;
};

const isWeb = Platform.OS === 'web';

function formatRangeLabel(start: Date, end: Date): string {
  const fmt = (date: Date, withYear: boolean) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(withYear ? { year: 'numeric' } : {}),
    });
  const sameYear = start.getFullYear() === end.getFullYear();
  return `${fmt(start, !sameYear)} - ${fmt(end, true)}`;
}

export default function ReportsScreen({ navigation }: Props) {
  const { orders } = useAdmin();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const report = useMemo(() => computeReportStats(orders), [orders]);

  if (!fontsLoaded) return null;

  const maxWeeklyValue = Math.max(
    ...report.weeklyTrend.map((point) => point.value),
    1
  );

  const stats: Stat[] = [
    {
      label: 'Revenue',
      value: formatMoney(report.totalRevenue),
      icon: 'cash-multiple',
      tint: '#DDF8E8',
      color: '#00A85A',
    },
    {
      label: 'Orders',
      value: String(report.totalOrders),
      icon: 'receipt-text-outline',
      tint: BLUE_TINT,
      color: BLUE,
    },
    {
      label: 'Avg Order',
      value: formatMoney(report.avgOrderValue),
      icon: 'calculator-variant-outline',
      tint: '#EFEBFF',
      color: PURPLE,
    },
  ];

  const legendItems = report.statusShare.filter(
    (item) => item.count > 0
  ) as StatusShareEntry[];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={GRADIENT_VIBRANT} style={styles.headerBanner}>
        <View style={styles.shine} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reports</Text>
          <View style={styles.headerIconPlaceholder} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateCard}>
          <View style={styles.dateIconWrap}>
            <MaterialCommunityIcons name="calendar-month-outline" size={18} color={BLUE} />
          </View>
          <Text style={styles.dateText}>
            {formatRangeLabel(report.rangeStart, report.rangeEnd)}
          </Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.tint }]}>
                <MaterialCommunityIcons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={styles.statValue} numberOfLines={1}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.reportCard}>
          <Text style={styles.cardTitle}>Weekly Orders Trend</Text>

          <View style={styles.chartContainer}>
            {report.weeklyTrend.map((item, index) => (
              <View key={`${item.label}-${index}`} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height:
                          item.value === 0
                            ? 6
                            : Math.max(
                                25,
                                (item.value / maxWeeklyValue) * 170
                              ),
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

          {report.totalOrders === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="chart-donut-variant"
                size={34}
                color={BLUE_TINT}
              />
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySubtitle}>
                New orders will appear here as soon as customers book.
              </Text>
            </View>
          ) : (
            <View style={styles.statusContent}>
              <View style={styles.donutOuter}>
                <View style={styles.donutInner}>
                  <Text style={styles.donutValue}>{report.totalOrders}</Text>
                  <Text style={styles.donutLabel}>Orders</Text>
                </View>
              </View>

              <View style={styles.legend}>
                {legendItems.map((item) => (
                  <View key={item.label} style={styles.legendRow}>
                    <View
                      style={[styles.legendDot, { backgroundColor: item.color }]}
                    />
                    <Text style={styles.legendText}>{item.label}</Text>
                    <Text style={styles.legendValue}>
                      {item.percent}% · {item.count}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: WHITE,
  },
  scroll: {
    backgroundColor: '#F5F7FA',
  },
  container: {
    paddingHorizontal: isWeb ? 32 : 20,
    paddingBottom: 40,
    ...(isWeb ? { maxWidth: 700, alignSelf: 'center', width: '100%' } : {}),
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 14,
  },
  dateIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: BLUE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dateText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_DARK,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statCard: {
    width: '31.5%',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: TEXT_DARK,
  },
  statLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  reportCard: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEAL_HEADING,
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
    borderRadius: 6,
    backgroundColor: BLUE,
  },
  dayText: {
    marginTop: 7,
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    color: TEXT_MUTED,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
    marginTop: 10,
  },
  emptySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  donutOuter: {
    width: 150,
    height: 150,
    borderRadius: 200,
    borderWidth: 20,
    borderColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },
  donutInner: {
    alignItems: 'center',
  },
  donutValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: TEXT_DARK,
  },
  donutLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  legend: {
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },
  legendText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
  },
  legendValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 11,
    color: TEXT_DARK,
  },
});
