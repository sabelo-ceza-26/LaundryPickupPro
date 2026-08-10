import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DriverStackParamList } from '../../navigation/DriverNavigator';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'PrivacySecurity'
>;

type ToggleRow = {
    label: string;
    hint: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    key: 'biometric' | 'location';
};

export default function PrivacySecurityScreen({
    navigation,
}: Props) {
    const [biometric, setBiometric] = useState(false);
    const [location, setLocation] = useState(true);

    const toggleRows: ToggleRow[] = [
        {
            label: 'Biometric login',
            hint: 'Unlock the app with Face ID or fingerprint',
            icon: 'finger-print-outline',
            color: '#16A34A',
            key: 'biometric',
        },
        {
            label: 'Share location while on route',
            hint: 'Let customers see live delivery updates',
            icon: 'location-outline',
            color: '#173D8F',
            key: 'location',
        },
    ];

    const toggle = (key: ToggleRow['key']) => {
        if (key === 'biometric') setBiometric((prev) => !prev);
        if (key === 'location') setLocation((prev) => !prev);
    };

    const currentValue = (key: ToggleRow['key']) => {
        if (key === 'biometric') return biometric;
        return location;
    };

    const confirmReset = () => {
        Alert.alert(
            'Reset account',
            'This will reset your account security settings. You will need to sign in again.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive' },
            ],
        );
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
                        Privacy & Security
                    </Text>
                    <View style={{ width: 28 }} />
                </View>

                <Text style={styles.subtitle}>
                    Manage how your account stays secure and what
                    information you share.
                </Text>

                <View style={styles.card}>
                    {toggleRows.map((row, index) => (
                        <View
                            key={row.key}
                            style={[
                                styles.row,
                                index === toggleRows.length - 1 &&
                                styles.rowLast,
                            ]}
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
                            <View style={styles.rowBody}>
                                <Text style={styles.rowLabel}>
                                    {row.label}
                                </Text>
                                <Text style={styles.rowHint}>
                                    {row.hint}
                                </Text>
                            </View>
                            <Switch
                                value={currentValue(row.key)}
                                onValueChange={() => toggle(row.key)}
                                trackColor={{
                                    false: '#D5DCE3',
                                    true: '#173D8F',
                                }}
                                thumbColor={
                                    currentValue(row.key)
                                        ? '#FFFFFF'
                                        : '#F5F7FA'
                                }
                            />
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>
                    Security Actions
                </Text>

                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.actionRow}
                        onPress={() =>
                            navigation.navigate('ChangePassword')
                        }
                    >
                        <View
                            style={[
                                styles.rowIcon,
                                { backgroundColor: '#E8EFFD' },
                            ]}
                        >
                            <Ionicons
                                name="key-outline"
                                size={20}
                                color="#173D8F"
                            />
                        </View>
                        <View style={styles.rowBody}>
                            <Text style={styles.rowLabel}>
                                Change password
                            </Text>
                            <Text style={styles.rowHint}>
                                Update your account password
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#B9BEC7"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionRow, styles.rowLast]}
                        onPress={confirmReset}
                    >
                        <View
                            style={[
                                styles.rowIcon,
                                { backgroundColor: '#FDECEC' },
                            ]}
                        >
                            <Ionicons
                                name="refresh-outline"
                                size={20}
                                color="#E11D48"
                            />
                        </View>
                        <View style={styles.rowBody}>
                            <Text style={[styles.rowLabel, { color: '#E11D48' }]}>
                                Reset account
                            </Text>
                            <Text style={styles.rowHint}>
                                Reset security settings and sign out
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#B9BEC7"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <Ionicons
                        name="shield-checkmark-outline"
                        size={20}
                        color="#16A34A"
                    />
                    <Text style={styles.infoText}>
                        Your personal data is encrypted and never shared
                        with third parties.
                    </Text>
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

    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#12263A',
        marginBottom: 10,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        marginBottom: 18,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 13,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E8ECF1',
    },

    rowLast: {
        borderBottomWidth: 0,
    },

    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 13,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E8ECF1',
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

    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E9F9EF',
        borderRadius: 12,
        padding: 14,
    },

    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 12,
        color: '#16A34A',
        lineHeight: 18,
    },

});
