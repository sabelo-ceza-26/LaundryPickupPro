import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ICON_DARK = '#2B3642';
const TEXT_DARK = '#1F2933';
const BORDER = '#E8ECF1';

type Props = {
  title: string;
  onBack: () => void;
};

export default function BookingHeader({ title, onBack }: Props) {
  const openMenu = () => {
    Alert.alert('Options', 'What would you like to do?', [
      { text: 'Help', style: 'cancel' },
      { text: 'Cancel booking' },
    ]);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerIcon} onPress={onBack}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={ICON_DARK} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.headerIcon} onPress={openMenu}>
        <MaterialCommunityIcons name="dots-horizontal" size={24} color={ICON_DARK} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
});
