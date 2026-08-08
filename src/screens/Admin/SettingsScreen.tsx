import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
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

import type { AdminStackParamList } from '../../navigation/AdminNavigator';
import { useAuth } from '../../hooks/useAuth';
import FancyAlert from '../../components/FancyAlert';
import { isEmail, isMinLength, isPhone, isRequired, matches } from '../../utils/validation';

type Props = NativeStackScreenProps<AdminStackParamList, 'Settings'>;

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

type ToggleRow = {
  label: string;
  hint: string;
  icon: Icon;
  tint: string;
  color: string;
  key: 'push' | 'order' | 'driver' | 'email';
};

type LinkRow = {
  label: string;
  hint: string;
  icon: Icon;
  tint: string;
  color: string;
  onPress: () => void;
};

type Success = {
  visible: boolean;
  icon: Icon;
  iconColor: string;
  iconBackground: string;
  title: string;
  message: string;
};

const TEAL = '#0E9AA7';
const ICON_DARK = '#2B3642';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';
const DANGER = '#E5484D';
const SECTION = '#0E7A86';
const BLUE = '#2E6BFF';
const GRADIENT_RED = ['#FF7A70', '#E5484D'] as const;
const GRADIENT_HEADER = ['#2E6BFF', '#7857FF'] as const;

const toggleRows: ToggleRow[] = [
  {
    label: 'Push notifications',
    hint: 'Receive notifications on this device',
    icon: 'bell-outline',
    tint: '#E4EEFF',
    color: '#2E6BFF',
    key: 'push',
  },
  {
    label: 'Order alerts',
    hint: 'Receive updates about customer orders',
    icon: 'package-variant-closed',
    tint: '#EFEBFF',
    color: '#7857FF',
    key: 'order',
  },
  {
    label: 'Driver alerts',
    hint: 'Receive driver availability updates',
    icon: 'truck-outline',
    tint: '#D6F0F4',
    color: '#0E9AA7',
    key: 'driver',
  },
  {
    label: 'Email reports',
    hint: 'Receive weekly performance reports',
    icon: 'email-outline',
    tint: '#DDF8E8',
    color: '#00A85A',
    key: 'email',
  },
];

const PRIVACY_SECTIONS: { title: string; body: string }[] = [
  {
    title: 'Information we collect',
    body: 'We collect information you provide when you create an account, book a laundry pickup or contact our support team. This includes your name, email address, phone number and delivery addresses.',
  },
  {
    title: 'How we use your information',
    body: 'Your information is used to process bookings, arrange pickups and deliveries, communicate about your orders and improve our service. We never sell your personal data to third parties.',
  },
  {
    title: 'Location and device access',
    body: 'With your permission we may use your device location to help drivers find your pickup and delivery addresses. You can revoke location access at any time from your device settings.',
  },
  {
    title: 'Data security',
    body: 'We use industry-standard safeguards to protect your personal information. Access to your account is protected by a password, and payments are processed through secure, encrypted channels.',
  },
  {
    title: 'Your rights',
    body: 'You may request access to, correction of, or deletion of your personal information at any time by contacting support@laundrypickuppro.co.za.',
  },
  {
    title: 'Changes to this policy',
    body: 'We may update this privacy policy from time to time. We will notify you of material changes through the app or by email before they take effect.',
  },
];

