import React, { useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { useAuth } from '../../hooks/useAuth';
import { useDriverOrders } from '../../context/DriverOrdersContext';
import { useNotifications } from '../../context/NotificationsContext';
import FancyAlert from '../../components/FancyAlert';

type Props = NativeStackScreenProps<DriverStackParamList, 'Home'>;

const isWeb = Platform.OS === 'web';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const WHITE = '#FFFFFF';
const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const PURPLE = '#7857FF';
const GREEN = '#00A85A';
const GREEN_TINT = '#DDF8E8';
const AMBER = '#F4A928';
const AMBER_TINT = '#FFF0B8';
const BORDER = '#E8ECF1';
const DANGER = '#E5484D';

const GRADIENT_HEADER = ['#14B8A6', '#0E9F6E'] as const;
const GRADIENT_PRIMARY = [BLUE, PURPLE] as const;

export default function DriverHomeScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const { orders } = useDriverOrders();
  const { unreadCount } = useNotifications();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [searchText, setSearchText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [summaryAlert, setSummaryAlert] = useState<{
    title: string;
    message: string;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
    tint: string;
  } | null>(null);

  if (!fontsLoaded) return null;

  const closeMenu = () => setMenuVisible(false);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    signOut();
  };

  const myOrders = orders.filter(
    (order) => !order.driver || order.driver === user?.name,
  );

  const filteredOrders = myOrders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  const pickupCount = myOrders.filter((o) => o.type === 'Pickup').length;
  const deliveryCount = myOrders.filter((o) => o.type === 'Delivery').length;

  const hasAssignedOrders = myOrders.length > 0;

  const handleStartRoute = () => {
    if (!hasAssignedOrders) {
      setSummaryAlert({
        title: 'No Route Available',
        message:
          'You have no orders assigned to you yet. A route can only be started once an order is assigned to you.',
        icon: 'map-marker-path',
        color: AMBER,
        tint: AMBER_TINT,
      });
      return;
    }
    navigation.navigate('Navigation');
  };

  const showSummaryAlert = (
    kind: 'Pickup' | 'Delivery',
  ) => {
    const count = kind === 'Pickup' ? pickupCount : deliveryCount;
    setSummaryAlert({
      title: `Today's ${kind}s`,
      message:
        count > 0
          ? `You have ${count} ${kind.toLowerCase()}${count === 1 ? '' : 's'} assigned for today. Tap Orders to view the details.`
          : `No ${kind.toLowerCase()}s are assigned to you for today.`,
      icon: kind === 'Pickup' ? 'truck-delivery-outline' : 'package-variant',
      color: kind === 'Pickup' ? BLUE : GREEN,
      tint: kind === 'Pickup' ? BLUE_TINT : GREEN_TINT,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={GRADIENT_HEADER} style={styles.header}>
        <View style={styles.decorCircleOne} />
        <View style={styles.decorCircleTwo} />

        <View style={styles.topBar}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
            <MaterialCommunityIcons name="menu" size={22} color={WHITE} />
          </TouchableOpacity>

          <View style={styles.welcomeWrap}>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.welcomeName}>{user?.name ?? 'Driver'}</Text>
          </View>

          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialCommunityIcons name="bell-outline" size={22} color={WHITE} />
            {unreadCount > 0 && <View style={styles.bellBadge} />}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={TEXT_MUTED} />
          <TextInput
            placeholder="Search by Order Number"
            placeholderTextColor={TEXT_MUTED}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <Text style={styles.sectionTitle}>Today's Summary</Text>

        <View style={styles.summaryRow}>
          <TouchableOpacity
            style={styles.summaryCard}
            activeOpacity={0.85}
            onPress={() => showSummaryAlert('Pickup')}
          >
            <View style={[styles.summaryIcon, { backgroundColor: BLUE_TINT }]}>
              <MaterialCommunityIcons name="truck-delivery-outline" size={18} color={BLUE} />
            </View>
            <Text style={[styles.summaryNumber, { color: BLUE }]}>
              {pickupCount}
            </Text>
            <Text style={styles.summaryLabel}>Pickups</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.summaryCard}
            activeOpacity={0.85}
            onPress={() => showSummaryAlert('Delivery')}
          >
            <View style={[styles.summaryIcon, { backgroundColor: GREEN_TINT }]}>
              <MaterialCommunityIcons name="package-variant" size={18} color={GREEN} />
            </View>
            <Text style={[styles.summaryNumber, { color: GREEN }]}>
              {deliveryCount}
            </Text>
            <Text style={styles.summaryLabel}>Deliveries</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={hasAssignedOrders ? 0.9 : 1}
          onPress={handleStartRoute}
        >
          <LinearGradient
            colors={GRADIENT_PRIMARY}
            style={[styles.routeButton, !hasAssignedOrders && styles.routeButtonDisabled]}
          >
            <View style={styles.shine} />
            <MaterialCommunityIcons name="map-marker-path" size={20} color={WHITE} />
            <Text style={styles.routeButtonText}>
              {hasAssignedOrders ? 'Start Route' : 'No Orders Assigned'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Today's Orders</Text>

        {filteredOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            activeOpacity={0.85}
            onPress={() =>
              order.type === 'Delivery'
                ? navigation.navigate('DeliveryDetails', { order })
                : navigation.navigate('OrderDetails', { order })
            }
          >
            <View style={styles.orderLeft}>
              <View
                style={[
                  styles.orderIcon,
                  { backgroundColor: order.type === 'Pickup' ? BLUE_TINT : GREEN_TINT },
                ]}
              >
                <MaterialCommunityIcons
                  name={order.type === 'Pickup' ? 'truck-delivery-outline' : 'package-variant'}
                  size={22}
                  color={order.type === 'Pickup' ? BLUE : GREEN}
                />
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Text style={styles.orderType}>{order.type}</Text>
                <Text style={styles.customer}>{order.customer}</Text>
                <Text style={styles.address}>{order.address}</Text>
              </View>
            </View>

            <View style={styles.orderRight}>
              <Text style={styles.time}>{order.time}</Text>
              <TouchableOpacity
                style={styles.viewButton}
                activeOpacity={0.85}
                onPress={() =>
                  order.type === 'Delivery'
                    ? navigation.navigate('DeliveryDetails', { order })
                    : navigation.navigate('OrderDetails', { order })
                }
              >
                <Text style={styles.viewButtonText}>View</Text>
                <MaterialCommunityIcons name="chevron-right" size={14} color={WHITE} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="package-variant-closed" size={40} color={BLUE} />
            </View>
            <Text style={styles.emptyTitle}>
              {searchText.trim().length > 0 ? 'No orders found' : 'No orders yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchText.trim().length > 0
                ? 'No order matches that number. Try another search.'
                : 'You have no orders assigned right now. New assignments will appear here.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Options Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <View style={styles.menuBackdrop}>
          <TouchableOpacity style={styles.menuBackdropTouch} activeOpacity={1} onPress={closeMenu} />
          <View style={styles.optionsMenu}>
            <View style={styles.menuHandle} />
            <LinearGradient colors={GRADIENT_HEADER} style={styles.menuHeader}>
              <View style={styles.menuAvatar}>
                <Text style={styles.menuAvatarText}>
                  {(user?.name ?? 'D').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.menuHeaderText}>
                <Text style={styles.menuHeaderTitle}>Hey, {user?.name ?? 'Driver'}</Text>
                <Text style={styles.menuHeaderSubtitle}>What would you like to do?</Text>
              </View>
            </LinearGradient>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { closeMenu(); navigation.navigate('Notifications'); }}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: AMBER_TINT }]}>
                <MaterialCommunityIcons name="bell-outline" size={20} color={AMBER} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Notifications</Text>
                <Text style={styles.menuDesc}>View your alerts</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={TEXT_MUTED} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { closeMenu(); navigation.navigate('Profile'); }}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: BLUE_TINT }]}>
                <MaterialCommunityIcons name="account-outline" size={20} color={BLUE} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Profile</Text>
                <Text style={styles.menuDesc}>View your account</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={TEXT_MUTED} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { closeMenu(); setShowLogoutModal(true); }}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: '#FDE7E8' }]}>
                <MaterialCommunityIcons name="logout" size={20} color={DANGER} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: DANGER }]}>Log out</Text>
                <Text style={styles.menuDesc}>Sign out of your account</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={TEXT_MUTED} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Summary Alert */}
      <FancyAlert
        visible={summaryAlert !== null}
        title={summaryAlert?.title ?? ''}
        message={summaryAlert?.message ?? ''}
        icon={summaryAlert?.icon}
        iconColor={summaryAlert?.color}
        iconBackground={summaryAlert?.tint}
        onClose={() => setSummaryAlert(null)}
      />

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <MaterialCommunityIcons name="logout" size={28} color={DANGER} />
            </View>
            <Text style={styles.modalTitle}>Log out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out of your account?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmLogout}
              >
                <Text style={styles.modalConfirmText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  decorCircleOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: -90,
    right: -60,
  },
  decorCircleTwo: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -50,
    left: -40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FFC24B',
    borderWidth: 1.5,
    borderColor: '#13A884',
  },
  welcomeWrap: {
    flex: 1,
    alignItems: 'center',
  },
  welcome: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  welcomeName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: WHITE,
    marginTop: 1,
  },
  scroll: {
    backgroundColor: '#F5F7FA',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  searchContainer: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: TEXT_DARK,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: TEXT_DARK,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryNumber: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
  },
  summaryLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  routeButton: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
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
  routeButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: WHITE,
    marginLeft: 8,
  },
  routeButtonDisabled: {
    opacity: 0.55,
    elevation: 0,
    shadowOpacity: 0,
  },
  orderCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  orderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  orderIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
    marginBottom: 2,
  },
  orderType: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEXT_DARK,
  },
  customer: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_DARK,
    marginTop: 4,
  },
  address: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  orderRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  time: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEXT_DARK,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLUE,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: WHITE,
    marginRight: 4,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
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
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.55)',
    justifyContent: 'flex-end',
  },
  menuBackdropTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  optionsMenu: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 30,
    shadowColor: '#0F363F',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 16,
  },
  menuHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D8DFE6',
    marginTop: 10,
    marginBottom: 14,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 6,
  },
  menuAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuAvatarText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: WHITE,
  },
  menuHeaderText: {
    flex: 1,
  },
  menuHeaderTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: WHITE,
  },
  menuHeaderSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.82)',
    marginTop: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEXT_DARK,
  },
  menuDesc: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EEF1F5',
    marginVertical: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 14,
    shadowColor: '#0F363F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FDE7E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: TEXT_DARK,
  },
  modalMessage: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 22,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalCancelText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
  },
  modalConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: DANGER,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  modalConfirmText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: WHITE,
  },
});
