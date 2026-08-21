import React, { useState } from 'react';
import {
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
import { useAuth } from '../../hooks/useAuth';
import { isEmail, isPhone, isRequired } from '../../utils/validation';
import BookingHeader from '../../components/BookingHeader';

const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const WHITE = '#FFFFFF';
const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const PURPLE = '#7857FF';
const PURPLE_TINT = '#EFEBFF';
const BORDER = '#E8ECF1';
const DANGER = '#E5484D';
const TEAL_HEADING = '#0E7A86';

const GRADIENT_PRIMARY = [BLUE, PURPLE] as const;

const isWeb = Platform.OS === 'web';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'AccountSettings'
>;

export default function AccountSettingsScreen({
    navigation,
}: Props) {
    const { user, updateUser } = useAuth();

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saved, setSaved] = useState(false);

    if (!fontsLoaded) return null;

    const saveProfile = () => {
        const next: Record<string, string> = {};
        if (!isRequired(name)) next.name = 'Enter your full name';
        if (!isEmail(email)) next.email = 'Enter a valid email address';
        if (!isRequired(phone)) {
            next.phone = 'Enter your phone number';
        } else if (!isPhone(phone)) {
            next.phone = 'Enter a valid phone number';
        }
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        updateUser({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
        });

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <BookingHeader
                    title="Account Settings"
                    onBack={() => navigation.goBack()}
                    showCancelBooking={false}
                />

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {(name.trim() || 'D').charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>
                            {name.trim() || 'Driver'}
                        </Text>
                        <Text style={styles.profileEmail} numberOfLines={1}>
                            {email.trim() || 'driver@laundrypickuppro.app'}
                        </Text>
                        <View style={styles.profilePhoneRow}>
                            <MaterialCommunityIcons
                                name="phone-outline"
                                size={13}
                                color={TEXT_MUTED}
                            />
                            <Text style={styles.profilePhone}>
                                {phone.trim() || 'No phone number'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Personal Information */}
                <Text style={styles.sectionTitle}>
                    Personal Information
                </Text>

                <View style={styles.card}>
                    <Text style={styles.label}>
                        Full name
                    </Text>
                    <View style={[styles.inputField, errors.name && styles.inputError]}>
                        <MaterialCommunityIcons name="account-outline" size={18} color={TEXT_MUTED} />
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your full name"
                            placeholderTextColor={TEXT_MUTED}
                            autoCapitalize="words"
                        />
                    </View>
                    {errors.name && (
                        <Text style={styles.errorText}>{errors.name}</Text>
                    )}

                    <Text style={styles.label}>
                        Email address
                    </Text>
                    <View style={[styles.inputField, errors.email && styles.inputError]}>
                        <MaterialCommunityIcons name="email-outline" size={18} color={TEXT_MUTED} />
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            placeholderTextColor={TEXT_MUTED}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                    {errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                    )}

                    <Text style={styles.label}>
                        Phone number
                    </Text>
                    <View style={[styles.inputField, errors.phone && styles.inputError]}>
                        <MaterialCommunityIcons name="phone-outline" size={18} color={TEXT_MUTED} />
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            placeholderTextColor={TEXT_MUTED}
                            keyboardType="phone-pad"
                        />
                    </View>
                    {errors.phone && (
                        <Text style={styles.errorText}>{errors.phone}</Text>
                    )}

                    <TouchableOpacity
                        style={styles.saveTouch}
                        activeOpacity={0.9}
                        onPress={saveProfile}
                    >
                        <LinearGradient colors={GRADIENT_PRIMARY} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>
                                {saved ? 'Saved' : 'Save changes'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Change Password */}
                <Text style={styles.sectionTitle}>
                    Change Password
                </Text>

                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.passwordRow}
                        onPress={() =>
                            navigation.navigate('ChangePassword')
                        }
                    >
                        <View style={[styles.rowIcon, { backgroundColor: BLUE_TINT }]}>
                            <MaterialCommunityIcons
                                name="key-outline"
                                size={20}
                                color={BLUE}
                            />
                        </View>
                        <View style={styles.rowBody}>
                            <Text style={styles.rowLabel}>
                                Update password
                            </Text>
                            <Text style={styles.rowHint}>
                                Keep your account secure
                            </Text>
                        </View>
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color={TEXT_MUTED}
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
        backgroundColor: WHITE,
    },

    scroll: {
        backgroundColor: '#F5F7FA',
    },

    container: {
        paddingHorizontal: isWeb ? 32 : 20,
        paddingTop: 16,
        paddingBottom: 30,
        ...(isWeb ? { maxWidth: 600, alignSelf: 'center', width: '100%' } : {}),
    },

    profileCard: {
        backgroundColor: WHITE,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: BORDER,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 22,
        elevation: 2,
        shadowColor: TEXT_DARK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
    },

    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: BLUE,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    avatarText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 22,
        color: WHITE,
    },

    profileInfo: {
        flex: 1,
    },

    profileName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 17,
        color: TEXT_DARK,
    },

    profileEmail: {
        fontFamily: 'Poppins_400Regular',
        marginTop: 2,
        fontSize: 13,
        color: TEXT_MUTED,
    },

    profilePhoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    },

    profilePhone: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: TEXT_MUTED,
        marginLeft: 4,
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
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#26384A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },

    label: {
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

    inputError: {
        borderColor: DANGER,
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: TEXT_DARK,
    },

    errorText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: DANGER,
        marginTop: -8,
        marginBottom: 10,
    },

    saveTouch: {
        borderRadius: 14,
        marginTop: 6,
    },

    saveButton: {
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: BLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },

    saveButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: WHITE,
    },

    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    rowIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    rowBody: {
        flex: 1,
    },

    rowLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: TEXT_DARK,
    },

    rowHint: {
        fontFamily: 'Poppins_400Regular',
        marginTop: 1,
        fontSize: 12,
        color: TEXT_MUTED,
    },

});