export default function SettingsScreen({ navigation }: Props) {
  const { user, signOut, updateUser } = useAuth();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [prefs, setPrefs] = useState({
    push: true,
    order: true,
    driver: true,
    email: false,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [success, setSuccess] = useState<Success>({
    visible: false,
    icon: 'check-circle-outline',
    iconColor: '#0B7A50',
    iconBackground: '#DDF8E8',
    title: '',
    message: '',
  });

  if (!fontsLoaded) return null;

  const displayName = user?.name ?? 'Admin';
  const displayEmail = user?.email ?? 'admin@gmail.com';
  const displayPhone = user?.phone ?? '';

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const openEdit = () => {
    setEditName(displayName);
    setEditEmail(displayEmail);
    setEditPhone(displayPhone);
    setEditErrors({});
    setShowEditModal(true);
  };

  const saveProfile = () => {
    const next: Record<string, string> = {};
    if (!isRequired(editName)) next.name = 'Enter your name';
    if (!isEmail(editEmail)) next.email = 'Enter a valid email';
    if (editPhone.trim() && !isPhone(editPhone)) next.phone = 'Enter a valid phone number';
    setEditErrors(next);
    if (Object.keys(next).length > 0) return;

    updateUser({
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim() || undefined,
    });
    setShowEditModal(false);
    setSuccess({
      visible: true,
      icon: 'account-check-outline',
      iconColor: '#0B7A50',
      iconBackground: '#DDF8E8',
      title: 'Profile updated',
      message: 'Your personal information has been saved.',
    });
  };

  const openPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordErrors({});
    setShowPasswordModal(true);
  };

  const savePassword = () => {
    const next: Record<string, string> = {};
    if (!isRequired(currentPassword)) next.current = 'Enter your current password';
    else if (!isMinLength(currentPassword, 6)) next.current = 'Current password is incorrect';
    if (!isMinLength(newPassword, 6)) next.new = 'Password must be at least 6 characters';
    if (!matches(newPassword, confirmPassword)) next.confirm = 'Passwords do not match';
    setPasswordErrors(next);
    if (Object.keys(next).length > 0) return;

    setShowPasswordModal(false);
    setSuccess({
      visible: true,
      icon: 'lock-check-outline',
      iconColor: '#0B7A50',
      iconBackground: '#DDF8E8',
      title: 'Password changed',
      message: 'Your password has been updated successfully.',
    });
  };

  const accountRows: LinkRow[] = [
    {
      label: 'Personal information',
      hint: 'Update your name and email address',
      icon: 'account-cog-outline',
      tint: '#EFEBFF',
      color: '#7857FF',
      onPress: openEdit,
    },
    {
      label: 'Change password',
      hint: 'Update your account password',
      icon: 'lock-reset',
      tint: '#FFF0B8',
      color: '#E8960C',
      onPress: openPassword,
    },
  ];

  const appRows: LinkRow[] = [
    {
      label: 'Privacy policy',
      hint: 'How we handle your data',
      icon: 'shield-check-outline',
      tint: '#FCE7F3',
      color: '#EC5E9B',
      onPress: () => setShowPrivacyModal(true),
    },
    {
      label: 'Help and support',
      hint: 'Contact our support team',
      icon: 'headset',
      tint: '#DDF8E8',
      color: '#00A85A',
      onPress: () =>
        setSuccess({
          visible: true,
          icon: 'headset',
          iconColor: '#0B7A50',
          iconBackground: '#DDF8E8',
          title: 'Help & Support',
          message: 'Our team is available 7 days a week at support@laundrypickuppro.co.za or 0800 123 456.',
        }),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={GRADIENT_HEADER} style={styles.headerBanner}>
        <View style={styles.shine} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerIconPlaceholder} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
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
            {displayPhone ? (
              <Text style={styles.role}>{displayPhone}</Text>
            ) : (
              <Text style={styles.role}>System Administrator</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.editChip}
            activeOpacity={0.8}
            onPress={openEdit}
          >
            <MaterialCommunityIcons name="pencil-outline" size={16} color={ICON_DARK} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          {accountRows.map((row, index) => (
            <TouchableOpacity
              key={row.label}
              style={[styles.row, index === accountRows.length - 1 && styles.rowLast]}
              onPress={row.onPress}
            >
              <View style={[styles.rowIcon, { backgroundColor: row.tint }]}>
                <MaterialCommunityIcons name={row.icon} size={20} color={row.color} />
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowHint}>{row.hint}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={TEXT_MUTED} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
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
                trackColor={{ false: '#D5DCE3', true: '#0E9AA7' }}
                thumbColor={prefs[row.key] ? '#FFFFFF' : '#F5F7FA'}
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Application</Text>
        <View style={styles.card}>
          {appRows.map((row, index) => (
            <TouchableOpacity
              key={row.label}
              style={[styles.row, index === appRows.length - 1 && styles.rowLast]}
              onPress={row.onPress}
            >
              <View style={[styles.rowIcon, { backgroundColor: row.tint }]}>
                <MaterialCommunityIcons name={row.icon} size={20} color={row.color} />
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowHint}>{row.hint}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={TEXT_MUTED} />
            </TouchableOpacity>
          ))}

          <View style={[styles.row, styles.rowLast]}>
            <View style={[styles.rowIcon, { backgroundColor: '#D6F0F4' }]}>
              <MaterialCommunityIcons name="information-outline" size={20} color={TEAL} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>App version</Text>
              <Text style={styles.rowHint}>Laundry Pickup Pro</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowLogoutModal(true)}
        >
          <LinearGradient colors={GRADIENT_RED} style={styles.logoutButton}>
            <View style={styles.shine} />
            <MaterialCommunityIcons name="logout" size={20} color={WHITE} />
            <Text style={styles.logoutButtonText}>Log out</Text>
          </LinearGradient>
        </TouchableOpacity>
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
              Are you sure you want to log out of the admin portal?
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
                onPress={() => {
                  setShowLogoutModal(false);
                  signOut();
                }}
              >
                <Text style={styles.modalConfirmText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.editOverlay}>
          <View style={styles.editCard}>
            <View style={styles.editHeader}>
              <Text style={styles.editTitle}>Edit Profile</Text>
              <TouchableOpacity
                style={styles.editClose}
                onPress={() => setShowEditModal(false)}
              >
                <MaterialCommunityIcons name="close" size={20} color={TEXT_MUTED} />
              </TouchableOpacity>
            </View>

            <Text style={styles.editLabel}>Full name</Text>
            <View style={[styles.editInputField, editErrors.name && styles.editInputError]}>
              <MaterialCommunityIcons name="account-outline" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Your name"
                placeholderTextColor={TEXT_MUTED}
                autoCapitalize="words"
              />
            </View>
            {editErrors.name && <Text style={styles.editErrorText}>{editErrors.name}</Text>}

            <Text style={styles.editLabel}>Email address</Text>
            <View style={[styles.editInputField, editErrors.email && styles.editInputError]}>
              <MaterialCommunityIcons name="email-outline" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.editInput}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="you@example.com"
                placeholderTextColor={TEXT_MUTED}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {editErrors.email && <Text style={styles.editErrorText}>{editErrors.email}</Text>}

            <Text style={styles.editLabel}>Phone number</Text>
            <View style={[styles.editInputField, editErrors.phone && styles.editInputError]}>
              <MaterialCommunityIcons name="phone-outline" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.editInput}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Optional"
                placeholderTextColor={TEXT_MUTED}
                keyboardType="phone-pad"
              />
            </View>
            {editErrors.phone && <Text style={styles.editErrorText}>{editErrors.phone}</Text>}

            <TouchableOpacity
              style={styles.editSaveTouch}
              activeOpacity={0.9}
              onPress={saveProfile}
            >
              <LinearGradient colors={GRADIENT_HEADER} style={styles.editSave}>
                <Text style={styles.editSaveText}>Save changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.editOverlay}>
          <View style={styles.editCard}>
            <View style={styles.editHeader}>
              <Text style={styles.editTitle}>Change Password</Text>
              <TouchableOpacity
                style={styles.editClose}
                onPress={() => setShowPasswordModal(false)}
              >
                <MaterialCommunityIcons name="close" size={20} color={TEXT_MUTED} />
              </TouchableOpacity>
            </View>

            <Text style={styles.editLabel}>Current password</Text>
            <View style={[styles.editInputField, passwordErrors.current && styles.editInputError]}>
              <MaterialCommunityIcons name="lock-outline" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.editInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={TEXT_MUTED}
                secureTextEntry
              />
            </View>
            {passwordErrors.current && (
              <Text style={styles.editErrorText}>{passwordErrors.current}</Text>
            )}

            <Text style={styles.editLabel}>New password</Text>
            <View style={[styles.editInputField, passwordErrors.new && styles.editInputError]}>
              <MaterialCommunityIcons name="lock-reset" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.editInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="At least 6 characters"
                placeholderTextColor={TEXT_MUTED}
                secureTextEntry
              />
            </View>
            {passwordErrors.new && (
              <Text style={styles.editErrorText}>{passwordErrors.new}</Text>
            )}

            <Text style={styles.editLabel}>Confirm new password</Text>
            <View style={[styles.editInputField, passwordErrors.confirm && styles.editInputError]}>
              <MaterialCommunityIcons name="shield-key-outline" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.editInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter new password"
                placeholderTextColor={TEXT_MUTED}
                secureTextEntry
              />
            </View>
            {passwordErrors.confirm && (
              <Text style={styles.editErrorText}>{passwordErrors.confirm}</Text>
            )}

            <TouchableOpacity
              style={styles.editSaveTouch}
              activeOpacity={0.9}
              onPress={savePassword}
            >
              <LinearGradient colors={GRADIENT_HEADER} style={styles.editSave}>
                <Text style={styles.editSaveText}>Update password</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPrivacyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.editOverlay}>
          <View style={styles.privacyCard}>
            <View style={styles.editHeader}>
              <Text style={styles.editTitle}>Privacy Policy</Text>
              <TouchableOpacity
                style={styles.editClose}
                onPress={() => setShowPrivacyModal(false)}
              >
                <MaterialCommunityIcons name="close" size={20} color={TEXT_MUTED} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.privacyScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.privacyIntro}>
                This policy explains how Laundry Pickup Pro collects, uses and
                protects your personal information.
              </Text>
              {PRIVACY_SECTIONS.map((section) => (
                <View key={section.title} style={styles.privacySection}>
                  <Text style={styles.privacySectionTitle}>{section.title}</Text>
                  <Text style={styles.privacySectionBody}>{section.body}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <FancyAlert
        visible={success.visible}
        icon={success.icon}
        iconColor={success.iconColor}
        iconBackground={success.iconBackground}
        title={success.title}
        message={success.message}
        onClose={() => setSuccess((prev) => ({ ...prev, visible: false }))}
      />
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
    backgroundColor: '#F7F9FB',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 22,
    shadowColor: '#1F2933',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: WHITE,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: TEXT_DARK,
  },
  email: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  role: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    color: TEAL,
    marginTop: 2,
  },
  editChip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F6F9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 6,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: SECTION,
    marginBottom: 10,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 22,
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
  versionText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_MUTED,
  },
  logoutButton: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: DANGER,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
  },
  logoutButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: WHITE,
    marginLeft: 8,
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
  editOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  editCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  editTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: TEXT_DARK,
  },
  editClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F6F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 8,
  },
  editInputField: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  editInputError: {
    borderColor: DANGER,
  },
  editInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: TEXT_DARK,
  },
  editErrorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: DANGER,
    marginTop: -8,
    marginBottom: 10,
  },
  editSaveTouch: {
    borderRadius: 14,
    marginTop: 6,
  },
  editSave: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  editSaveText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: WHITE,
  },
  privacyCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    maxHeight: '80%',
  },
  privacyScroll: {
    flexGrow: 0,
  },
  privacyIntro: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: TEXT_MUTED,
    marginBottom: 14,
  },
  privacySection: {
    marginBottom: 14,
  },
  privacySectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
    marginBottom: 4,
  },
  privacySectionBody: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 19,
    color: TEXT_MUTED,
  },
});
