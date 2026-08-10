import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DriverStackParamList } from '../../navigation/DriverNavigator';
import { useAuth } from '../../hooks/useAuth';
import { isEmail, isPhone, isRequired } from '../../utils/validation';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'AccountSettings'
>;

export default function AccountSettingsScreen({
    navigation,
}: Props) {
    const { user, updateUser } = useAuth();

    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saved, setSaved] = useState(false);

    const saveProfile = () => {
        const next: Record<string, string> = {};
        if (!isRequired(name)) next.name = 'Enter your full name';
        if (!isEmail(email)) next.email = 'Enter a valid email address';
        if (phone.trim() && !isPhone(phone)) {
            next.phone = 'Enter a valid phone number';
        }
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        updateUser({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
        });

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

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
                        Account Settings
                    </Text>
                    <View style={{ width: 28 }} />
                </View>

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
                        <Ionicons name="person-outline" size={18} color="#7A8492" />
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your full name"
                            placeholderTextColor="#B9BEC7"
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
                        <Ionicons name="mail-outline" size={18} color="#7A8492" />
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            placeholderTextColor="#B9BEC7"
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
                        <Ionicons name="call-outline" size={18} color="#7A8492" />
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Optional"
                            placeholderTextColor="#B9BEC7"
                            keyboardType="phone-pad"
                        />
                    </View>
                    {errors.phone && (
                        <Text style={styles.errorText}>{errors.phone}</Text>
                    )}

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveProfile}
                    >
                        <Text style={styles.saveButtonText}>
                            {saved ? 'Saved' : 'Save changes'}
                        </Text>
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
                        <View style={[styles.rowIcon, { backgroundColor: '#E8EFFD' }]}>
                            <Ionicons
                                name="key-outline"
                                size={20}
                                color="#173D8F"
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
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#B9BEC7"
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

    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        marginBottom: 20,
    },

    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#173D8F',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    avatarText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '700',
    },

    profileInfo: {
        flex: 1,
    },

    profileName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#12263A',
    },

    profileEmail: {
        marginTop: 2,
        fontSize: 13,
        color: '#7A8492',
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

    label: {
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

    inputError: {
        borderColor: '#E11D48',
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#12263A',
    },

    errorText: {
        fontSize: 11,
        color: '#E11D48',
        marginTop: -8,
        marginBottom: 10,
    },

    saveButton: {
        backgroundColor: '#173D8F',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },

    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },

    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    rowIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    rowBody: {
        flex: 1,
    },

    rowLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#12263A',
    },

    rowHint: {
        marginTop: 1,
        fontSize: 12,
        color: '#7A8492',
    },

});
