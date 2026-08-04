import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DriverStackParamList } from '../../navigation/DriverNavigator';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'Notifications'
>;

type Notification = {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
};

const initialNotifications: Notification[] = [
    {
        id: 1,
        title: 'New Pickup Assigned',
        message: 'Pickup ORD-1001 has been assigned to you. Please confirm.',
        time: '5 min ago',
        read: false,
        icon: 'truck-delivery-outline',
        color: '#173D8F',
    },
    {
        id: 2,
        title: 'New Message',
        message: 'Andiswa Gumede sent you a message about ORD-1002.',
        time: '18 min ago',
        read: false,
        icon: 'message-text-outline',
        color: '#16A34A',
    },
    {
        id: 3,
        title: 'Route Updated',
        message: 'A new stop was added to today’s route.',
        time: '1 hr ago',
        read: true,
        icon: 'map-marker-path',
        color: '#F59E0B',
    },
    {
        id: 4,
        title: 'Delivery Confirmed',
        message: 'Order ORD-1003 was delivered successfully.',
        time: '2 hrs ago',
        read: true,
        icon: 'check-circle-outline',
        color: '#173D8F',
    },
    {
        id: 5,
        title: 'Reminder',
        message: 'You have 3 pickups remaining today.',
        time: '3 hrs ago',
        read: true,
        icon: 'clock-outline',
        color: '#7A8492',
    },
];

export default function NotificationScreen({
    navigation,
}: Props) {
    const [notifications, setNotifications] =
        useState<Notification[]>(initialNotifications);

    const unreadCount = notifications.filter(
        (notification) => !notification.read,
    ).length;

    const markAsRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification,
            ),
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notification) => ({
                ...notification,
                read: true,
            })),
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>

            {/* Header */}
            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name="chevron-back"
                        size={28}
                        color="#12263A"
                    />
                </TouchableOpacity>

                <Text style={styles.title}>
                    Notifications
                </Text>

                <TouchableOpacity
                    onPress={markAllAsRead}
                    disabled={unreadCount === 0}
                >
                    <Text
                        style={[
                            styles.markAll,
                            unreadCount === 0 && styles.markAllDisabled,
                        ]}
                    >
                        Mark all
                    </Text>
                </TouchableOpacity>

            </View>

            {/* Unread badge */}
            {unreadCount > 0 && (
                <View style={styles.unreadBanner}>
                    <Text style={styles.unreadBannerText}>
                        {unreadCount} unread notification
                        {unreadCount > 1 ? 's' : ''}
                    </Text>
                </View>
            )}

            {/* List */}
            <ScrollView contentContainerStyle={styles.container}>

                {notifications.map((notification) => (
                    <TouchableOpacity
                        key={notification.id}
                        style={styles.card}
                        onPress={() => markAsRead(notification.id)}
                    >
                        <View
                            style={[
                                styles.iconCircle,
                                { backgroundColor: `${notification.color}1A` },
                            ]}
                        >
                            <MaterialCommunityIcons
                                name={notification.icon}
                                size={22}
                                color={notification.color}
                            />
                        </View>

                        <View style={styles.cardBody}>

                            <View style={styles.cardTitleRow}>

                                <Text
                                    style={[
                                        styles.cardTitle,
                                        !notification.read &&
                                        styles.cardTitleUnread,
                                    ]}
                                >
                                    {notification.title}
                                </Text>

                                {!notification.read && (
                                    <View style={styles.unreadDot} />
                                )}

                            </View>

                            <Text style={styles.cardMessage}>
                                {notification.message}
                            </Text>

                            <Text style={styles.cardTime}>
                                {notification.time}
                            </Text>

                        </View>

                    </TouchableOpacity>
                ))}

            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E8ECF1',
    },

    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#12263A',
    },

    markAll: {
        fontSize: 13,
        fontWeight: '700',
        color: '#173D8F',
    },

    markAllDisabled: {
        color: '#B9BEC7',
    },

    unreadBanner: {
        backgroundColor: '#E8EFFD',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },

    unreadBannerText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#173D8F',
    },

    container: {
        padding: 16,
        paddingBottom: 30,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },

    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    cardBody: {
        flex: 1,
    },

    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    cardTitle: {
        flex: 1,
        fontSize: 15,
        color: '#12263A',
        fontWeight: '500',
    },

    cardTitleUnread: {
        fontWeight: '700',
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#173D8F',
        marginLeft: 8,
    },

    cardMessage: {
        marginTop: 3,
        fontSize: 13,
        color: '#7A8492',
        lineHeight: 19,
    },

    cardTime: {
        marginTop: 6,
        fontSize: 11,
        color: '#B9BEC7',
    },

});
