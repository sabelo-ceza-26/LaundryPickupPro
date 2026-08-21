import React, { useState } from 'react';
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

import type { DriverStackParamList } from '../../navigation/DriverNavigator';
import { useDriverOrders } from '../../context/DriverOrdersContext';
import { useAuth } from '../../hooks/useAuth';

const isWeb = Platform.OS === 'web';

const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const PURPLE = '#7857FF';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';
const GREEN = '#00A85A';

const GRADIENT_VIBRANT = [BLUE, PURPLE] as const;

const GREEN_TINT = '#DDF8E8';
const AMBER = '#F4A928';
const AMBER_TINT = '#FFF0B8';

type TabKey = 'All' | 'Pickup' | 'Delivery' | 'Completed';

const TABS: {
  key: TabKey;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { key: 'All', label: 'All', icon: 'format-list-bulleted' },
  { key: 'Pickup', label: 'Pickup', icon: 'truck-delivery-outline' },
  { key: 'Delivery', label: 'Delivery', icon: 'package-variant-closed' },
  { key: 'Completed', label: 'Done', icon: 'check-circle-outline' },
];

type Props = NativeStackScreenProps<DriverStackParamList, 'Orders'>;

export default function OrdersScreen({ navigation }: Props) {
  const { orders } = useDriverOrders();
  const { user } = useAuth();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [selectedTab, setSelectedTab] = useState<TabKey>('All');

  const myOrders = orders.filter(
    (order) => !order.driver || order.driver === user?.name,
  );

  const tabCounts: Record<TabKey, number> = {
    All: myOrders.length,
    Pickup: myOrders.filter((o) => o.type === 'Pickup').length,
    Delivery: myOrders.filter((o) => o.type === 'Delivery').length,
    Completed: myOrders.filter((o) => o.status === 'Completed').length,
  };

  const filteredOrders = myOrders.filter((order) => {
    if (selectedTab === 'All') return true;
    if (selectedTab === 'Completed') return order.status === 'Completed';
    return order.type === selectedTab;
  });

  const emptyTitle =
    selectedTab === 'All'
      ? 'No orders yet'
      : selectedTab === 'Completed'
        ? 'No completed orders yet'
        : `No ${selectedTab.toLowerCase()}s assigned`;

  const emptySubtitle =
    selectedTab === 'All'
      ? 'You have no orders assigned right now. New assignments will appear here.'
      : selectedTab === 'Completed'
        ? 'Orders you complete will be listed here.'
        : `You have no ${selectedTab.toLowerCase()}s assigned right now.`;

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={GRADIENT_VIBRANT} style={styles.headerBanner}>
        <View style={styles.shine} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((tab) => {
            const isActive = selectedTab === tab.key;
            const count = tabCounts[tab.key];
            const content = (
              <>
                <MaterialCommunityIcons
                  name={tab.icon}
                  size={17}
                  color={isActive ? WHITE : TEXT_MUTED}
                />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                <View
                  style={[styles.tabCount, isActive && styles.tabCountActive]}
                >
                  <Text
                    style={[
                      styles.tabCountText,
                      isActive && styles.tabCountTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </>
            );
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tabFlex}
                activeOpacity={0.8}
                onPress={() => setSelectedTab(tab.key)}
              >
                {isActive ? (
                  <LinearGradient
                    colors={GRADIENT_VIBRANT}
                    style={styles.tabPill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {content}
                  </LinearGradient>
                ) : (
                  <View style={styles.tabPill}>{content}</View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Today</Text>

        {filteredOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={[styles.card]}
            activeOpacity={0.85}
            onPress={() =>
              order.type === 'Delivery'
                ? navigation.navigate('DeliveryDetails', { order })
                : navigation.navigate('OrderDetails', { order })
            }
          >
            <View
              style={[
                styles.cardAccent,
                {
                  backgroundColor:
                    order.type === 'Pickup' ? BLUE : GREEN,
                },
              ]}
            />

            <View
              style={[
                styles.cardIcon,
                { backgroundColor: order.type === 'Pickup' ? BLUE_TINT : '#DDF8E8' },
              ]}
            >
              <MaterialCommunityIcons
                name={
                  order.type === 'Pickup'
                    ? 'truck-delivery-outline'
                    : 'package-variant'
                }
                size={24}
                color={order.type === 'Pickup' ? BLUE : GREEN}
              />
            </View>

            <View style={styles.cardBody}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardType}>{order.type}</Text>
                <Text style={styles.cardTime}>{order.time}</Text>
              </View>

              <Text style={styles.cardCustomer}>{order.customer}</Text>

              <Text style={styles.cardAddress} numberOfLines={1}>
                {order.address}
              </Text>

              {order.status && (
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor:
                        order.status === 'Completed'
                          ? GREEN_TINT
                          : order.status === 'Assigned'
                            ? BLUE_TINT
                            : AMBER_TINT,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          order.status === 'Completed'
                            ? GREEN
                            : order.status === 'Assigned'
                              ? BLUE
                              : AMBER,
                      },
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="package-variant-closed" size={40} color={BLUE} />
            </View>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            <Text style={styles.emptySubtitle}>{emptySubtitle}</Text>
          </View>
        )}
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
    marginBottom: 0,
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
  headerSpacer: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: WHITE,
  },
  container: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: isWeb ? 32 : 20,
    paddingTop: 16,
    paddingBottom: 30,
    flexGrow: 1,
    ...(isWeb ? { maxWidth: 600, alignSelf: 'center', width: '100%' } : {}),
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 5,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tabFlex: {
    flex: 1,
    marginHorizontal: 2,
  },
  tabPill: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 4,
  },
  tabLabelActive: {
    color: WHITE,
  },
  tabCount: {
    minWidth: 20,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 6,
    backgroundColor: '#E9EDF3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  tabCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  tabCountText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 9,
    color: TEXT_MUTED,
  },
  tabCountTextActive: {
    color: WHITE,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: TEXT_DARK,
    marginBottom: 12,
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
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
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
    backgroundColor: BLUE_TINT,
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
  },
  cardTime: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
  },
  cardCustomer: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_DARK,
    marginTop: 3,
  },
  cardAddress: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statusText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BLUE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: TEXT_DARK,
    marginTop: 14,
  },
  emptySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
  },
});
