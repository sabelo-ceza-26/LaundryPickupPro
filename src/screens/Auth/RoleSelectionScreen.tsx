import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Logo from '../../components/Logo';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import type { Role } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Role'>;

type RoleOption = {
  role: Role;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  tint: string;
  accent: string;
  tag?: string;
};

const roleOptions: RoleOption[] = [
  {
    role: 'customer',
    title: 'Customer',
    description: 'Book laundry pickups and track your deliveries.',
    icon: 'account',
    iconColor: colors.accent,
    tint: colors.accentTint,
    accent: colors.accent,
    tag: 'Most popular',
  },
  {
    role: 'driver',
    title: 'Driver',
    description: 'Fulfill orders, pickups and deliveries.',
    icon: 'car',
    iconColor: colors.success,
    tint: '#E6F7F0',
    accent: colors.success,
  },
  {
    role: 'admin',
    title: 'Administrator',
    description: 'Manage orders, users, pricing and reports.',
    icon: 'shield-account',
    iconColor: colors.tertiary,
    tint: '#F0ECFF',
    accent: colors.tertiary,
  },
];

export default function RoleSelectionScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Logo size="sm" style={styles.logo} />

        <View style={styles.header}>
          <Text style={styles.eyebrow}>LAUNDRYPICKUPPRO</Text>
          <Text style={styles.title}>Get started</Text>
          <Text style={styles.subtitle}>
            Select how you'd like to continue.
          </Text>
        </View>

        <View style={styles.cardList}>
          {roleOptions.map((option) => (
            <TouchableOpacity
              key={option.role}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('Auth', { role: option.role })
              }
            >
              {!!option.tag && (
                <View style={[styles.tag, { backgroundColor: option.tint }]}>
                  <Text style={[styles.tagText, { color: option.accent }]}>
                    {option.tag}
                  </Text>
                </View>
              )}

              <View style={[styles.iconBubble, { backgroundColor: option.tint }]}>
                <MaterialCommunityIcons
                  name={option.icon}
                  size={30}
                  color={option.iconColor}
                />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{option.title}</Text>
                <Text style={styles.cardDescription}>
                  {option.description}
                </Text>
              </View>

              <View style={[styles.arrowBubble, { backgroundColor: option.tint }]}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={option.accent}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footerNote}>
          Need help choosing? Most users join as a customer.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    marginTop: 26,
    marginBottom: 26,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.textFaint,
    marginBottom: 6,
  },
  title: {
    ...typography.hero,
    color: colors.textStrong,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textMuted,
    marginTop: 6,
  },
  cardList: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tag: {
    position: 'absolute',
    top: 0,
    right: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconBubble: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  cardTitle: {
    ...typography.sectionTitle,
    fontSize: 18,
    color: colors.textStrong,
  },
  cardDescription: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 5,
    lineHeight: 17,
  },
  arrowBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerNote: {
    ...typography.caption,
    color: colors.textFaint,
    textAlign: 'center',
    marginTop: 28,
  },
});
