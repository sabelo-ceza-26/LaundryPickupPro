import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
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

import BookingHeader from '../../components/BookingHeader';
import type { DriverStackParamList } from '../../navigation/DriverNavigator';

const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const WHITE = '#FFFFFF';
const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const GREEN = '#00A85A';
const BORDER = '#E8ECF1';
const TEAL_HEADING = '#0E7A86';

const isWeb = Platform.OS === 'web';

type Props = NativeStackScreenProps<
  DriverStackParamList,
  'NotificationSettings'
>;

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

type ToggleRow = {
  label: string;
  hint: string;
  icon: Icon;
  tint: string;
  color: string;
  key: 'newOrder' | 'messages' | 'route' | 'general';
};

const toggleRows: ToggleRow[] = [
  {
    label: 'New order alerts',
    hint: 'Get notified when a new order is assigned',
    icon: 'package-variant',
    tint: BLUE_TINT,
    color: BLUE,
    key: 'newOrder',
  },
  {
    label: 'Messages',
    hint: 'Get notified when customers send a message',
    icon: 'message-text-outline',
    tint: '#DDF8E8',
    color: GREEN,
    key: 'messages',
  },
  {
    label: 'Route updates',
    hint: 'Get notified about changes to your route',
    icon: 'map-outline',
    tint: '#FFF0B8',
    color: '#E8960C',
    key: 'route',
  },
  {
    label: 'General updates',
    hint: 'Promotions and app news',
    icon: 'information-outline',
    tint: '#EDEDF0',
    color: '#7A8492',
    key: 'general',
  },
];

export default function NotificationSettingsScreen({
  navigation,
}: Props) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [prefs, setPrefs] = useState({
    newOrder: true,
    messages: true,
    route: true,
    general: false,
  });

  if (!fontsLoaded) return null;

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <BookingHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
        showCancelBooking={false}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Choose which updates you want to receive while on the road.
        </Text>

        <View style={styles.card}>
          {toggleRows.map((row, index) => (
            <View
              key={row.key}
              style={[styles.row, index === toggleRows.length - 1 && styles.rowLast]}
            >
              <View style={[styles.rowIcon, { backgroundColor: row.tint }]}>
                <MaterialCommunityIcons name={row.icon} size={20} color={row.color} />
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowHint}>{row.hint}</Text>
              </View>
              <Switch
                value={prefs[row.key]}
                onValueChange={() => toggle(row.key)}
                trackColor={{ false: '#D5DCE3', true: BLUE }}
                thumbColor={prefs[row.key] ? WHITE : '#F5F7FA'}
              />
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information-outline" size={20} color={GREEN} />
          <Text style={styles.infoText}>
            You can change these preferences at any time from your profile.
          </Text>
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
    paddingHorizontal: isWeb ? 32 : 20,
    paddingTop: 8,
    paddingBottom: 40,
    ...(isWeb ? { maxWidth: 600, alignSelf: 'center', width: '100%' } : {}),
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 20,
    marginBottom: 18,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 18,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F4',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowBody: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: TEXT_DARK,
  },
  rowHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDF8E8',
    borderRadius: 12,
    padding: 14,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: GREEN,
    lineHeight: 18,
  },
});
