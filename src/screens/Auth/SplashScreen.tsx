import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '../../components/Button';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.decorGlow} />
      <View style={styles.decorCircleOne} />
      <View style={styles.decorCircleTwo} />
      <View style={styles.decorCircleThree} />

      <View style={styles.content}>
        <Image
          source={require('../../../assets/logo-slate.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>
        
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          style={styles.ctaButton}
          onPress={() => navigation.replace('Role')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E293B',
    overflow: 'hidden',
  },
  decorGlow: {
    position: 'absolute',
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: 'rgba(100, 116, 139, 0.16)',
    top: '14%',
    left: '50%',
    marginLeft: -240,
  },
  decorCircleOne: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    top: -90,
    right: -110,
  },
  decorCircleTwo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    bottom: -70,
    left: -80,
  },
  decorCircleThree: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    top: '60%',
    right: -40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 330,
    height: 330,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 36,
  },
  ctaButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
});
