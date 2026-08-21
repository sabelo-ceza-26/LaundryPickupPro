import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const isWeb = Platform.OS === 'web';

export default function SplashScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.decorGlow} />
      <View style={styles.decorCircleOne} />
      <View style={styles.decorCircleTwo} />
      <View style={styles.decorCircleThree} />

      <View style={styles.content}>
        <Image
          source={require('../../../assets/logo-purple.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>
        
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.replace('Role')}
        >
          <LinearGradient
            colors={['#5B48F7', '#7857FF', '#D6336C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#C9B6FF',
    overflow: 'hidden',
  },
  decorGlow: {
    position: 'absolute',
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: 'rgba(91, 72, 247, 0.10)',
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
    borderColor: 'rgba(91, 72, 247, 0.14)',
    top: -90,
    right: -110,
  },
  decorCircleTwo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: 'rgba(91, 72, 247, 0.12)',
    bottom: -70,
    left: -80,
  },
  decorCircleThree: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(91, 72, 247, 0.10)',
    top: '60%',
    right: -40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(isWeb ? { maxWidth: 500, alignSelf: 'center', width: '100%' } : {}),
  },
  logo: {
    width: isWeb ? 260 : 330,
    height: isWeb ? 260 : 330,
  },
  tagline: {
    color: 'rgba(62, 40, 92, 0.85)',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 36,
    ...(isWeb ? { maxWidth: 500, alignSelf: 'center', width: '100%' } : {}),
  },
  ctaButton: {
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
