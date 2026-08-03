import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { colors } from '../../theme/colors';

const ICON_DARK = '#2B3642';
const TEXT_MUTED = '#7A869A';

const placeholders: Record<string, { title: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = {
  Orders: { title: 'Your Orders', icon: 'receipt-text-outline' },
  Track: { title: 'Track Order', icon: 'map-marker-outline' },
  Profile: { title: 'Your Profile', icon: 'account-outline' },
};

export default function PlaceholderScreen() {
  const route = useRoute();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const { title, icon } = placeholders[route.name] ?? {
    title: route.name,
    icon: 'dots-horizontal',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.body}>
        <MaterialCommunityIcons name={icon} size={56} color={colors.accentTint} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>This section is coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: ICON_DARK,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: ICON_DARK,
    marginTop: 16,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 6,
    textAlign: 'center',
  },
});
