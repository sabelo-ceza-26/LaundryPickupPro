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
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CustomerTabParamList } from '../../navigation/CustomerTabs';

type Nav = BottomTabNavigationProp<CustomerTabParamList>;

const ICON_DARK = '#2B3642';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const TEAL = '#0F363F';
const TEAL_TINT = '#E2ECEB';
const BORDER = '#E8ECF1';

type QuickAction = {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const quickActions: QuickAction[] = [
  { title: 'My Orders', icon: 'package-variant-closed' },
  { title: 'Track Order', icon: 'map-marker-outline' },
  { title: 'Notifications', icon: 'bell-outline' },
  { title: 'Order History', icon: 'history' },
  { title: 'Addresses', icon: 'map-marker-multiple-outline' },
  { title: 'Support', icon: 'headset' },
];

export default function CustomerHomeScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<Nav>();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const openMenu = () => {
    Alert.alert('Menu', 'What would you like to do?', [
      { text: 'My Account', style: 'cancel' },
      { text: 'Settings' },
      { text: 'Log out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.avatar} onPress={openMenu}>
            <Text style={styles.avatarText}>
              {(user?.name ?? 'Matthew').charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topIcon}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={ICON_DARK} />
          </TouchableOpacity>
        </View>

        <View style={styles.greeting}>
          <Text style={styles.greetingHi}>{user?.name ?? 'Matthew'}</Text>
          <Text style={styles.greetingSub}>
            What would you like to do today?
          </Text>
        </View>

        <TouchableOpacity
          style={styles.mainCard}
          onPress={() => navigation.navigate('Book')}
        >
          <View style={styles.mainIcon}>
            <MaterialCommunityIcons name="basket-outline" size={28} color={colorsWhite} />
          </View>
          <View style={styles.mainText}>
            <Text style={styles.mainTitle}>Place New Order</Text>
            <Text style={styles.mainSubtitle}>Pickup &amp; Delivery</Text>
          </View>
          <View style={styles.mainArrow}>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colorsWhite} />
          </View>
        </TouchableOpacity>

        <View style={styles.grid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.title} style={styles.gridCard}>
              <MaterialCommunityIcons name={action.icon} size={30} color={ICON_DARK} />
              <Text style={styles.gridLabel}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.referralBanner}>
          <View style={styles.referralIcon}>
            <MaterialCommunityIcons name="basket-outline" size={22} color={TEAL} />
          </View>
          <View style={styles.referralText}>
            <Text style={styles.referralTitle}>Refer a friend</Text>
            <Text style={styles.referralSubtitle}>
              Get R50 off your next order!!
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={TEAL} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const colorsWhite = '#FFFFFF';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  topIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F6F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    marginBottom: 20,
  },
  greetingHi: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    color: TEXT_DARK,
  },
  greetingSub: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: TEXT_MUTED,
    marginTop: 4,
  },
  mainCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEAL,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
    elevation: 4,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  mainIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    flex: 1,
    marginLeft: 14,
  },
  mainTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: colorsWhite,
  },
  mainSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  mainArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 22,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  gridLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_DARK,
    marginTop: 12,
  },
  referralBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEAL_TINT,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 8,
  },
  referralIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(15, 54, 63, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralText: {
    flex: 1,
    marginLeft: 14,
  },
  referralTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: TEAL,
  },
  referralSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#5C6B70',
    marginTop: 2,
  },
});
