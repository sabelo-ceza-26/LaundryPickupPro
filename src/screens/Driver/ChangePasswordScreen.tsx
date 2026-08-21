import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
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
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DriverStackParamList } from '../../navigation/DriverNavigator';
import { useAuth } from '../../hooks/useAuth';
import { isMinLength, isRequired, matches } from '../../utils/validation';
import BookingHeader from '../../components/BookingHeader';
import FancyAlert from '../../components/FancyAlert';

const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const WHITE = '#FFFFFF';
const BLUE = '#2E6BFF';
const PURPLE = '#7857FF';
const BORDER = '#E8ECF1';
const DANGER = '#E5484D';
const GREEN = '#00A85A';
const GREEN_TINT = '#DDF8E8';

const GRADIENT_PRIMARY = [BLUE, PURPLE] as const;

const isWeb = Platform.OS === 'web';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'ChangePassword'
>;

export default function ChangePasswordScreen({
    navigation,
}: Props) {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    const { changePassword } = useAuth();

    const [current, setCurrent] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [currentHidden, setCurrentHidden] = useState(true);
    const [newHidden, setNewHidden] = useState(true);
    const [confirmHidden, setConfirmHidden] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChangePassword = () => {
        const next: Record<string, string> = {};

        if (!isRequired(current)) {
            next.current = 'Enter your current password';
        }

        if (!isRequired(newPassword)) {
            next.newPassword = 'Enter a new password';
        } else if (!isMinLength(newPassword, 8)) {
            next.newPassword =
                'Password must be at least 8 characters';
        }

        if (!isRequired(confirm)) {
            next.confirm = 'Confirm your new password';
        } else if (!matches(confirm, newPassword)) {
            next.confirm = 'Passwords do not match';
        }

        setErrors(next);
        if (Object.keys(next).length > 0) return;

        try {
            changePassword(current, newPassword);
        } catch (error) {
            setErrors({
                current:
                    error instanceof Error
                        ? error.message
                        : 'Current password is incorrect',
            });
            return;
        }

        setCurrent('');
        setNewPassword('');
        setConfirm('');
        setShowSuccess(true);
    };

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <BookingHeader
                        title="Change Password"
                        onBack={() => navigation.goBack()}
                        showCancelBooking={false}
                    />

                    <Text style={styles.subtitle}>
                        Use at least 8 characters. Don't use the same
                        password you use for other accounts.
                    </Text>

                    <View style={styles.card}>

                        <Text style={styles.label}>
                            Current password
                        </Text>
                        <View
                            style={[
                                styles.inputField,
                                errors.current && styles.inputError,
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="lock-outline"
                                size={18}
                                color={TEXT_MUTED}
                            />
                            <TextInput
                                style={styles.input}
                                value={current}
                                onChangeText={setCurrent}
                                placeholder="Enter your current password"
                                placeholderTextColor="#B9BEC7"
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry={currentHidden}
                            />
                            <TouchableOpacity
                                hitSlop={{
                                    top: 10,
                                    bottom: 10,
                                    left: 10,
                                    right: 10,
                                }}
                                onPress={() =>
                                    setCurrentHidden((prev) => !prev)
                                }
                            >
                                <MaterialCommunityIcons
                                    name={
                                        currentHidden
                                            ? 'eye-outline'
                                            : 'eye-off-outline'
                                    }
                                    size={20}
                                    color={TEXT_MUTED}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.current && (
                            <Text style={styles.errorText}>
                                {errors.current}
                            </Text>
                        )}

                        <Text style={styles.label}>
                            New password
                        </Text>
                        <View
                            style={[
                                styles.inputField,
                                errors.newPassword && styles.inputError,
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="key-outline"
                                size={18}
                                color={TEXT_MUTED}
                            />
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="At least 8 characters"
                                placeholderTextColor="#B9BEC7"
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry={newHidden}
                            />
                            <TouchableOpacity
                                hitSlop={{
                                    top: 10,
                                    bottom: 10,
                                    left: 10,
                                    right: 10,
                                }}
                                onPress={() =>
                                    setNewHidden((prev) => !prev)
                                }
                            >
                                <MaterialCommunityIcons
                                    name={
                                        newHidden
                                            ? 'eye-outline'
                                            : 'eye-off-outline'
                                    }
                                    size={20}
                                    color={TEXT_MUTED}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.newPassword && (
                            <Text style={styles.errorText}>
                                {errors.newPassword}
                            </Text>
                        )}

                        <Text style={styles.label}>
                            Confirm new password
                        </Text>
                        <View
                            style={[
                                styles.inputField,
                                errors.confirm && styles.inputError,
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="shield-check-outline"
                                size={18}
                                color={TEXT_MUTED}
                            />
                            <TextInput
                                style={styles.input}
                                value={confirm}
                                onChangeText={setConfirm}
                                placeholder="Re-enter your new password"
                                placeholderTextColor="#B9BEC7"
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry={confirmHidden}
                            />
                            <TouchableOpacity
                                hitSlop={{
                                    top: 10,
                                    bottom: 10,
                                    left: 10,
                                    right: 10,
                                }}
                                onPress={() =>
                                    setConfirmHidden((prev) => !prev)
                                }
                            >
                                <MaterialCommunityIcons
                                    name={
                                        confirmHidden
                                            ? 'eye-outline'
                                            : 'eye-off-outline'
                                    }
                                    size={20}
                                    color={TEXT_MUTED}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.confirm && (
                            <Text style={styles.errorText}>
                                {errors.confirm}
                            </Text>
                        )}

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={handleChangePassword}
                        >
                            <LinearGradient
                                colors={GRADIENT_PRIMARY}
                                style={styles.saveButton}
                            >
                                <Text style={styles.saveButtonText}>
                                    Update password
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            <FancyAlert
                visible={showSuccess}
                icon="check-circle-outline"
                iconColor={GREEN}
                iconBackground={GREEN_TINT}
                title="Password updated"
                message="Your password has been changed successfully."
                onClose={() => {
                    setShowSuccess(false);
                    navigation.goBack();
                }}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: WHITE,
    },

    flex: {
        flex: 1,
    },

    container: {
        backgroundColor: '#F5F7FA',
        paddingHorizontal: isWeb ? 32 : 20,
        paddingVertical: 20,
        paddingBottom: 30,
        ...(isWeb ? { maxWidth: 600, alignSelf: 'center', width: '100%' } : {}),
    },

    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: TEXT_MUTED,
        lineHeight: 20,
        marginBottom: 18,
    },

    card: {
        backgroundColor: WHITE,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: BORDER,
        paddingHorizontal: 16,
        paddingVertical: 14,
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

    inputError: {
        borderColor: DANGER,
    },

    input: {
        flex: 1,
        fontFamily: 'Poppins_400Regular',
        marginLeft: 10,
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

    saveButton: {
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },

    saveButtonText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 15,
        color: WHITE,
    },

});
