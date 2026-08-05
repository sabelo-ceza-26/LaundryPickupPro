import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
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

import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../context/OrdersContext';
import {
  isOrderActive,
  type CustomerOrder,
} from '../../data/orders';
import type { CustomerTabNavigation } from '../../navigation/types';

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const WHITE = '#FFFFFF';
const AMBER_DARK = '#B45309';

const GRADIENT_HEADER = ['#14B8A6', '#0E9F6E'] as const;
const GRADIENT_BOOK = ['#DCF5E9', '#F2FBF6'] as const;
const GRADIENT_REFER = ['#FFF3D6', '#FFE9C2'] as const;

type QuickAction = {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string;
  color: string;
  compact?: boolean;
  onPress: (navigation: CustomerTabNavigation, activeOrder?: CustomerOrder) => void;
};

const quickActions: QuickAction[] = [
  {
    title: 'My Orders',
    icon: 'package-variant-closed',
    tint: '#E4EEFF',
    color: '#2E6BFF',
    onPress: (navigation) => navigation.navigate('Orders'),
  },
  {
    title: 'Track Order',
    icon: 'map-marker-outline',
    tint: '#DDF8E8',
    color: '#00A85A',
    onPress: (navigation, activeOrder) =>
      activeOrder
        ? navigation.navigate('Track', { order: activeOrder })
        : navigation.navigate('Track'),
  },
  {
    title: 'Notifications',
    icon: 'bell-outline',
    tint: '#FFF0B8',
    color: '#E8960C',
    compact: true,
    onPress: (navigation) => navigation.navigate('Notifications'),
  },
  {
    title: 'Order History',
    icon: 'history',
    tint: '#EAE6FF',
    color: '#5B48F7',
    onPress: (navigation) => navigation.navigate('Orders'),
  },
  {
    title: 'Addresses',
    icon: 'map-marker-multiple-outline',
    tint: '#D6F0F4',
    color: '#0E9AA7',
    onPress: (navigation) => navigation.navigate('Addresses'),
  },
  {
    title: 'Support',
    icon: 'headset',
    tint: '#FCE7F3',
    color: '#EC5E9B',
    onPress: (navigation) => navigation.navigate('Support'),
  },
];

export default function CustomerHomeScreen() {
  const { user, signOut } = useAuth();
  const { orders } = useOrders();
  const navigation = useNavigation<CustomerTabNavigation>();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const activeOrder = orders.find((order) => isOrderActive(order.status));
  const userName = user?.name ?? 'Matthew';

  const openMenu = () => {
    Alert.alert('Menu', 'What would you like to do?', [
      {
        text: 'My Account',
        style: 'cancel',
        onPress: () => navigation.navigate('Profile'),
      },
      {
        text: 'Settings',
        onPress: () => navigation.navigate('Settings'),
      },
      { text: 'Log out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={GRADIENT_HEADER} style={styles.header}>
          <View style={styles.decorCircleOne} />
          <View style={styles.decorCircleTwo} />

          <View style={styles.topBar}>
            <TouchableOpacity style={styles.avatar} onPress={openMenu}>
              <Text style={styles.avatarText}>
                {(user?.name ?? 'Matthew').charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bellButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <MaterialCommunityIcons name="bell-outline" size={22} color={WHITE} />
              <View style={styles.bellBadge} />
            </TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Hi, {userName}!</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Book')}
          >
            <LinearGradient colors={GRADIENT_BOOK} style={styles.bookCard}>
              <View style={styles.bookIcon}>
                <MaterialCommunityIcons name="truck-fast-outline" size={24} color="#0B7A50" />
              </View>
              <View style={styles.bookText}>
                <Text style={styles.bookTitle}>Place new Order</Text>
                <Text style={styles.bookSubtitle}>Pickup and Delivery</Text>
              </View>
              <View style={styles.bookArrow}>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#0B7A50" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Quick actions</Text>
          <View style={styles.grid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.title}
                style={[styles.gridCard, action.compact && styles.gridCardCompact]}
                activeOpacity={0.85}
                onPress={() => action.onPress(navigation, activeOrder)}
              >
                <View
                  style={[
                    styles.gridIcon,
                    action.compact && styles.gridIconCompact,
                    { backgroundColor: action.tint },
                  ]}
                >
                  <MaterialCommunityIcons name={action.icon} size={24} color={action.color} />
                  {action.title === 'Track Order' && activeOrder && (
                    <View style={styles.gridDot} />
                  )}
                </View>
                <Text
                  style={[styles.gridLabel, action.compact && styles.gridLabelCompact]}
                  numberOfLines={action.compact ? 1 : undefined}
                >
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <LinearGradient colors={GRADIENT_REFER} style={styles.referralBanner}>
            <View style={styles.referralIcon}>
              <MaterialCommunityIcons name="gift-outline" size={24} color="#C77700" />
            </View>
            <View style={styles.referralText}>
              <Text style={styles.referralTitle}>Refer a friend</Text>
              <Text style={styles.referralSubtitle}>
                Get R50 off your next order!
              </Text>
            </View>
            <View style={styles.referralArrow}>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#C77700" />
            </View>
          </LinearGradient>
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
  scroll: {
    backgroundColor: '#F5F7FA',
  },
  container: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
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
    marginBottom: 22,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: WHITE,
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
  hero: {},
  heroTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 27,
    lineHeight: 36,
    color: WHITE,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: -16,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBEADB',
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#0E9F6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  bookIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#A9E8C8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookText: {
    flex: 1,
    marginLeft: 14,
  },
  bookTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: '#0B5C3F',
  },
  bookSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#3E7A61',
    marginTop: 2,
  },
  bookArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A9E8C8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: TEAL_MID,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  gridCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8ECF1',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  gridIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#FFC24B',
    borderWidth: 2,
    borderColor: WHITE,
  },
  gridCardCompact: {
    paddingHorizontal: 12,
  },
  gridIconCompact: {
    width: 40,
    height: 40,
  },
  gridLabelCompact: {
    fontSize: 12,
    marginLeft: 8,
  },
  gridLabel: {
    flex: 1,
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_DARK,
    marginLeft: 10,
  },
  referralBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F5E3B8',
    paddingVertical: 18,
    paddingHorizontal: 18,
    elevation: 2,
    shadowColor: '#E8960C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  referralIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(232, 150, 12, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralText: {
    flex: 1,
    marginLeft: 14,
  },
  referralTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#8A5B00',
  },
  referralSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#A16207',
    marginTop: 2,
  },
  referralArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
