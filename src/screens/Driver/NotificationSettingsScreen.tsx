import React, { useState } from 'react';
import {
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
    'NotificationSettings'
>;

type ToggleRow = {
    label: string;
    hint: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    key: 'newOrder' | 'messages' | 'route' | 'general';
};

const toggleRows: ToggleRow[] = [
    {
        label: 'New order alerts',
        hint: 'Get notified when a new order is assigned',
        icon: 'cube-outline',
        color: '#173D8F',
        key: 'newOrder',
    },
    {
        label: 'Messages',
        hint: 'Get notified when customers send a message',
        icon: 'chatbubble-ellipses-outline',
        color: '#16A34A',
        key: 'messages',
    },
    {
        label: 'Route updates',
        hint: 'Get notified about changes to your route',
        icon: 'map-outline',
        color: '#F59E0B',
        key: 'route',
    },
    {
        label: 'General updates',
        hint: 'Promotions and app news',
        icon: 'megaphone-outline',
        color: '#7A8492',
        key: 'general',
    },
];

export default function NotificationSettingsScreen({
    navigation,
}: Props) {
    const [prefs, setPrefs] = useState({
        newOrder: true,
        messages: true,
        route: true,
        general: false,
    });

    const toggle = (key: keyof typeof prefs) =>
        setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

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
                        Notifications
                    </Text>
                    <View style={{ width: 28 }} />
                </View>

                <Text style={styles.subtitle}>
                    Choose which updates you want to receive while on the road.
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
                                value={prefs[row.key]}
                                onValueChange={() => toggle(row.key)}
                                trackColor={{
                                    false: '#D5DCE3',
                                    true: '#173D8F',
                                }}
                                thumbColor={
                                    prefs[row.key]
                                        ? '#FFFFFF'
                                        : '#F5F7FA'
                                }
                            />
                        </View>
                    ))}
                </View>

                <View style={styles.infoCard}>
                    <Ionicons
                        name="information-circle-outline"
                        size={20}
                        color="#173D8F"
                    />
                    <Text style={styles.infoText}>
                        You can change these preferences at any time from
                        your profile.
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
        backgroundColor: '#E8EFFD',
        borderRadius: 12,
        padding: 14,
    },

    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 12,
        color: '#173D8F',
        lineHeight: 18,
    },

});
