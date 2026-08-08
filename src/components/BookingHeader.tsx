import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import FancyAlert from './FancyAlert';

const TEAL = '#0F363F';
const TEXT_MUTED = '#7A869A';

const GRADIENT_HEADER = ['#FFFFFF', '#F2F4F7'] as const;

type Props = {
  title: string;
  onBack: () => void;
};

export default function BookingHeader({ title, onBack }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);

  const openHelp = () => {
    setMenuVisible(false);
    setHelpVisible(true);
  };

  const openCancel = () => {
    setMenuVisible(false);
    setConfirmVisible(true);
  };

  const keepBooking = () => setConfirmVisible(false);

  const cancelBooking = () => {
    setConfirmVisible(false);
    onBack();
  };

  return (
    <LinearGradient colors={GRADIENT_HEADER} style={styles.header}>
      <TouchableOpacity style={styles.headerIcon} onPress={onBack}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2933" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.headerIcon} onPress={() => setMenuVisible(true)}>
        <MaterialCommunityIcons name="dots-horizontal" size={24} color="#1F2933" />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.backdrop}>
          <TouchableOpacity
            style={styles.backdropTouch}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <LinearGradient colors={GRADIENT_HEADER} style={styles.sheetHeader}>
              <View style={styles.sheetHeaderIcon}>
                <MaterialCommunityIcons name="tune-variant" size={22} color="#1F2933" />
              </View>
              <View style={styles.sheetHeaderText}>
                <Text style={styles.sheetTitle}>Options</Text>
                <Text style={styles.sheetSubtitle}>
                  What would you like to do?
                </Text>
              </View>
            </LinearGradient>

            <TouchableOpacity style={styles.menuItem} onPress={openHelp} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: '#E4EEFF' }]}>
                <MaterialCommunityIcons name="help-circle-outline" size={22} color="#2E6BFF" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Help</Text>
                <Text style={styles.menuDesc}>Get in touch with our support team</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#C3CDD7" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={openCancel}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: '#FDE7E8' }]}>
                <MaterialCommunityIcons name="close-circle-outline" size={22} color="#E5484D" />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: '#E5484D' }]}>
                  Cancel booking
                </Text>
                <Text style={styles.menuDesc}>Exit this booking without saving</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#C3CDD7" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={keepBooking}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <MaterialCommunityIcons name="close-circle-outline" size={36} color="#E5484D" />
            </View>
            <Text style={styles.confirmTitle}>Cancel this booking?</Text>
            <Text style={styles.confirmDesc}>
              All the details you entered will be lost and the booking will be
              discarded.
            </Text>
            <TouchableOpacity
              style={styles.confirmKeepBtn}
              onPress={keepBooking}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="heart-outline" size={16} color={TEAL} />
              <Text style={styles.confirmKeepText}>Keep booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmDangerBtn}
              onPress={cancelBooking}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="close" size={16} color="#FFFFFF" />
              <Text style={styles.confirmDangerText}>Yes, cancel booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FancyAlert
        visible={helpVisible}
        title="Help"
        message="Contact our support team at support@laundrypickuppro.com and we'll get back to you within 24 hours."
        icon="lifebuoy"
        iconColor="#2E6BFF"
        iconBackground="#E4EEFF"
        buttonText="Got it"
        onClose={() => setHelpVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF1',
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF1F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E6EB',
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1F2933',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 28,
    shadowColor: '#0F363F',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D8DFE6',
    marginTop: 10,
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E8ECF1',
  },
  sheetHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F0F3F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sheetHeaderText: {
    flex: 1,
  },
  sheetTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#1F2933',
  },
  sheetSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#1F2933',
  },
  menuDesc: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EEF1F5',
    marginVertical: 2,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.55)',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
    elevation: 14,
    shadowColor: '#0F363F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  confirmIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FDE7E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  confirmTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1F2933',
    marginBottom: 6,
  },
  confirmDesc: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmKeepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: TEAL,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  confirmKeepText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEAL,
    marginLeft: 6,
  },
  confirmDangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 15,
    backgroundColor: '#E5484D',
  },
  confirmDangerText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
