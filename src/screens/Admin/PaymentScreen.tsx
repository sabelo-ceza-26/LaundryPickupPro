import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
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
import { useAdmin } from '../../context/AdminContext';
import type { Pricing } from '../../context/AdminContext';
import FancyAlert from '../../components/FancyAlert';

type Props = NativeStackScreenProps<AdminStackParamList, 'Payments'>;

const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const PURPLE = '#7857FF';
const TEAL_HEADING = '#0E7A86';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';
const DANGER = '#E5484D';

const GRADIENT_VIBRANT = [BLUE, PURPLE] as const;

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

type ServiceItemProps = {
  title: string;
  subtitle: string;
  price: string;
  enabled: boolean;
  icon: Icon;
  tint: string;
  color: string;
  onToggle: () => void;
};

function ServiceItem({
  title,
  subtitle,
  price,
  enabled,
  icon,
  tint,
  color,
  onToggle,
}: ServiceItemProps) {
  return (
    <View style={styles.serviceCard}>
      <View style={[styles.iconWrap, { backgroundColor: tint }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>

      <View style={styles.serviceDetails}>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.serviceRight}>
        <Text style={styles.priceText}>{price}</Text>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#D5DCE3', true: '#9EB5EB' }}
          thumbColor={enabled ? BLUE : '#F4F4F4'}
        />
      </View>
    </View>
  );
}

type PricingKey = keyof Pricing;

const PRICING_FIELDS: {
  key: PricingKey;
  label: string;
  hint: string;
  suffix: string;
}[] = [
  { key: 'delivery', label: 'Delivery Fee', hint: 'Flat fee for pickup & delivery', suffix: 'per trip' },
  { key: 'express', label: 'Distance Rate', hint: 'Per kilometer between pickup and delivery', suffix: '/km' },
];

type SettingsModalProps = {
  visible: boolean;
  pricing: Pricing;
  onClose: () => void;
  onSave: (pricing: Pricing) => void;
};

function PricingSettingsModal({
  visible,
  pricing,
  onClose,
  onSave,
}: SettingsModalProps) {
  const [drafts, setDrafts] = useState<Record<PricingKey, string>>(() => {
    const next = {} as Record<PricingKey, string>;
    PRICING_FIELDS.forEach((field) => {
      next[field.key] = String(pricing[field.key].price);
    });
    return next;
  });
  const [enabled, setEnabled] = useState<Record<PricingKey, boolean>>(() => {
    const next = {} as Record<PricingKey, boolean>;
    PRICING_FIELDS.forEach((field) => {
      next[field.key] = pricing[field.key].enabled;
    });
    return next;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleShow = () => {
    const nextDrafts: Record<PricingKey, string> = {} as Record<PricingKey, string>;
    const nextEnabled: Record<PricingKey, boolean> = {} as Record<PricingKey, boolean>;
    PRICING_FIELDS.forEach((field) => {
      nextDrafts[field.key] = String(pricing[field.key].price);
      nextEnabled[field.key] = pricing[field.key].enabled;
    });
    setDrafts(nextDrafts);
    setEnabled(nextEnabled);
    setErrors({});
  };

  const handleSave = () => {
    const nextErrors: Record<string, string> = {};
    const next: Partial<Pricing> = {};

    PRICING_FIELDS.forEach((field) => {
      const value = Number(drafts[field.key]);
      if (!drafts[field.key].trim() || Number.isNaN(value) || value <= 0) {
        nextErrors[field.key] = 'Enter a valid price';
      } else {
        next[field.key] = {
          price: value,
          enabled: enabled[field.key],
        };
      }
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave(next as Pricing);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={handleShow}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <LinearGradient colors={GRADIENT_VIBRANT} style={styles.sheetHeader}>
            <View style={styles.shine} />
            <View style={styles.sheetHeaderRow}>
              <View style={styles.sheetHeaderIcon}>
                <MaterialCommunityIcons name="cog-outline" size={20} color={WHITE} />
              </View>
              <Text style={styles.sheetHeaderTitle}>Pricing Settings</Text>
              <TouchableOpacity
                style={styles.sheetCloseButton}
                activeOpacity={0.85}
                onPress={onClose}
              >
                <MaterialCommunityIcons name="close" size={20} color={WHITE} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sheetNote}>
              Adjust the price charged to customers. Toggled-off services are
              hidden from the booking flow.
            </Text>

            {PRICING_FIELDS.map((field) => (
              <View key={field.key} style={styles.settingRow}>
                <View style={styles.settingBody}>
                  <Text style={styles.settingLabel}>{field.label}</Text>
                  <Text style={styles.settingHint}>{field.hint}</Text>
                </View>
                <View style={styles.settingInputWrap}>
                  <Text style={styles.settingCurrency}>R</Text>
                  <TextInput
                    style={[
                      styles.settingInput,
                      errors[field.key] && styles.settingInputError,
                    ]}
                    value={drafts[field.key] ?? ''}
                    onChangeText={(text) =>
                      setDrafts((prev) => ({ ...prev, [field.key]: text }))
                    }
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={TEXT_MUTED}
                  />
                  <Text style={styles.settingSuffix}>{field.suffix}</Text>
                </View>
                <Switch
                  value={enabled[field.key] ?? true}
                  onValueChange={(value) =>
                    setEnabled((prev) => ({ ...prev, [field.key]: value }))
                  }
                  trackColor={{ false: '#D5DCE3', true: '#9EB5EB' }}
                  thumbColor={enabled[field.key] ? BLUE : '#F4F4F4'}
                />
              </View>
            ))}
            {Object.keys(errors).length > 0 && (
              <Text style={styles.sheetErrorText}>
                Please fix the highlighted prices before saving.
              </Text>
            )}

            <TouchableOpacity style={styles.saveTouch} activeOpacity={0.9} onPress={handleSave}>
              <LinearGradient colors={GRADIENT_VIBRANT} style={styles.saveButton}>
                <MaterialCommunityIcons name="content-save-outline" size={18} color={WHITE} />
                <Text style={styles.saveText}>Save Pricing</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const isWeb = Platform.OS === 'web';

export default function PaymentScreen({ navigation }: Props) {
  const { pricing, updatePricing } = useAdmin();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [savedVisible, setSavedVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const togglePrice = (key: PricingKey) => {
    updatePricing({
      [key]: {
        price: pricing[key].price,
        enabled: !pricing[key].enabled,
      },
    } as Partial<Pricing>);
  };

  const handleSavePricing = (next: Pricing) => {
    updatePricing(next);
    setSettingsVisible(false);
    setSavedVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={GRADIENT_VIBRANT} style={styles.headerBanner}>
        <View style={styles.shine} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Services &amp; Pricing</Text>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => setSettingsVisible(true)}
          >
            <MaterialCommunityIcons name="cog-outline" size={20} color={WHITE} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeading}>Pickup &amp; Delivery Pricing</Text>
        </View>

        <ServiceItem
          title="Delivery Fee"
          subtitle="Flat fee for pickup and delivery"
          price={`R${pricing.delivery.price}`}
          enabled={pricing.delivery.enabled}
          icon="truck-delivery-outline"
          tint="#FFF0B8"
          color="#E8960C"
          onToggle={() => togglePrice('delivery')}
        />

        <ServiceItem
          title="Distance Rate"
          subtitle="Per kilometer between pickup and delivery"
          price={`R${pricing.express.price} / km`}
          enabled={pricing.express.enabled}
          icon="map-marker-distance"
          tint="#E4EEFF"
          color={BLUE}
          onToggle={() => togglePrice('express')}
        />
      </ScrollView>

      <PricingSettingsModal
        visible={settingsVisible}
        pricing={pricing}
        onClose={() => setSettingsVisible(false)}
        onSave={handleSavePricing}
      />

      <FancyAlert
        visible={savedVisible}
        icon="tag-check-outline"
        iconColor="#0B7A50"
        iconBackground="#DDF8E8"
        title="Pricing updated"
        message="Your services and pricing have been saved successfully."
        onClose={() => setSavedVisible(false)}
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
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: WHITE,
  },
  scroll: {
    backgroundColor: '#F5F7FA',
  },
  container: {
    paddingHorizontal: isWeb ? 32 : 20,
    paddingBottom: 40,
    ...(isWeb ? { maxWidth: 700, alignSelf: 'center', width: '100%' } : {}),
  },
  sectionHeadingRow: {
    marginTop: 6,
    marginBottom: 12,
  },
  sectionHeading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEAL_HEADING,
  },
  serviceCard: {
    minHeight: 72,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
  },
  serviceSubtitle: {
    marginTop: 3,
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    color: TEXT_MUTED,
  },
  serviceRight: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    color: BLUE,
    marginBottom: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#F5F7FA',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '92%',
    overflow: 'hidden',
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetHeaderIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetHeaderTitle: {
    flex: 1,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: WHITE,
    marginLeft: 12,
  },
  sheetCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetScroll: {
    flexGrow: 0,
  },
  sheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
  },
  sheetNote: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: TEXT_MUTED,
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  settingBody: {
    flex: 1,
    marginRight: 8,
  },
  settingLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEXT_DARK,
  },
  settingHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    color: TEXT_MUTED,
    marginTop: 1,
  },
  settingInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F9',
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 38,
    marginRight: 8,
  },
  settingCurrency: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEXT_MUTED,
    marginRight: 2,
  },
  settingInput: {
    minWidth: 44,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEXT_DARK,
    padding: 0,
    textAlign: 'center',
  },
  settingInputError: {
    color: DANGER,
  },
  settingSuffix: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    color: TEXT_MUTED,
    marginLeft: 3,
  },
  sheetErrorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: DANGER,
    marginBottom: 10,
  },
  saveTouch: {
    borderRadius: 16,
    marginTop: 4,
  },
  saveButton: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  saveText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: WHITE,
    marginLeft: 8,
  },
});
