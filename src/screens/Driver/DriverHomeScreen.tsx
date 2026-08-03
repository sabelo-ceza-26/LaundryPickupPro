import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DriverStackParamList } from '../../navigation/DriverNavigator';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'Home'
>;

const orders = [
    {
        id: 1,
        orderNumber: 'ORD-1001',
        type: 'Pickup',
        customer: 'Matthew Yako',
        address: '173 Sir Lowry, Woodstock',
        time: '10:00 AM',
    },
    {
        id: 2,
        orderNumber: 'ORD-1002',
        type: 'Delivery',
        customer: 'Andiswa Gumede',
        address: '173 Sir Lowry, Woodstock',
        receiver: 'Jessica Moose',
        receiverAddress: '10 St Marks, Observatory',
        time: '11:00 AM',
    },
    {
        id: 3,
        orderNumber: 'ORD-1003',
        type: 'Pickup',
        customer: 'Sarah Jenkins',
        address: '45 Albert Road, Woodstock',
        time: '12:30 PM',
    },
];

export default function DriverHomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                {/* Header */}

                <View style={styles.header}>

                    <TouchableOpacity>
                        <Ionicons
                            name="menu"
                            size={24}
                            color="#12263A"
                        />
                    </TouchableOpacity>

                    <Text style={styles.welcome}>
                        Welcome, John
                    </Text>

                    <TouchableOpacity>
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

                <TouchableOpacity style={styles.routeButton}>
                    <Text style={styles.routeButtonText}>
                        Start Route
                    </Text>
                </TouchableOpacity>

                {/* Orders */}

                <Text style={styles.sectionTitle}>
                    Today's Orders
                </Text>

                {orders.map((order) => (

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

                                {order.receiver && (
                                    <>
                                        <Text style={styles.customer}>
                                            {order.receiver}
                                        </Text>

                                        <Text style={styles.address}>
                                            {order.receiverAddress}
                                        </Text>
                                    </>
                                )}

                            </View>

                        </View>

                        <View style={styles.orderRight}>

                            <Text style={styles.time}>
                                {order.time}
                            </Text>

                            <TouchableOpacity style={styles.viewButton}>
                                <Text style={styles.viewButtonText}>
                                    View
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>

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

});