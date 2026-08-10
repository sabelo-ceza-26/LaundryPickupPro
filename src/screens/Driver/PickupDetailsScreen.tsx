import React, { useState } from 'react';
import {
    Alert,
    Linking,
    Modal,
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
import { useDriverOrders } from '../../context/DriverOrdersContext';

type Props = NativeStackScreenProps<
    DriverStackParamList,
    'OrderDetails'
>;

export default function PickupDetailsScreen({
    navigation,
    route,
}: Props) {

    const { order } = route.params;
    const { updateOrderStatus } = useDriverOrders();

    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const openMaps = () => {
        Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                order.address,
            )}`,
        ).catch(() =>
            Alert.alert(
                'Cannot open maps',
                'No map application is available on this device.',
            ),
        );
    };

    const confirmPickup = () => {
        setShowConfirm(false);
        updateOrderStatus(order.orderNumber, 'Completed');
        setShowSuccess(true);
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
                <TouchableOpacity
                    style={styles.pickupButton}
                    onPress={() => setShowConfirm(true)}
                >
                    <Text style={styles.pickupButtonText}>
                        Mark as Picked Up
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.mapButton}
                    onPress={openMaps}
                >
                    <Text style={styles.mapButtonText}>
                        Open Maps
                    </Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Confirmation Modal */}
            <Modal
                visible={showConfirm}
                transparent
                animationType="fade"
                onRequestClose={() => setShowConfirm(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalIcon}>
                            <MaterialCommunityIcons
                                name="truck-delivery-outline"
                                size={30}
                                color="#16A34A"
                            />
                        </View>
                        <Text style={styles.modalTitle}>
                            Mark as picked up?
                        </Text>
                        <Text style={styles.modalMessage}>
                            Confirm that you have collected the laundry
                            for {order.orderNumber} from {order.customer}.
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setShowConfirm(false)}
                            >
                                <Text style={styles.modalCancelText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalConfirmButton}
                                onPress={confirmPickup}
                            >
                                <Text style={styles.modalConfirmText}>
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
                        <View style={[styles.modalIcon, styles.successIcon]}>
                            <Ionicons
                                name="checkmark"
                                size={32}
                                color="#FFFFFF"
                            />
                        </View>
                        <Text style={styles.modalTitle}>
                            Order Picked Up
                        </Text>
                        <Text style={styles.modalMessage}>
                            {order.orderNumber} has been marked as picked
                            up successfully.
                        </Text>
                        <TouchableOpacity
                            style={styles.successButton}
                            onPress={() => {
                                setShowSuccess(false);
                                navigation.goBack();
                            }}
                        >
                            <Text style={styles.successButtonText}>
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

    successIcon: {
        backgroundColor: '#16A34A',
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
        backgroundColor: '#16A34A',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },

    modalConfirmText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    successButton: {
        alignSelf: 'stretch',
        height: 48,
        borderRadius: 12,
        backgroundColor: '#16A34A',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },

    successButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },

});
