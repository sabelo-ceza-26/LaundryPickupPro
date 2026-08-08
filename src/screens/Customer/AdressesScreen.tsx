import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
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

import type { CustomerStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Addresses'>;

type SavedAddress = {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
};

const TEAL = '#0E9AA7';
const TEAL_TINT = '#D6F0F4';
const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const GREEN = '#00A85A';
const GREEN_TINT = '#DDF8E8';
const RED = '#E5484D';
const RED_TINT = '#FDE7E8';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';

const GRADIENT_VIBRANT = ['#2E6BFF', '#7857FF'] as const;
const GRADIENT_GREEN = ['#00A85A', '#0B7A50'] as const;

const initialAddresses: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    address: '172 Sir Lowry Rd, Woodstock',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    address: '123 Main Road, Cape Town',
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: 'Work',
    address: '45 Albert Road, Observatory',
    isDefault: false,
  },
];

type EditingAddress = SavedAddress | null;

export default function AdressesScreen({ navigation }: Props) {
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EditingAddress>(null);
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [makeDefault, setMakeDefault] = useState(false);

  if (!fontsLoaded) return null;

  const openAdd = () => {
    setEditing(null);
    setLabel('');
    setAddress('');
    setMakeDefault(addresses.length === 0);
    setShowModal(true);
  };

  const openEdit = (item: SavedAddress) => {
    setEditing(item);
    setLabel(item.label);
    setAddress(item.address);
    setMakeDefault(item.isDefault);
    setShowModal(true);
  };

  const handleDelete = (item: SavedAddress) => {
    Alert.alert(
      'Delete address',
      `Remove "${item.label}" – ${item.address}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses((prev) => prev.filter((a) => a.id !== item.id));
          },
        },
      ]
    );
  };

  const handleSave = () => {
    const trimmedLabel = label.trim();
    const trimmedAddress = address.trim();
    if (!trimmedLabel || !trimmedAddress) {
      Alert.alert('Missing details', 'Please enter a label and address.');
      return;
    }

    setAddresses((prev) => {
      const base = makeDefault
        ? prev.map((a) => ({ ...a, isDefault: false }))
        : prev;

      if (editing) {
        const updated = base.map((a) =>
          a.id === editing.id
            ? { ...a, label: trimmedLabel, address: trimmedAddress, isDefault: makeDefault }
            : a
        );
        if (!makeDefault && !updated.some((a) => a.isDefault)) {
          return updated.map((a, i) => (i === 0 ? { ...a, isDefault: true } : a));
        }
        return updated;
      }

      const next: SavedAddress = {
        id: `addr-${Date.now()}`,
        label: trimmedLabel,
        address: trimmedAddress,
        isDefault: makeDefault,
      };
      const result = [next, ...base];
      if (!result.some((a) => a.isDefault)) {
        result[0] = { ...result[0], isDefault: true };
      }
      return result;
    });

    setShowModal(false);
  };

  const handleSetDefault = (item: SavedAddress) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === item.id }))
    );
  };

  const defaultAddress = addresses.find((a) => a.isDefault);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={GRADIENT_VIBRANT} style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Addresses</Text>
        <TouchableOpacity style={styles.headerAdd} onPress={openAdd}>
          <MaterialCommunityIcons name="plus" size={24} color={BLUE} />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          addresses.length > 0 ? (
            <View style={styles.defaultNotice}>
              <View style={styles.defaultNoticeIcon}>
                <MaterialCommunityIcons name="home-map-marker" size={20} color={GREEN} />
              </View>
              <Text style={styles.defaultNoticeText}>
                Default pickup address:{' '}
                <Text style={styles.defaultNoticeStrong}>
                  {defaultAddress?.address ?? '—'}
                </Text>
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="map-marker-plus-outline" size={52} color="#C4D2E0" />
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptySubtitle}>
              Add a home or work address to make booking faster.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.cardIcon, item.isDefault && styles.cardIconDefault]}>
              <MaterialCommunityIcons
                name={item.isDefault ? 'home-variant' : 'map-marker-outline'}
                size={22}
                color={item.isDefault ? TEAL : BLUE}
              />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardLabel}>{item.label}</Text>
                {item.isDefault && (
                  <LinearGradient colors={GRADIENT_GREEN} style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </LinearGradient>
                )}
              </View>
              <Text style={styles.cardAddress}>{item.address}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.cardAction, styles.cardActionEdit]}
                  onPress={() => openEdit(item)}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={14} color={BLUE} />
                  <Text style={styles.cardActionText}>Edit</Text>
                </TouchableOpacity>
                {!item.isDefault && (
                  <TouchableOpacity
                    style={[styles.cardAction, styles.cardActionTeal]}
                    onPress={() => handleSetDefault(item)}
                  >
                    <MaterialCommunityIcons name="check-circle-outline" size={14} color={TEAL} />
                    <Text style={[styles.cardActionText, styles.cardActionTextTeal]}>
                      Set default
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.cardAction,
                    styles.cardActionDanger,
                    !item.isDefault && styles.cardActionLast,
                  ]}
                  onPress={() => handleDelete(item)}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={14} color={RED} />
                  <Text style={[styles.cardActionText, styles.cardActionTextDanger]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editing ? 'Edit Address' : 'Add Address'}
            </Text>

            <Text style={styles.inputLabel}>Label</Text>
            <View style={styles.inputField}>
              <MaterialCommunityIcons name="tag-outline" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.input}
                value={label}
                onChangeText={setLabel}
                placeholder="Home, Work…"
                placeholderTextColor={TEXT_MUTED}
              />
            </View>

            <Text style={styles.inputLabel}>Address</Text>
            <View style={styles.inputField}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color={TEXT_MUTED} />
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Street, Suburb, City"
                placeholderTextColor={TEXT_MUTED}
              />
            </View>

            <TouchableOpacity
              style={styles.defaultRow}
              onPress={() => setMakeDefault(!makeDefault)}
            >
              <View style={[styles.checkbox, makeDefault && styles.checkboxChecked]}>
                {makeDefault && (
                  <MaterialCommunityIcons name="check" size={13} color={WHITE} />
                )}
              </View>
              <Text style={styles.defaultRowText}>Use as default address</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveTouch} activeOpacity={0.9} onPress={handleSave}>
                <LinearGradient colors={GRADIENT_VIBRANT} style={styles.modalSave}>
                  <View style={styles.shine} />
                  <Text style={styles.modalSaveText}>Save</Text>
                </LinearGradient>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAdd: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1F2933',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: WHITE,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  defaultNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GREEN_TINT,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  defaultNoticeIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  defaultNoticeText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#3E7A5E',
  },
  defaultNoticeStrong: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#0B7A50',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#1F2933',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: BLUE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIconDefault: {
    backgroundColor: TEAL_TINT,
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
  },
  defaultBadge: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  defaultBadgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    color: WHITE,
  },
  cardAddress: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 3,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  cardAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },
  cardActionLast: {
    marginRight: 0,
  },
  cardActionEdit: {
    backgroundColor: BLUE_TINT,
  },
  cardActionTeal: {
    backgroundColor: TEAL_TINT,
  },
  cardActionDanger: {
    backgroundColor: RED_TINT,
  },
  cardActionText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: BLUE,
    marginLeft: 4,
  },
  cardActionTextTeal: {
    color: TEAL,
  },
  cardActionTextDanger: {
    color: RED,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: TEXT_DARK,
    marginTop: 14,
  },
  emptySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 6,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  modalTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: TEXT_DARK,
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 8,
  },
  inputField: {
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
  input: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: TEXT_DARK,
  },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#C3D1CF',
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  defaultRowText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#4A5C64',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancel: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 8,
  },
  modalCancelText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: TEXT_MUTED,
  },
  modalSaveTouch: {
    borderRadius: 12,
  },
  modalSave: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  modalSaveText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: WHITE,
  },
  shine: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 90,
    height: 120,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.14)',
    transform: [{ rotate: '20deg' }],
  },
});
