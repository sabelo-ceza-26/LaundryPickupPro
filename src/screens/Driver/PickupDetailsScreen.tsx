import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DriverStackParamList } from '../../navigation/DriverNavigator';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'OrderDetails'
>;

export default function PickupDetailsScreen({
    navigation,
    route,
}: Props) {

    const { order } = route.params;

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
                        Pickup Details
                    </Text>

                    <View style={{ width: 28 }} />

                </View>

                {/* Order Number */}
                <View style={styles.card}>

                    <Text style={styles.orderLabel}>
                        Order Number
                    </Text>

                    <Text style={styles.orderNumber}>
                        {order.orderNumber}
                    </Text>

                </View>

                {/* Customer */}
                <View style={[styles.card, styles.customerSection]}>

                    <View style={styles.avatar}>
                        <MaterialCommunityIcons
                            name="account"
                            size={30}
                            color="#FFFFFF"
                        />
                    </View>

                    <View style={styles.customerInfo}>

                        <Text style={styles.customerName}>
                            {order.customer}
                        </Text>

                        <Text style={styles.phone}>
                            {order.phone}
                        </Text>

                    </View>

                </View>

                {/* Pickup Address */}
                <Text style={styles.heading}>
                    Pickup Address
                </Text>

                <View style={styles.card}>
                    <Text style={styles.info}>
                        {order.address}
                    </Text>
                </View>

                {/* Laundromat */}
                <Text style={styles.heading}>
                    Laundromat
                </Text>

                <View style={styles.card}>

                    <Text style={styles.info}>
                        {order.laundromat}
                    </Text>

                    <Text style={styles.infoSub}>
                        {order.laundromatAddress}
                    </Text>

                </View>

                {/* Pickup Time */}
                <Text style={styles.heading}>
                    Pickup Time
                </Text>

                <View style={styles.card}>
                    <Text style={styles.info}>
                        {order.time}
                    </Text>
                </View>

                {/* Notes */}
                <Text style={styles.heading}>
                    Special Notes
                </Text>

                <View style={styles.card}>
                    <Text style={styles.notes}>
                        {order.notes}
                    </Text>
                </View>

                {/* Buttons */}
                <TouchableOpacity style={styles.pickupButton}>
                    <Text style={styles.pickupButtonText}>
                        Mark as Picked Up
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.mapButton}>
                    <Text style={styles.mapButtonText}>
                        Open Maps
                    </Text>
                </TouchableOpacity>

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

    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#12263A',
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 15,
        marginBottom: 14,
        elevation: 2,
    },

    orderLabel: {
        fontSize: 12,
        color: '#7A8492',
        marginBottom: 5,
    },

    orderNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#173D8F',
    },

    customerSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#173D8F',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },

    customerInfo: {
        flex: 1,
    },

    customerName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#12263A',
    },

    phone: {
        fontSize: 14,
        color: '#666',
        marginTop: 3,
    },

    heading: {
        fontSize: 15,
        fontWeight: '700',
        color: '#12263A',
        marginBottom: 10,
        marginTop: 6,
    },

    info: {
        fontSize: 14,
        color: '#555',
    },

    infoSub: {
        fontSize: 13,
        color: '#7A8492',
        marginTop: 4,
    },

    notes: {
        fontSize: 14,
        color: '#777',
        lineHeight: 22,
    },

    pickupButton: {
        backgroundColor: '#16A34A',
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 10,
    },

    pickupButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

    mapButton: {
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    mapButtonText: {
        color: '#173D8F',
        fontSize: 16,
        fontWeight: '700',
    },

});
