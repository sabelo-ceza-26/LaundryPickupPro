import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../theme/colors';

type Props = {
  light?: boolean;
  tagline?: string;
  size?: 'sm' | 'lg';
  style?: ViewStyle;
};

export default function Logo({
  light = false,
  tagline,
  size = 'lg',
  style,
}: Props) {
  const isLarge = size === 'lg';

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../../assets/logo-slate.png')}
        style={[
          styles.logo,
          isLarge ? styles.logoLarge : styles.logoSmall,
        ]}
        resizeMode="contain"
      />
      {!!tagline && (
        <Text
          style={[styles.tagline, light ? styles.taglineLight : styles.taglineDark]}
        >
          {tagline}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {},
  logoLarge: {
    width: 140,
    height: 140,
  },
  logoSmall: {
    width: 88,
    height: 88,
  },
  tagline: {
    fontSize: 15,
    marginTop: 8,
  },
  taglineDark: {
    color: colors.textMuted,
  },
  taglineLight: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
