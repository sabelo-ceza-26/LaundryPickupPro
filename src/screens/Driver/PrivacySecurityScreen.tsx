import React, { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DriverStackParamList } from '../../navigation/DriverNavigator';
import BookingHeader from '../../components/BookingHeader';

const isWeb = Platform.OS === 'web';

const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const WHITE = '#FFFFFF';
const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const GREEN = '#00A85A';
const GREEN_TINT = '#DDF8E8';
const BORDER = '#E8ECF1';
const DANGER = '#E5484D';
const TEAL_HEADING = '#0E7A86';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'PrivacySecurity'
>;

type ToggleRow = {
    label: string;
    hint: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
    key: 'biometric' | 'location';
};

export default function PrivacySecurityScreen({
    navigation,
}: Props) {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    const [biometric, setBiometric] = useState(false);
    const [location, setLocation] = useState(true);

    const toggleRows: ToggleRow[] = [
        {
            label: 'Biometric login',
            hint: 'Unlock the app with Face ID or fingerprint',
            icon: 'fingerprint',
            color: GREEN,
            key: 'biometric',
        },
        {
            label: 'Share location while on route',
            hint: 'Let customers see live delivery updates',
            icon: 'map-marker-outline',
            color: BLUE,
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

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                <BookingHeader
                    title="Privacy & Security"
                    onBack={() => navigation.goBack()}
                    showCancelBooking={false}
                />

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
                                <MaterialCommunityIcons
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
                                    true: BLUE,
                                }}
                                thumbColor={
                                    currentValue(row.key)
                                        ? WHITE
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
                                { backgroundColor: BLUE_TINT },
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="key-outline"
                                size={20}
                                color={BLUE}
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
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color={TEXT_MUTED}
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
                            <MaterialCommunityIcons
                                name="refresh"
                                size={20}
                                color={DANGER}
                            />
                        </View>
                        <View style={styles.rowBody}>
                            <Text style={[styles.rowLabel, { color: DANGER }]}>
                                Reset account
                            </Text>
                            <Text style={styles.rowHint}>
                                Reset security settings and sign out
                            </Text>
                        </View>
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color={TEXT_MUTED}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <MaterialCommunityIcons
                        name="shield-check-outline"
                        size={20}
                        color={GREEN}
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
        backgroundColor: WHITE,
    },

    container: {
        paddingHorizontal: isWeb ? 32 : 20,
        paddingVertical: 20,
        paddingBottom: 30,
        backgroundColor: '#F5F7FA',
        ...(isWeb ? { maxWidth: 600, alignSelf: 'center', width: '100%' } : {}),
    },

    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: TEXT_MUTED,
        lineHeight: 20,
        marginBottom: 18,
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
        marginBottom: 18,
        overflow: 'hidden',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 13,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: BORDER,
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
        borderBottomColor: BORDER,
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
        marginTop: 1,
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: TEXT_MUTED,
    },

    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: GREEN_TINT,
        borderRadius: 12,
        padding: 14,
    },

    infoText: {
        flex: 1,
        marginLeft: 10,
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: GREEN,
        lineHeight: 18,
    },

});
