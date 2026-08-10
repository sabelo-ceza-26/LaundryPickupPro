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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DriverStackParamList } from '../../navigation/DriverNavigator';

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
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const channels: ContactChannel[] = [
        {
            label: 'Call us',
            hint: SUPPORT_PHONE,
            icon: 'phone-outline',
            color: '#16A34A',
            onPress: () =>
                Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() =>
                    undefined,
                ),
        },
        {
            label: 'WhatsApp',
            hint: 'Chat with our team',
            icon: 'whatsapp',
            color: '#173D8F',
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
            color: '#F59E0B',
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
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons
                            name="chevron-back"
                            size={28}
                            color="#12263A"
                        />
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        Help & Support
                    </Text>
                    <View style={{ width: 28 }} />
                </View>

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
                                            { backgroundColor: '#E8EFFD' },
                                        ]}
                                    >
                                        <Ionicons
                                            name="help-circle-outline"
                                            size={18}
                                            color="#173D8F"
                                        />
                                    </View>
                                    <Text style={styles.faqQuestion}>
                                        {faq.question}
                                    </Text>
                                    <Ionicons
                                        name={
                                            isOpen
                                                ? 'chevron-up'
                                                : 'chevron-down'
                                        }
                                        size={20}
                                        color="#173D8F"
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
                        <Ionicons
                            name="pricetag-outline"
                            size={18}
                            color="#7A8492"
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
                        <Ionicons
                            name="chatbubble-outline"
                            size={18}
                            color="#7A8492"
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
                        <Text style={styles.submitText}>Send Message</Text>
                        <Ionicons
                            name="send"
                            size={18}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>

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
        padding: 20,
        paddingBottom: 30,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#12263A',
    },

    channelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    channelCard: {
        width: '31%',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E8ECF1',
        paddingVertical: 16,
        alignItems: 'center',
        elevation: 2,
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
        fontWeight: '600',
        color: '#12263A',
        marginTop: 10,
    },

    channelHint: {
        fontSize: 9,
        color: '#7A8492',
        marginTop: 2,
        paddingHorizontal: 4,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#12263A',
        marginBottom: 10,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },

    faqRow: {
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E8ECF1',
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
        fontWeight: '600',
        color: '#12263A',
        marginRight: 10,
    },

    faqAnswer: {
        fontSize: 13,
        lineHeight: 20,
        color: '#7A8492',
        marginTop: 10,
        paddingLeft: 44,
    },

    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7A8492',
        marginBottom: 8,
    },

    inputField: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8ECF1',
        borderRadius: 12,
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
        color: '#12263A',
    },

    messageInput: {
        padding: 0,
        minHeight: 90,
    },

    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 12,
        backgroundColor: '#173D8F',
        marginTop: 4,
    },

    submitText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        marginRight: 8,
    },

});
