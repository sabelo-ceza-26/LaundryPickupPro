import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DriverStackParamList } from '../../navigation/DriverNavigator';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'Orders'
>;

const orders = [
    {
        id: 1,
        orderNumber: 'ORD-1001',
        type: 'Pickup',
        customer: 'Matthew Yako',
        address: '173 Sir Lowry, Woodstock',
        time: '10:30 AM',
        status: 'Assigned',
        phone: '083 987 5462',
        laundromat: 'Clean & Fresh Laundry',
        laundromatAddress: '17 Hanover Street, District Six',
        notes: 'Leave laundry bags on the porch.',
    },
    {
        id: 2,
        orderNumber: 'ORD-1002',
        type: 'Pickup',
        customer: 'Nosipho Dlala',
        address: '01 Adderley Rd, Maitland',
        time: '12:00 PM',
        status: 'Pending',
        phone: '081 123 4567',
        laundromat: 'Fresh Laundry',
        laundromatAddress: '10 Main Road',
        notes: 'Call before arrival.',
    },
    {
        id: 3,
        orderNumber: 'ORD-1003',
        type: 'Delivery',
        customer: 'Andiswa Gumede',
        address: '173 Sir Lowry, Woodstock',
        time: '11:00 AM',
        status: 'Assigned',
        phone: '082 345 6789',
        laundromat: 'Sparkle Laundry',
        laundromatAddress: '22 Long Street',
        notes: 'Leave with security.',
    },
    {
        id: 4,
        orderNumber: 'ORD-1004',
        type: 'Delivery',
        customer: 'Jessica Moose',
        address: '10 St Marks, Observatory',
        time: '15:30 PM',
        status: 'Pending',
        phone: '079 123 1111',
        laundromat: 'Sparkle Laundry',
        laundromatAddress: '22 Long Street',
        notes: 'Customer not home before 3pm.',
    },
];

export default function OrdersScreen({
    navigation,
}: Props) {

    const [selectedTab, setSelectedTab] =
        useState('All');

    const filteredOrders = orders.filter((order) => {
        if (selectedTab === 'All') return true;
        if (selectedTab === 'Completed')
            return order.status === 'Completed';

        return order.type === selectedTab;
    });

    return (
        <SafeAreaView style={styles.safeArea}>

            <ScrollView contentContainerStyle={styles.container}>

                {/* Header */}

                <View style={styles.header}>

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={26}
                            color="#12263A"
                        />
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        My Orders
                    </Text>

                    <View style={{ width: 26 }} />

                </View>

                {/* Tabs */}

                <View style={styles.tabs}>

                    {['All', 'Pickup', 'Delivery', 'Completed'].map((tab) => (

                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                selectedTab === tab && styles.activeTab,
                            ]}
                            onPress={() => setSelectedTab(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === tab &&
                                    styles.activeTabText,
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>

                    ))}

                </View>

                <Text style={styles.today}>
                    Today
                </Text>

                {filteredOrders.map((order) => (

                    <TouchableOpacity
                        key={order.id}
                        style={[
                            styles.orderCard,
                            {
                                borderLeftColor:
                                    order.type === 'Pickup'
                                        ? '#173D8F'
                                        : '#4CAF50',
                            },
                        ]}
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

                        <View style={styles.left}>

                            <MaterialCommunityIcons
                                name={
                                    order.type === 'Pickup'
                                        ? 'truck-delivery-outline'
                                        : 'package-variant'
                                }
                                size={28}
                                color="#F4A928"
                            />

                            <View style={styles.info}>

                                <Text style={styles.type}>
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

                        <View style={styles.right}>

                            <Text style={styles.time}>
                                {order.time}
                            </Text>

                            <Text
                                style={[
                                    styles.status,
                                    {
                                        color:
                                            order.status === 'Assigned'
                                                ? '#16A34A'
                                                : '#F59E0B',
                                    },
                                ]}
                            >
                                {order.status}
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

    container: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 30,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#12263A',
    },

    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 4,
        marginBottom: 18,
        elevation: 2,
    },

    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
    },

    activeTab: {
        backgroundColor: '#173D8F',
    },

    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#12263A',
    },

    activeTabText: {
        color: '#FFFFFF',
    },

    today: {
        fontSize: 15,
        fontWeight: '700',
        color: '#12263A',
        marginBottom: 12,
    },

    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderLeftWidth: 4,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
    },

    left: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },

    info: {
        marginLeft: 12,
        flex: 1,
    },

    type: {
        fontSize: 15,
        fontWeight: '700',
        color: '#12263A',
    },

    customer: {
        marginTop: 3,
        fontSize: 13,
        color: '#12263A',
    },

    address: {
        marginTop: 3,
        fontSize: 12,
        color: '#7A8492',
    },

    right: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 55,
    },

    time: {
        fontSize: 13,
        fontWeight: '700',
        color: '#12263A',
    },

    status: {
        fontSize: 11,
        fontWeight: '700',
    },

});