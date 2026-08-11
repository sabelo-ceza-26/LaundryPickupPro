import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../types';
import type { DriverStackParamList } from '../../navigation/DriverNavigator';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'Profile'
>;

type SettingsRow = {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    onPress: (navigation: Props['navigation']) => void;
};

const settingsRows: SettingsRow[] = [
    {
        label: 'Account Settings',
        icon: 'person-outline',
        color: '#173D8F',
        onPress: (navigation) => navigation.navigate('AccountSettings'),
    },
    {
        label: 'Notifications',
        icon: 'notifications-outline',
        color: '#F59E0B',
        onPress: (navigation) =>
            navigation.navigate('NotificationSettings'),
    },
    {
        label: 'Privacy & Security',
        icon: 'shield-outline',
        color: '#16A34A',
        onPress: (navigation) => navigation.navigate('PrivacySecurity'),
    },
    {
        label: 'Help & Support',
        icon: 'help-circle-outline',
        color: '#7A8492',
        onPress: (navigation) => navigation.navigate('HelpSupport'),
    },
];

export default function ProfileScreen({ navigation }: Props) {
    const { user, signOut } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const displayName = user?.name ?? 'Driver';
    const displayEmail = user?.email ?? 'driver@laundrypickuppro.app';
    const displayPhone = user?.phone ?? '083 000 0000';
    const roleLabel = user?.role
        ? ROLE_LABELS[user.role]
        : 'Driver';

    const confirmLogout = () => {
        setShowLogoutModal(false);
        signOut();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                {/* Header */}
                <Text style={styles.title}>
                    Profile
                </Text>

                {/* Profile Card */}
                <View style={styles.profileCard}>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {displayName.charAt(0).toUpperCase()}
                        </Text>
                    </View>

                    <View style={styles.profileInfo}>

                        <Text style={styles.name}>
                            {displayName}
                        </Text>

                        <Text style={styles.email}>
                            {displayEmail}
                        </Text>

                        <Text style={styles.phone}>
                            {displayPhone}
                        </Text>

                        <View style={styles.roleBadge}>
                            <Text style={styles.roleBadgeText}>
                                {roleLabel}
                            </Text>
                        </View>

                    </View>

                </View>

                {/* Settings Section */}
                <Text style={styles.sectionTitle}>
                    Settings
                </Text>

                <View style={styles.settingsCard}>

                    {settingsRows.map((row) => (
                        <TouchableOpacity
                            key={row.label}
                            style={styles.settingsRow}
                            onPress={() => row.onPress(navigation)}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: `${row.color}1A` },
                                ]}
                            >
                                <Ionicons
                                    name={row.icon}
                                    size={20}
                                    color={row.color}
                                />
                            </View>

                            <Text style={styles.rowLabel}>
                                {row.label}
                            </Text>

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#B9BEC7"
                            />

                        </TouchableOpacity>
                    ))}

                </View>

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => setShowLogoutModal(true)}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={20}
                        color="#FFFFFF"
                    />
                    <Text style={styles.logoutButtonText}>
                        Logout
                    </Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Logout Confirmation Modal */}
            <Modal
                visible={showLogoutModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>

                    <View style={styles.modalCard}>

                        <View style={styles.modalIcon}>
                            <Ionicons
                                name="log-out-outline"
                                size={28}
                                color="#E11D48"
                            />
                        </View>

                        <Text style={styles.modalTitle}>
                            Logout
                        </Text>

                        <Text style={styles.modalMessage}>
                            Are you sure you want to log out?
                        </Text>

                        <View style={styles.modalActions}>

                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={styles.modalCancelText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalConfirmButton}
                                onPress={confirmLogout}
                            >
                                <Text style={styles.modalConfirmText}>
                                    Logout
                                </Text>
                            </TouchableOpacity>

                        </View>

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

    container: {
        padding: 20,
        paddingBottom: 30,
    },

    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#12263A',
        marginBottom: 16,
    },

    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 18,
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
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#173D8F',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },

    avatarText: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: '700',
    },

    profileInfo: {
        flex: 1,
    },

    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#12263A',
    },

    email: {
        marginTop: 3,
        fontSize: 13,
        color: '#7A8492',
    },

    phone: {
        marginTop: 2,
        fontSize: 13,
        color: '#7A8492',
    },

    roleBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#E8EFFD',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginTop: 8,
    },

    roleBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#173D8F',
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#12263A',
        marginBottom: 10,
    },

    settingsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        marginBottom: 24,
    },

    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 13,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E8ECF1',
    },

    rowIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    rowLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#12263A',
    },

    logoutButton: {
        backgroundColor: '#E11D48',
        height: 52,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FDECEC',
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

    modalActions: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 22,
    },

    modalCancelButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    modalCancelText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#12263A',
    },

    modalConfirmButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#E11D48',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },

    modalConfirmText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },

});
