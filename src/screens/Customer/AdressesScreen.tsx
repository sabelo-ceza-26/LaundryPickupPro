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

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const TEAL_TINT = '#E2ECEB';
const ICON_DARK = '#2B3642';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';
const DANGER = '#E5484D';

const GRADIENT_TEAL = [TEAL_MID, TEAL] as const;

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
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={ICON_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Addresses</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={openAdd}>
          <MaterialCommunityIcons name="plus" size={24} color={TEAL} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          addresses.length > 0 ? (
            <View style={styles.defaultNotice}>
              <MaterialCommunityIcons name="home-map-marker" size={20} color={TEAL} />
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
            <MaterialCommunityIcons name="map-marker-plus-outline" size={52} color={TEAL_TINT} />
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
                color={item.isDefault ? WHITE : TEAL}
              />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardLabel}>{item.label}</Text>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardAddress}>{item.address}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.cardAction}
                  onPress={() => openEdit(item)}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={16} color={TEAL} />
                  <Text style={styles.cardActionText}>Edit</Text>
                </TouchableOpacity>
                {!item.isDefault && (
                  <TouchableOpacity
                    style={styles.cardAction}
                    onPress={() => handleSetDefault(item)}
                  >
                    <MaterialCommunityIcons name="check-circle-outline" size={16} color={TEAL} />
                    <Text style={styles.cardActionText}>Set default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.cardAction}
                  onPress={() => handleDelete(item)}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={16} color={DANGER} />
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
                <LinearGradient colors={GRADIENT_TEAL} style={styles.modalSave}>
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
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  defaultNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F5F4',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  defaultNoticeText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#4A5C64',
    marginLeft: 10,
  },
  defaultNoticeStrong: {
    fontFamily: 'Poppins_600SemiBold',
    color: TEXT_DARK,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 12,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: TEAL_TINT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIconDefault: {
    backgroundColor: TEAL,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: TEAL_TINT,
  },
  defaultBadgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    color: TEAL,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  cardActionText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEAL,
    marginLeft: 4,
  },
  cardActionTextDanger: {
    color: DANGER,
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
  },
  modalSaveText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: WHITE,
  },
});
