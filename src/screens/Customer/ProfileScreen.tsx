import React, { useState } from 'react';
import {
  Modal,
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
import { useNavigation } from '@react-navigation/native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import FancyAlert from '../../components/FancyAlert';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../context/OrdersContext';
import { isEmail, isPhone, isRequired } from '../../utils/validation';
import type { CustomerTabNavigation } from '../../navigation/types';
import { ROLE_LABELS } from '../../types';

type MenuRow = {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string;
  color: string;
  onPress: (navigation: CustomerTabNavigation) => void;
};

const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const PURPLE = '#7857FF';
const PURPLE_TINT = '#EFEBFF';
const AMBER = '#E8960C';
const AMBER_TINT = '#FFF0B8';
const GREEN = '#00A85A';
const GREEN_TINT = '#DDF8E8';
const TEAL_HEADING = '#0E7A86';
const ICON_DARK = '#2B3642';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';
const DANGER = '#E5484D';

const GRADIENT_VIBRANT = [BLUE, PURPLE] as const;

const menuRows: MenuRow[] = [
  {
    label: 'Account Settings',
    icon: 'account-cog-outline',
    tint: PURPLE_TINT,
    color: PURPLE,
    onPress: (navigation) => navigation.navigate('Settings'),
  },
  {
    label: 'Notifications',
    icon: 'bell-outline',
    tint: '#FFF0B8',
    color: '#F4A928',
    onPress: (navigation) => navigation.navigate('Notifications'),
  },
  {
    label: 'Addresses',
    icon: 'map-marker-multiple-outline',
    tint: '#E4EEFF',
    color: '#2E6BFF',
    onPress: (navigation) => navigation.navigate('Addresses'),
  },
  {
    label: 'Help & Support',
    icon: 'headset',
    tint: '#DDF8E8',
    color: '#00A85A',
    onPress: (navigation) => navigation.navigate('Support'),
  },
];

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useAuth();
  const { orders } = useOrders();
  const navigation = useNavigation<CustomerTabNavigation>();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);

  if (!fontsLoaded) return null;

  const displayName = user?.name ?? 'Matthew Yako';
  const displayEmail = user?.email ?? 'matthew@example.com';
  const displayPhone = user?.phone ?? '083 987 5462';
  const roleLabel = user?.role ? ROLE_LABELS[user.role] : 'Customer';
  const totalDelivered = orders.filter((o) => o.status === 'Delivered').length;
  const activeCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  const openEdit = () => {
    setEditName(user?.name ?? displayName);
    setEditEmail(user?.email ?? displayEmail);
    setEditPhone(user?.phone ?? '');
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
    setSaveSuccessVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialCommunityIcons name="cog-outline" size={22} color={ICON_DARK} />
          </TouchableOpacity>
        </View>

        <LinearGradient colors={GRADIENT_VIBRANT} style={styles.profileCard}>
          <View style={styles.shine} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
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
          <TouchableOpacity
            style={styles.editChip}
            activeOpacity={0.8}
            onPress={openEdit}
          >
            <MaterialCommunityIcons name="pencil-outline" size={17} color={WHITE} />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: BLUE_TINT }]}>
              <MaterialCommunityIcons name="receipt-text-outline" size={16} color={BLUE} />
            </View>
            <Text style={[styles.statNumber, { color: BLUE }]}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: AMBER_TINT }]}>
              <MaterialCommunityIcons name="progress-clock" size={16} color={AMBER} />
            </View>
            <Text style={[styles.statNumber, { color: AMBER }]}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: GREEN_TINT }]}>
              <MaterialCommunityIcons
                name="package-variant-closed-check"
                size={16}
                color={GREEN}
              />
            </View>
            <Text style={[styles.statNumber, { color: GREEN }]}>{totalDelivered}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.menuCard}>
          {menuRows.map((row, index) => (
            <TouchableOpacity
              key={row.label}
              style={[
                styles.menuRow,
                index === menuRows.length - 1 && styles.menuRowLast,
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
              <LinearGradient colors={GRADIENT_VIBRANT} style={styles.editSave}>
                <Text style={styles.editSaveText}>Save changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FancyAlert
        visible={saveSuccessVisible}
        icon="account-check-outline"
        iconColor="#0B7A50"
        iconBackground="#DDF8E8"
        title="Profile updated"
        message="Your profile details have been saved successfully."
        onClose={() => setSaveSuccessVisible(false)}
      />
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: TEXT_DARK,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F6F9',
    justifyContent: 'center',
    alignItems: 'center',
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
  editChip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 6,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 22,
  },
  statCard: {
    width: '31%',
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: TEXT_DARK,
  },
  statLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEAL_HEADING,
    marginBottom: 10,
  },
  menuCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 22,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F4',
  },
  menuRowLast: {
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
});
