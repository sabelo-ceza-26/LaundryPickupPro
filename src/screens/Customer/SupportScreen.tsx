import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
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

import BookingHeader from '../../components/BookingHeader';
import type { CustomerStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Support'>;

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

type ContactChannel = {
  label: string;
  hint: string;
  icon: Icon;
  tint: string;
  color: string;
  onPress: () => void;
};

type FaqItem = {
  question: string;
  answer: string;
};

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const ICON_DARK = '#2B3642';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';

const GRADIENT_TEAL = [TEAL_MID, TEAL] as const;

const SUPPORT_PHONE = '+27108765432';
const SUPPORT_WHATSAPP = '27829876543';
const SUPPORT_EMAIL = 'support@laundrypickuppro.app';

const faqs: FaqItem[] = [
  {
    question: 'How do I book a laundry pickup?',
    answer:
      'Tap the Book tab, choose your pickup and delivery addresses and times, review the details, and confirm your payment. We will handle the rest.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'Open the Track tab to see live updates for your active orders, or open the order from My Orders and tap Track Order.',
  },
  {
    question: 'How do I cancel or change an order?',
    answer:
      'Orders can be cancelled from the order details screen as long as they are still in the Scheduled status. Contact support for changes after pickup.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept card payments, EFT, and cash paid to the driver at pickup. Card payments are processed securely.',
  },
  {
    question: 'What if my laundry is damaged or lost?',
    answer:
      'Please report any issues within 48 hours of delivery through this screen or email us, and we will resolve it for you.',
  },
];

export default function SupportScreen({ navigation }: Props) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!fontsLoaded) return null;

  const channels: ContactChannel[] = [
    {
      label: 'Call us',
      hint: SUPPORT_PHONE,
      icon: 'phone-outline',
      tint: '#E2ECEB',
      color: TEAL,
      onPress: () => Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() => undefined),
    },
    {
      label: 'WhatsApp',
      hint: 'Chat with our team',
      icon: 'whatsapp',
      tint: '#DDF8E8',
      color: '#00A85A',
      onPress: () =>
        Linking.openURL(
          `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent('Hi, I need help with my laundry order.')}`
        ).catch(() => undefined),
    },
    {
      label: 'Email us',
      hint: SUPPORT_EMAIL,
      icon: 'email-outline',
      tint: '#E4EEFF',
      color: '#2E6BFF',
      onPress: () =>
        Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => undefined),
    },
  ];

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Missing details', 'Please add a subject and a message.');
      return;
    }
    Alert.alert(
      'Message sent',
      'Thanks! Our support team will get back to you within 24 hours.'
    );
    setSubject('');
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BookingHeader title="Help & Support" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.channelRow}>
          {channels.map((channel) => (
            <TouchableOpacity
              key={channel.label}
              style={styles.channelCard}
              activeOpacity={0.85}
              onPress={channel.onPress}
            >
              <View style={[styles.channelIcon, { backgroundColor: channel.tint }]}>
                <MaterialCommunityIcons name={channel.icon} size={24} color={channel.color} />
              </View>
              <Text style={styles.channelLabel}>{channel.label}</Text>
              <Text style={styles.channelHint} numberOfLines={1}>
                {channel.hint}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Frequently asked questions</Text>
        <View style={styles.faqCard}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <TouchableOpacity
                key={faq.question}
                style={[styles.faqRow, index === faqs.length - 1 && styles.faqRowLast]}
                activeOpacity={0.85}
                onPress={() => setOpenFaq(isOpen ? null : index)}
              >
                <View style={styles.faqQuestionRow}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <MaterialCommunityIcons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={TEXT_MUTED}
                  />
                </View>
                {isOpen && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Report a problem</Text>
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Subject</Text>
          <View style={styles.inputField}>
            <MaterialCommunityIcons name="tag-outline" size={18} color={TEXT_MUTED} />
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="What went wrong?"
              placeholderTextColor={TEXT_MUTED}
            />
          </View>

          <Text style={styles.inputLabel}>Message</Text>
          <View style={[styles.inputField, styles.messageField]}>
            <MaterialCommunityIcons
              name="message-text-outline"
              size={18}
              color={TEXT_MUTED}
              style={styles.messageIcon}
            />
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={message}
              onChangeText={setMessage}
              placeholder="Tell us more about the issue…"
              placeholderTextColor={TEXT_MUTED}
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.submitTouch}
            activeOpacity={0.9}
            onPress={handleSubmit}
          >
            <LinearGradient colors={GRADIENT_TEAL} style={styles.submitButton}>
              <Text style={styles.submitText}>Send Message</Text>
              <MaterialCommunityIcons name="send" size={18} color={WHITE} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scroll: {
    backgroundColor: '#F7F9FB',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  channelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  channelCard: {
    width: '31%',
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    alignItems: 'center',
  },
  channelIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: TEXT_DARK,
    marginTop: 10,
  },
  channelHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    color: TEXT_MUTED,
    marginTop: 2,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEXT_DARK,
    marginBottom: 10,
  },
  faqCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 22,
    overflow: 'hidden',
  },
  faqRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F4',
  },
  faqRowLast: {
    borderBottomWidth: 0,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: TEXT_DARK,
    marginRight: 10,
  },
  faqAnswer: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: TEXT_MUTED,
    marginTop: 10,
  },
  formCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
  },
  inputLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 8,
  },
  inputField: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  messageField: {
    height: 120,
    alignItems: 'flex-start',
    paddingTop: 14,
  },
  messageIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: TEXT_DARK,
  },
  messageInput: {
    padding: 0,
    minHeight: 90,
  },
  submitTouch: {
    borderRadius: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 16,
    elevation: 3,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
  },
  submitText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: WHITE,
    marginRight: 8,
  },
});
