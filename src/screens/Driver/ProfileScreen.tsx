import React, { useState } from 'react';
import {
  Modal,
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
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../types';
import type { DriverStackParamList } from '../../navigation/DriverNavigator';

const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const WHITE = '#FFFFFF';
const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const PURPLE = '#7857FF';
const PURPLE_TINT = '#EFEBFF';
const GREEN = '#00A85A';
const GREEN_TINT = '#DDF8E8';
const AMBER = '#F4A928';
const AMBER_TINT = '#FFF0B8';
const BORDER = '#E8ECF1';
const DANGER = '#E5484D';
const TEAL_HEADING = '#0E7A86';
const ICON_DARK = '#2B3642';

const GRADIENT_VIBRANT = [BLUE, PURPLE] as const;

const isWeb = Platform.OS === 'web';

type Props = NativeStackScreenProps<DriverStackParamList, 'Profile'>;

type SettingsRow = {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string;
  color: string;
  onPress: (navigation: Props['navigation']) => void;
};

const settingsRows: SettingsRow[] = [
  {
    label: 'Account Settings',
    icon: 'account-cog-outline',
    tint: PURPLE_TINT,
    color: PURPLE,
    onPress: (navigation) => navigation.navigate('AccountSettings'),
  },
  {
    label: 'Notifications',
    icon: 'bell-outline',
    tint: AMBER_TINT,
    color: AMBER,
    onPress: (navigation) => navigation.navigate('NotificationSettings'),
  },
  {
    label: 'Privacy & Security',
    icon: 'shield-check-outline',
    tint: GREEN_TINT,
    color: GREEN,
    onPress: (navigation) => navigation.navigate('PrivacySecurity'),
  },
  {
    label: 'Help & Support',
    icon: 'headset',
    tint: BLUE_TINT,
    color: BLUE,
    onPress: (navigation) => navigation.navigate('HelpSupport'),
  },
];

export default function ProfileScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!fontsLoaded) return null;

  const displayName = user?.name ?? 'Driver';
  const displayEmail = user?.email ?? 'driver@laundrypickuppro.app';
  const displayPhone = user?.phone || 'Not provided';
  const roleLabel = user?.role ? ROLE_LABELS[user.role] : 'Driver';

  const confirmLogout = () => {
    setShowLogoutModal(false);
    signOut();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <LinearGradient colors={GRADIENT_VIBRANT} style={styles.profileCard}>
          <View style={styles.shine} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email} numberOfLines={1}>
              {displayEmail}
            </Text>
            <Text style={styles.phone}>{displayPhone}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{roleLabel}</Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {settingsRows.map((row, index) => (
            <TouchableOpacity
              key={row.label}
              style={[
                styles.settingsRow,
                index === settingsRows.length - 1 && styles.settingsRowLast,
              ]}
              onPress={() => row.onPress(navigation)}
            >
              <View style={[styles.rowIcon, { backgroundColor: row.tint }]}>
                <MaterialCommunityIcons name={row.icon} size={20} color={row.color} />
              </View>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={TEXT_MUTED} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
        >
          <MaterialCommunityIcons name="logout" size={20} color={DANGER} />
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Laundry Pickup Pro · v1.0.0</Text>
      </ScrollView>

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
  scroll: {
    backgroundColor: '#F5F7FA',
  },
  container: {
    paddingHorizontal: isWeb ? 32 : 20,
    paddingTop: 16,
    paddingBottom: 110,
    ...(isWeb ? { maxWidth: 600, alignSelf: 'center', width: '100%' } : {}),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: TEXT_DARK,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    overflow: 'hidden',
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    color: WHITE,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: WHITE,
  },
  email: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  phone: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  roleBadgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    color: WHITE,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEAL_HEADING,
    marginBottom: 10,
  },
  settingsCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 22,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F4',
  },
  settingsRowLast: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: TEXT_DARK,
  },
  logoutButton: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: DANGER,
    backgroundColor: WHITE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: DANGER,
    marginLeft: 8,
  },
  version: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginTop: 18,
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
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
