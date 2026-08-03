import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AdminStackParamList } from '../../navigation/AdminNavigator';

type Props = NativeStackScreenProps<AdminStackParamList, 'Payments'>;

type ServiceItemProps = {
  title: string;
  subtitle: string;
  price: string;
  enabled: boolean;
  onToggle: () => void;
};

function ServiceItem({
  title,
  subtitle,
  price,
  enabled,
  onToggle,
}: ServiceItemProps) {
  return (
    <View style={styles.serviceCard}>
      <View style={styles.iconPlaceholder} />

      <View style={styles.serviceDetails}>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceSubtitle}>{subtitle}</Text>
      </View>

      <Text style={styles.priceText}>{price}</Text>

      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{
          false: '#D8DEE6',
          true: '#7ADDC5',
        }}
        thumbColor={enabled ? '#0DBB8B' : '#F4F4F4'}
      />
    </View>
  );
}

export default function PaymentScreen({ navigation }: Props) {
  const [smallLoadEnabled, setSmallLoadEnabled] = useState(true);
  const [mediumLoadEnabled, setMediumLoadEnabled] = useState(true);
  const [largeLoadEnabled, setLargeLoadEnabled] = useState(true);
  const [bagEnabled, setBagEnabled] = useState(true);
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Services & Pricing</Text>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() =>
              Alert.alert(
                'Pricing settings',
                'Advanced pricing settings will be connected here.'
              )
            }
          >
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeading}>PRICE PER KG</Text>
          <Text style={styles.sectionDescription}>
            Charge based on the total weight of the laundry
          </Text>
        </View>

        <ServiceItem
          title="0–5 kg"
          subtitle="Price for laundry up to 5kg"
          price="R35 / kg"
          enabled={smallLoadEnabled}
          onToggle={() => setSmallLoadEnabled(!smallLoadEnabled)}
        />

        <ServiceItem
          title="5kg–10 kg"
          subtitle="Price for laundry between 5kg–10kg"
          price="R85 / kg"
          enabled={mediumLoadEnabled}
          onToggle={() => setMediumLoadEnabled(!mediumLoadEnabled)}
        />

        <ServiceItem
          title="10+ kg"
          subtitle="Price for laundry above 10kg"
          price="R50 / kg"
          enabled={largeLoadEnabled}
          onToggle={() => setLargeLoadEnabled(!largeLoadEnabled)}
        />

        <Text style={styles.sectionHeading}>PRICE PER BAG</Text>

        <ServiceItem
          title="Per laundry Bag"
          subtitle="Up to 10 kg per bag"
          price="R100"
          enabled={bagEnabled}
          onToggle={() => setBagEnabled(!bagEnabled)}
        />

        <Text style={styles.sectionHeading}>PICKUP & DELIVERY FEE</Text>

        <ServiceItem
          title="Pickup & Drop off"
          subtitle="For collection and Drop off"
          price="R150"
          enabled={deliveryEnabled}
          onToggle={() => setDeliveryEnabled(!deliveryEnabled)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },

  backText: {
    fontSize: 34,
    color: '#12263A',
    lineHeight: 34,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#12263A',
  },

  settingsButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingsIcon: {
    fontSize: 17,
    color: '#12263A',
  },

  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  sectionHeading: {
    fontSize: 10,
    fontWeight: '700',
    color: '#173D8F',
    marginTop: 10,
    marginBottom: 8,
  },

  sectionDescription: {
    fontSize: 9,
    color: '#8A94A3',
    marginLeft: 5,
  },

  serviceCard: {
    minHeight: 72,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },

  iconPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    marginRight: 10,
  },

  serviceDetails: {
    flex: 1,
  },

  serviceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#12263A',
  },

  serviceSubtitle: {
    marginTop: 3,
    fontSize: 9,
    color: '#87909C',
  },

  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#173D8F',
    marginRight: 8,
  },
});