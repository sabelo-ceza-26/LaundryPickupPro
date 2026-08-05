import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import type { CustomerStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Notifications'>;

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: Icon;
  color: string;
  tint: string;
};

const TEAL = '#0F363F';
const ICON_DARK = '#2B3642';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Pickup confirmed',
    message: 'Your pickup for LPP-728104 is confirmed for 9:00 AM – 11:00 AM today.',
    time: '10 min ago',
    read: false,
    icon: 'calendar-check-outline',
    color: '#0F363F',
    tint: '#E2ECEB',
  },
  {
    id: 2,
    title: 'Your order is out for delivery',
    message: 'Sipho Ndlovu is on the way with your laundry.',
    time: '25 min ago',
    read: false,
    icon: 'truck-delivery-outline',
    color: '#00A85A',
    tint: '#DDF8E8',
  },
  {
    id: 3,
    title: 'Payment received',
    message: 'Your card payment of R169.50 for LPP-728104 was successful.',
    time: '1 hr ago',
    read: false,
    icon: 'credit-card-check-outline',
    color: '#2E6BFF',
    tint: '#E4EEFF',
  },
  {
    id: 4,
    title: 'Items received',
    message: 'Your items have been received and will be delivered on schedule.',
    time: '2 hrs ago',
    read: true,
    icon: 'storefront-outline',
    color: '#5B48F7',
    tint: '#EAE6FF',
  },
  {
    id: 5,
    title: 'Special offer',
    message: 'Get R50 off your next order when you refer a friend.',
    time: 'Yesterday',
    read: true,
    icon: 'tag-heart',
    color: '#F4A928',
    tint: '#FFF0B8',
  },
  {
    id: 6,
    title: 'Order delivered',
    message: 'LPP-671925 was delivered successfully. Thanks for using Laundry Pickup Pro!',
    time: 'Fri, Jul 31',
    read: true,
    icon: 'package-variant-closed-check',
    color: '#687385',
    tint: '#EEF1F5',
  },
];

export default function NotificationsScreen({ navigation }: Props) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={ICON_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          style={styles.markAllButton}
          disabled={unreadCount === 0}
          onPress={markAllAsRead}
        >
          <Text style={[styles.markAllText, unreadCount === 0 && styles.markAllDisabled]}>
            Mark all
          </Text>
        </TouchableOpacity>
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <View style={styles.unreadDot} />
          <Text style={styles.unreadBannerText}>
            {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.read && styles.cardUnread]}
            activeOpacity={0.85}
            onPress={() => markAsRead(item.id)}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.tint }]}>
              <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardTitleRow}>
                <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]}>
                  {item.title}
                </Text>
                {!item.read && <View style={styles.titleDot} />}
              </View>
              <Text style={styles.cardMessage}>{item.message}</Text>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>
          </TouchableOpacity>
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
    paddingVertical: 12,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F6F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: TEXT_DARK,
  },
  markAllButton: {
    minWidth: 64,
    alignItems: 'flex-end',
  },
  markAllText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEAL,
  },
  markAllDisabled: {
    color: '#B9C3CD',
  },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TEAL,
    marginRight: 8,
  },
  unreadBannerText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_DARK,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
  },
  cardUnread: {
    backgroundColor: '#FBFCFD',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: TEXT_DARK,
  },
  cardTitleUnread: {
    fontFamily: 'Poppins_600SemiBold',
  },
  titleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TEAL,
    marginLeft: 8,
  },
  cardMessage: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 3,
    lineHeight: 18,
  },
  cardTime: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#B0BAC4',
    marginTop: 6,
  },
});
