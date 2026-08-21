import React, { useState } from 'react';
import {
    Alert,
    Linking,
    Platform,
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
import {
    useFonts,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DriverStackParamList } from '../../navigation/DriverNavigator';
import BookingHeader from '../../components/BookingHeader';

const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const WHITE = '#FFFFFF';
const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const PURPLE = '#7857FF';
const GREEN = '#00A85A';
const AMBER = '#F4A928';
const BORDER = '#E8ECF1';
const TEAL_HEADING = '#0E7A86';

const GRADIENT_PRIMARY = [BLUE, PURPLE] as const;

const isWeb = Platform.OS === 'web';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'HelpSupport'
>;

type ContactChannel = {
    label: string;
    hint: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
    onPress: () => void;
};

type FaqItem = {
    question: string;
    answer: string;
};

const SUPPORT_PHONE = '+27108765432';
const SUPPORT_WHATSAPP = '27829876543';
const SUPPORT_EMAIL = 'support@laundrypickuppro.app';

const faqs: FaqItem[] = [
    {
        question: 'How do I accept a new pickup?',
        answer:
            'Open the Orders tab, tap the assigned order, review the details, and confirm the pickup. The customer will be notified instantly.',
    },
    {
        question: 'What should I do if a customer is not home?',
        answer:
            'Try the phone number on the order first. If there is no answer, follow the special notes on the order before leaving the laundry.',
    },
    {
        question: 'How do I mark an order as delivered?',
        answer:
            'Open the delivery from your Orders tab and tap "Mark as Delivered". You can add a delivery note before confirming.',
    },
    {
        question: 'How are my earnings calculated?',
        answer:
            'Earnings are based on the number of completed pickups and deliveries plus any tips left by customers. A summary is available in your dashboard.',
    },
];

export default function HelpSupportScreen({
    navigation,
}: Props) {
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
            color: GREEN,
            onPress: () =>
                Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() =>
                    undefined,
                ),
        },
        {
            label: 'WhatsApp',
            hint: 'Chat with our team',
            icon: 'whatsapp',
            color: BLUE,
            onPress: () =>
                Linking.openURL(
                    `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
                        'Hi, I need help with my driver account.',
                    )}`,
                ).catch(() => undefined),
        },
        {
            label: 'Email us',
            hint: SUPPORT_EMAIL,
            icon: 'email-outline',
            color: AMBER,
            onPress: () =>
                Linking.openURL(
                    `mailto:${SUPPORT_EMAIL}`,
                ).catch(() => undefined),
        },
    ];

    const handleSubmit = async () => {
        if (!subject.trim() || !message.trim()) {
            Alert.alert(
                'Missing details',
                'Please add a subject and a message.',
            );
            return;
        }
        const body = encodeURIComponent(
            `${subject.trim()}\n\n${message.trim()}`,
        );
        const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
            'Driver problem report',
        )}&body=${body}`;
        try {
            await Linking.openURL(url);
            Alert.alert(
                'Message sent',
                'Thanks! Our support team will get back to you within 24 hours.',
            );
            setSubject('');
            setMessage('');
        } catch {
            Alert.alert(
                'Could not open email',
                `Please email us directly at ${SUPPORT_EMAIL}.`,
            );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <BookingHeader
                    title="Help & Support"
                    onBack={() => navigation.goBack()}
                    showCancelBooking={false}
                />

                {/* Contact Channels */}
                <View style={styles.channelRow}>
                    {channels.map((channel) => (
                        <TouchableOpacity
                            key={channel.label}
                            style={styles.channelCard}
                            activeOpacity={0.85}
                            onPress={channel.onPress}
                        >
                            <View
                                style={[
                                    styles.channelIcon,
                                    { backgroundColor: `${channel.color}1A` },
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name={channel.icon}
                                    size={24}
                                    color={channel.color}
                                />
                            </View>
                            <Text style={styles.channelLabel}>
                                {channel.label}
                            </Text>
                            <Text
                                style={styles.channelHint}
                                numberOfLines={1}
                            >
                                {channel.hint}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* FAQ */}
                <Text style={styles.sectionTitle}>
                    Frequently asked questions
                </Text>

                <View style={styles.card}>
                    {faqs.map((faq, index) => {
                        const isOpen = openFaq === index;
                        return (
                            <TouchableOpacity
                                key={faq.question}
                                style={[
                                    styles.faqRow,
                                    index === faqs.length - 1 &&
                                    styles.faqRowLast,
                                ]}
                                activeOpacity={0.85}
                                onPress={() =>
                                    setOpenFaq(isOpen ? null : index)
                                }
                            >
                                <View style={styles.faqQuestionRow}>
                                    <View
                                        style={[
                                            styles.faqIcon,
                                            { backgroundColor: BLUE_TINT },
                                        ]}
                                    >
                                        <MaterialCommunityIcons
                                            name="help-circle-outline"
                                            size={18}
                                            color={BLUE}
                                        />
                                    </View>
                                    <Text style={styles.faqQuestion}>
                                        {faq.question}
                                    </Text>
                                    <MaterialCommunityIcons
                                        name={
                                            isOpen
                                                ? 'chevron-up'
                                                : 'chevron-down'
                                        }
                                        size={20}
                                        color={BLUE}
                                    />
                                </View>
                                {isOpen && (
                                    <Text style={styles.faqAnswer}>
                                        {faq.answer}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Report a problem */}
                <Text style={styles.sectionTitle}>
                    Report a problem
                </Text>

                <View style={styles.card}>
                    <Text style={styles.inputLabel}>Subject</Text>
                    <View style={styles.inputField}>
                        <MaterialCommunityIcons
                            name="tag-outline"
                            size={18}
                            color={TEXT_MUTED}
                        />
                        <TextInput
                            style={styles.input}
                            value={subject}
                            onChangeText={setSubject}
                            placeholder="What went wrong?"
                            placeholderTextColor="#B9BEC7"
                        />
                    </View>

                    <Text style={styles.inputLabel}>Message</Text>
                    <View style={[styles.inputField, styles.messageField]}>
                        <MaterialCommunityIcons
                            name="chat-outline"
                            size={18}
                            color={TEXT_MUTED}
                            style={styles.messageIcon}
                        />
                        <TextInput
                            style={[styles.input, styles.messageInput]}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Tell us more about the issue…"
                            placeholderTextColor="#B9BEC7"
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.submitButton}
                        activeOpacity={0.9}
                        onPress={handleSubmit}
                    >
                        <LinearGradient
                            colors={GRADIENT_PRIMARY}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.submitGradient}
                        >
                            <Text style={styles.submitText}>Send Message</Text>
                            <MaterialCommunityIcons
                                name="send"
                                size={18}
                                color={WHITE}
                            />
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
        backgroundColor: '#F5F7FA',
    },

    container: {
        paddingHorizontal: isWeb ? 32 : 20,
        paddingVertical: 20,
        paddingBottom: 30,
        ...(isWeb ? { maxWidth: 600, alignSelf: 'center', width: '100%' } : {}),
    },

    channelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    channelCard: {
        width: '31%',
        backgroundColor: WHITE,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: BORDER,
        paddingVertical: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: TEXT_DARK,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },

    channelIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },

    channelLabel: {
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: TEXT_DARK,
        marginTop: 10,
    },

    channelHint: {
        fontSize: 9,
        color: TEXT_MUTED,
        marginTop: 2,
        paddingHorizontal: 4,
    },

    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: TEAL_HEADING,
        marginBottom: 10,
    },

    card: {
        backgroundColor: WHITE,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: BORDER,
        padding: 16,
        marginBottom: 20,
        elevation: 1,
        shadowColor: '#26384A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },

    faqRow: {
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: BORDER,
    },

    faqRowLast: {
        borderBottomWidth: 0,
    },

    faqQuestionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    faqIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    faqQuestion: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: TEXT_DARK,
        marginRight: 10,
    },

    faqAnswer: {
        fontSize: 13,
        lineHeight: 20,
        color: TEXT_MUTED,
        marginTop: 10,
        paddingLeft: 44,
        fontFamily: 'Poppins_400Regular',
    },

    inputLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: TEXT_MUTED,
        marginBottom: 8,
    },

    inputField: {
        height: 50,
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
        fontSize: 14,
        color: TEXT_DARK,
        fontFamily: 'Poppins_400Regular',
    },

    messageInput: {
        padding: 0,
        minHeight: 90,
    },

    submitButton: {
        marginTop: 4,
    },

    submitGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 14,
    },

    submitText: {
        color: WHITE,
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        marginRight: 8,
    },

});
