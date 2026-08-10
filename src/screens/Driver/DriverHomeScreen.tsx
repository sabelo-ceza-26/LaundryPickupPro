import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    View,
} from 'react-native';
import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DriverStackParamList } from '../../navigation/DriverNavigator';
import { useAuth } from '../../hooks/useAuth';
import { useDriverOrders } from '../../context/DriverOrdersContext';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'Home'
>;

export default function DriverHomeScreen({ navigation }: Props) {
    const { user, signOut } = useAuth();
    const { orders } = useDriverOrders();
    const insets = useSafeAreaInsets();
    const [searchText, setSearchText] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const closeMenu = () => setMenuVisible(false);

    const confirmLogout = () => {
        setShowLogoutModal(false);
        signOut();
    };

    const filteredOrders = orders.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchText.trim().toLowerCase()),
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                {/* Header */}

                <View style={styles.header}>

                    <TouchableOpacity
                        onPress={() => setMenuVisible((visible) => !visible)}
                    >
                        <Ionicons
                            name="menu"
                            size={24}
                            color="#12263A"
                        />
                    </TouchableOpacity>

                    <Text style={styles.welcome}>
                        Welcome, {user?.name ?? 'Driver'}
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Notifications')
                        }
                    >
                        <Ionicons
                            name="notifications-outline"
                            size={24}
                            color="#12263A"
                        />
                    </TouchableOpacity>

                </View>

                {/* Search */}

                <View style={styles.searchContainer}>

                    <Ionicons
                        name="search"
                        size={20}
                        color="#777"
                    />

                    <TextInput
                        placeholder="Search by Order Number"
                        placeholderTextColor="#888"
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                    />

                </View>

                {/* Summary */}

                <Text style={styles.sectionTitle}>
                    Today's Summary
                </Text>

                <View style={styles.summaryRow}>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>
                            Pickups
                        </Text>

                        <Text style={styles.summaryNumber}>
                            4
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>
                            Deliveries
                        </Text>

                        <Text style={styles.summaryNumber}>
                            2
                        </Text>
                    </View>

                </View>

                {/* Route Button */}

                <TouchableOpacity
                    style={styles.routeButton}
                    onPress={() => navigation.navigate('Navigation')}
                >
                    <Text style={styles.routeButtonText}>
                        Start Route
                    </Text>
                </TouchableOpacity>

                {/* Orders */}

                <Text style={styles.sectionTitle}>
                    Today's Orders
                </Text>

                {filteredOrders.map((order) => (

                    <View
                        key={order.id}
                        style={styles.orderCard}
                    >

                        <View style={styles.orderLeft}>

                            <MaterialCommunityIcons
                                name={
                                    order.type === 'Pickup'
                                        ? 'truck-delivery-outline'
                                        : 'package-variant'
                                }
                                size={28}
                                color="#F4A928"
                            />

                            <View style={styles.orderInfo}>

                                <Text style={styles.orderNumber}>
                                    {order.orderNumber}
                                </Text>

                                <Text style={styles.orderType}>
                                    {order.type}
                                </Text>

                                <Text style={styles.customer}>
                                    {order.customer}
                                </Text>

                                <Text style={styles.address}>
                                    {order.address}
                                </Text>

                            </View>

                        </View>

                        <View style={styles.orderRight}>

                            <Text style={styles.time}>
                                {order.time}
                            </Text>

                            <TouchableOpacity
                                style={styles.viewButton}
                                onPress={() =>
                                    order.type === 'Delivery'
                                        ? navigation.navigate('DeliveryDetails', {
                                            order,
                                        })
                                        : navigation.navigate('OrderDetails', {
                                            order,
                                        })
                                }
                            >
                                <Text style={styles.viewButtonText}>
                                    View
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>

                ))}

            </ScrollView>

            {/* Options Menu */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={closeMenu}
            >
                <Pressable
                    style={styles.menuBackdrop}
                    onPress={closeMenu}
                >
                    <View
                        style={[
                            styles.optionsMenu,
                            { top: insets.top + 50, left: 20 },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('Notifications');
                            }}
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={18}
                                color="#12263A"
                            />
                            <Text style={styles.menuItemText}>
                                Notifications
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('Profile');
                            }}
                        >
                            <Ionicons
                                name="person-outline"
                                size={18}
                                color="#12263A"
                            />
                            <Text style={styles.menuItemText}>
                                Profile
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                closeMenu();
                                setShowLogoutModal(true);
                            }}
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={18}
                                color="#E11D48"
                            />
                            <Text style={[styles.menuItemText, styles.menuItemLogout]}>
                                Sign Out
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

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

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    welcome: {
        fontSize: 22,
        fontWeight: '700',
        color: '#12263A',
    },

    searchContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        marginBottom: 20,
        elevation: 2,
    },

    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#12263A',
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#12263A',
        marginBottom: 12,
    },

    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    summaryCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 18,
        elevation: 2,
    },

    summaryLabel: {
        color: '#7A8492',
        fontSize: 13,
    },

    summaryNumber: {
        marginTop: 10,
        fontSize: 30,
        fontWeight: '700',
        color: '#173D8F',
    },

    routeButton: {
        backgroundColor: '#173D8F',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },

    routeButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },

    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 15,
        marginBottom: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 2,
    },

    orderLeft: {
        flexDirection: 'row',
        flex: 1,
    },

    orderInfo: {
        marginLeft: 12,
        flex: 1,
    },

    orderNumber: {
        fontSize: 11,
        color: '#7A8492',
        fontWeight: '600',
        marginBottom: 4,
    },

    orderType: {
        fontSize: 15,
        fontWeight: '700',
        color: '#12263A',
    },

    customer: {
        marginTop: 4,
        fontSize: 13,
        color: '#12263A',
    },

    address: {
        marginTop: 2,
        fontSize: 12,
        color: '#7A8492',
    },

    orderRight: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },

    time: {
        fontSize: 13,
        fontWeight: '700',
        color: '#12263A',
    },

    viewButton: {
        backgroundColor: '#173D8F',
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 8,
    },

    viewButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },

    menuBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },

    optionsMenu: {
        position: 'absolute',
        width: 220,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        elevation: 6,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        paddingVertical: 6,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 13,
    },

    menuItemText: {
        marginLeft: 12,
        fontSize: 15,
        fontWeight: '600',
        color: '#12263A',
    },

    menuItemLogout: {
        color: '#E11D48',
    },

    menuDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#E8ECF1',
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