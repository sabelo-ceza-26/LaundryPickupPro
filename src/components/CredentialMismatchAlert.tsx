import React from 'react';
import {
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const DANGER = '#E5484D';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';

const GRADIENT_TEAL = [TEAL_MID, TEAL] as const;

type Props = {
  visible: boolean;
  onClose: () => void;
};

const OFFICE_ADDRESS = '102 Albert Rd, Woodstock, Cape Town, 7925';
const PHONE = '+27 10 876 5432';
const EMAIL = 'support@laundrypickuppro.co.za';

export default function CredentialMismatchAlert({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="shield-lock-outline" size={34} color={DANGER} />
          </View>
          <Text style={styles.title}>Credentials Not Recognised</Text>
          <Text style={styles.message}>
            The email and password you entered do not match any registered driver on file.{'\n\n'}
            Please contact the administrator to be registered as a driver.
          </Text>

          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View style={styles.contactIconWrap}>
                <MaterialCommunityIcons name="map-marker-outline" size={18} color={TEAL} />
              </View>
              <View style={styles.contactBody}>
                <Text style={styles.contactLabel}>Office Address</Text>
                <Text style={styles.contactValue}>{OFFICE_ADDRESS}</Text>
              </View>
            </View>

            <View style={styles.contactDivider} />

            <TouchableOpacity
              style={styles.contactRow}
              activeOpacity={0.7}
              onPress={() => Linking.openURL(`tel:${PHONE.replace(/\s/g, '')}`)}
            >
              <View style={styles.contactIconWrap}>
                <MaterialCommunityIcons name="phone-outline" size={18} color={TEAL} />
              </View>
              <View style={styles.contactBody}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={[styles.contactValue, styles.contactLink]}>{PHONE}</Text>
              </View>
              <MaterialCommunityIcons name="phone" size={16} color={TEAL} />
            </TouchableOpacity>

            <View style={styles.contactDivider} />

            <TouchableOpacity
              style={styles.contactRow}
              activeOpacity={0.7}
              onPress={() => Linking.openURL(`mailto:${EMAIL}`)}
            >
              <View style={styles.contactIconWrap}>
                <MaterialCommunityIcons name="email-outline" size={18} color={TEAL} />
              </View>
              <View style={styles.contactBody}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={[styles.contactValue, styles.contactLink]}>{EMAIL}</Text>
              </View>
              <MaterialCommunityIcons name="email" size={16} color={TEAL} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.buttonTouch}
            activeOpacity={0.85}
            onPress={onClose}
          >
            <LinearGradient colors={GRADIENT_TEAL} style={styles.button}>
              <Text style={styles.buttonText}>Got it</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.55)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 26,
    alignItems: 'center',
    elevation: 14,
    shadowColor: '#0F363F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FDE7E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: TEXT_DARK,
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 18,
  },
  contactCard: {
    alignSelf: 'stretch',
    backgroundColor: '#F9FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECF1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#E2ECEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },
  contactBody: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
  },
  contactValue: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: TEXT_DARK,
    marginTop: 1,
  },
  contactLink: {
    color: TEAL,
  },
  contactDivider: {
    height: 1,
    backgroundColor: '#EEF1F5',
    marginVertical: 2,
  },
  buttonTouch: {
    alignSelf: 'stretch',
    borderRadius: 15,
  },
  button: {
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
