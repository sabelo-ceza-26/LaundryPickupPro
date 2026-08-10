import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
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
import { isMinLength, isRequired, matches } from '../../utils/validation';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'ChangePassword'
>;

export default function ChangePasswordScreen({
    navigation,
}: Props) {
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
                            Change Password
                        </Text>
                        <View style={{ width: 28 }} />
                    </View>

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
                            <Ionicons
                                name="lock-closed-outline"
                                size={18}
                                color="#7A8492"
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
                                <Ionicons
                                    name={
                                        currentHidden
                                            ? 'eye-outline'
                                            : 'eye-off-outline'
                                    }
                                    size={20}
                                    color="#7A8492"
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
                            <Ionicons
                                name="key-outline"
                                size={18}
                                color="#7A8492"
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
                                <Ionicons
                                    name={
                                        newHidden
                                            ? 'eye-outline'
                                            : 'eye-off-outline'
                                    }
                                    size={20}
                                    color="#7A8492"
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
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={18}
                                color="#7A8492"
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
                                <Ionicons
                                    name={
                                        confirmHidden
                                            ? 'eye-outline'
                                            : 'eye-off-outline'
                                    }
                                    size={20}
                                    color="#7A8492"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.confirm && (
                            <Text style={styles.errorText}>
                                {errors.confirm}
                            </Text>
                        )}

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleChangePassword}
                        >
                            <Text style={styles.saveButtonText}>
                                Update password
                            </Text>
                        </TouchableOpacity>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success Modal */}
            <Modal
                visible={showSuccess}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    setShowSuccess(false);
                    navigation.goBack();
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalIcon}>
                            <Ionicons
                                name="checkmark"
                                size={32}
                                color="#16A34A"
                            />
                        </View>
                        <Text style={styles.modalTitle}>
                            Password updated
                        </Text>
                        <Text style={styles.modalMessage}>
                            Your password has been changed
                            successfully.
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setShowSuccess(false);
                                navigation.goBack();
                            }}
                        >
                            <Text style={styles.modalButtonText}>
                                Done
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    flex: {
        flex: 1,
    },

    container: {
        padding: 20,
        paddingBottom: 30,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#12263A',
    },

    subtitle: {
        fontSize: 13,
        color: '#7A8492',
        lineHeight: 20,
        marginBottom: 18,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(18, 38, 58, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },

    modalCard: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 24,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },

    modalIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E9F9EF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#12263A',
    },

    modalMessage: {
        marginTop: 6,
        fontSize: 14,
        color: '#7A8492',
        textAlign: 'center',
        lineHeight: 20,
    },

    modalButton: {
        alignSelf: 'stretch',
        height: 48,
        borderRadius: 12,
        backgroundColor: '#173D8F',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },

    modalButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },

});
