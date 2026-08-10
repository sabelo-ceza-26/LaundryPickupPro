import React, { useState } from 'react';
import {
    Alert,
    Linking,
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
    'Navigation'
>;

type Stop = {
    id: number;
    orderNumber: string;
    type: 'Pickup' | 'Delivery';
    customer: string;
    phone: string;
    address: string;
    time: string;
    notes: string;
    done: boolean;
};

const initialStops: Stop[] = [
    {
        id: 1,
        orderNumber: 'ORD-1001',
        type: 'Pickup',
        customer: 'Matthew Yako',
        phone: '083 987 5462',
        address: '173 Sir Lowry, Woodstock',
        time: '10:00 AM',
        notes: 'Leave laundry bags on the front porch if not answered.',
        done: false,
    },
    {
        id: 2,
        orderNumber: 'ORD-1002',
        type: 'Delivery',
        customer: 'Andiswa Gumede',
        phone: '082 123 4567',
        address: '22 Long Street, Cape Town',
        time: '11:00 AM',
        notes: 'Call before arrival.',
        done: false,
    },
    {
        id: 3,
        orderNumber: 'ORD-1003',
        type: 'Pickup',
        customer: 'Sarah Jenkins',
        phone: '084 555 7890',
        address: '45 Albert Road, Woodstock',
        time: '12:30 PM',
        notes: 'Customer prefers contactless pickup.',
        done: false,
    },
];

export default function NavigationScreen({
    navigation,
}: Props) {
    const [started, setStarted] = useState(false);
    const [stops, setStops] = useState<Stop[]>(initialStops);
    const [currentIndex, setCurrentIndex] = useState(0);

    const completedCount = stops.filter((stop) => stop.done).length;
    const currentStop = started
        ? stops[currentIndex]
        : null;
    const finished =
        started && completedCount === stops.length;

    const startRoute = () => {
        setStarted(true);
    };

    const completeCurrentStop = () => {
        if (!currentStop) return;

        const nextStops = stops.map((stop) =>
            stop.id === currentStop.id
                ? { ...stop, done: true }
                : stop,
        );
        setStops(nextStops);

        if (currentIndex + 1 >= stops.length) {
            setCurrentIndex(stops.length);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const callCustomer = () => {
        if (!currentStop) return;
        Linking.openURL(`tel:${currentStop.phone}`).catch(() =>
            Alert.alert(
                'Cannot call',
                'No calling app is available on this device.',
            ),
        );
    };

    const openMaps = () => {
        if (!currentStop) return;
        Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                currentStop.address,
            )}`,
        ).catch(() =>
            Alert.alert(
                'Cannot open maps',
                'No map application is available on this device.',
            ),
        );
    };

    const finishRoute = () => {
        navigation.goBack();
    };

    const renderStopStatus = (index: number) => {
        const stop = stops[index];
        if (stop.done) {
            return (
                <View style={[styles.stopDot, styles.stopDotDone]}>
                    <Ionicons
                        name="checkmark"
                        size={14}
                        color="#FFFFFF"
                    />
                </View>
            );
        }
        if (started && index === currentIndex) {
            return (
                <View style={styles.stopDotActive}>
                    <View style={styles.stopDotActiveInner} />
                </View>
            );
        }
        return <View style={styles.stopDot} />;
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
                        Navigation
                    </Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Route Summary */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryTop}>
                        <View>
                            <Text style={styles.summaryLabel}>
                                Today's Route
                            </Text>
                            <Text style={styles.summaryTitle}>
                                {completedCount} of {stops.length} stops
                                completed
                            </Text>
                        </View>
                        <View style={styles.progressCircle}>
                            <Text style={styles.progressText}>
                                {Math.round(
                                    (completedCount / stops.length) * 100,
                                )}
                                %
                            </Text>
                        </View>
                    </View>
                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${
                                        (completedCount / stops.length) *
                                        100
                                    }%`,
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* Current Stop */}
                {started && !finished && currentStop && (
                    <View style={styles.currentCard}>
                        <View style={styles.currentHeader}>
                            <View
                                style={[
                                    styles.currentBadge,
                                    {
                                        backgroundColor:
                                            currentStop.type === 'Pickup'
                                                ? '#E8EFFD'
                                                : '#E9F9EF',
                                    },
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name={
                                        currentStop.type === 'Pickup'
                                            ? 'truck-delivery-outline'
                                            : 'package-variant'
                                    }
                                    size={20}
                                    color={
                                        currentStop.type === 'Pickup'
                                            ? '#173D8F'
                                            : '#16A34A'
                                    }
                                />
                            </View>
                            <View style={styles.currentInfo}>
                                <Text style={styles.currentOrderNumber}>
                                    {currentStop.orderNumber}
                                </Text>
                                <Text style={styles.currentType}>
                                    {currentStop.type} · {currentStop.time}
                                </Text>
                            </View>
                            <View style={styles.nextBadge}>
                                <Text style={styles.nextBadgeText}>
                                    Stop {currentIndex + 1} of {stops.length}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.currentCustomer}>
                            {currentStop.customer}
                        </Text>
                        <Text style={styles.currentAddress}>
                            <Ionicons
                                name="location-outline"
                                size={13}
                                color="#7A8492"
                            />
                            {'  '}
                            {currentStop.address}
                        </Text>
                        <Text style={styles.currentNotes}>
                            {currentStop.notes}
                        </Text>

                        <View style={styles.currentActions}>
                            <TouchableOpacity
                                style={styles.callButton}
                                onPress={callCustomer}
                            >
                                <Ionicons
                                    name="call-outline"
                                    size={18}
                                    color="#173D8F"
                                />
                                <Text style={styles.callButtonText}>
                                    Call
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.navigateButton}
                                onPress={openMaps}
                            >
                                <Ionicons
                                    name="navigate-outline"
                                    size={18}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.navigateButtonText}>
                                    Navigate
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Finished */}
                {finished && (
                    <View style={styles.finishedCard}>
                        <View style={styles.finishedIcon}>
                            <Ionicons
                                name="flag"
                                size={32}
                                color="#16A34A"
                            />
                        </View>
                        <Text style={styles.finishedTitle}>
                            Route Complete!
                        </Text>
                        <Text style={styles.finishedMessage}>
                            All {stops.length} stops have been completed.
                            Great work today.
                        </Text>
                        <TouchableOpacity
                            style={styles.finishButton}
                            onPress={finishRoute}
                        >
                            <Text style={styles.finishButtonText}>
                                Back to Dashboard
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Stops List */}
                <Text style={styles.sectionTitle}>
                    Route Stops
                </Text>

                <View style={styles.stopsCard}>
                    {stops.map((stop, index) => (
                        <View
                            key={stop.id}
                            style={[
                                styles.stopRow,
                                index === stops.length - 1 &&
                                styles.stopRowLast,
                            ]}
                        >
                            <View style={styles.stopIndicator}>
                                {renderStopStatus(index)}
                                {index !== stops.length - 1 && (
                                    <View style={styles.stopLine} />
                                )}
                            </View>
                            <View style={styles.stopInfo}>
                                <View style={styles.stopInfoTop}>
                                    <Text style={styles.stopOrderNumber}>
                                        {stop.orderNumber}
                                    </Text>
                                    <Text style={styles.stopTime}>
                                        {stop.time}
                                    </Text>
                                </View>
                                <Text style={styles.stopCustomer}>
                                    {stop.customer}
                                </Text>
                                <Text style={styles.stopAddress}>
                                    {stop.address}
                                </Text>
                                <Text
                                    style={[
                                        styles.stopType,
                                        {
                                            color:
                                                stop.type === 'Pickup'
                                                    ? '#173D8F'
                                                    : '#16A34A',
                                        },
                                    ]}
                                >
                                    {stop.type}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Start Route Button */}
                {!started && (
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={startRoute}
                    >
                        <Ionicons
                            name="play"
                            size={20}
                            color="#FFFFFF"
                        />
                        <Text style={styles.startButtonText}>
                            Start Route
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Complete Stop Button */}
                {started && !finished && currentStop && (
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={completeCurrentStop}
                    >
                        <Ionicons
                            name="checkmark-done"
                            size={20}
                            color="#FFFFFF"
                        />
                        <Text style={styles.startButtonText}>
                            {currentIndex + 1 >= stops.length
                                ? 'Finish Route'
                                : 'Complete & Next Stop'}
                        </Text>
                    </TouchableOpacity>
                )}

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

    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },

    summaryTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    summaryLabel: {
        fontSize: 12,
        color: '#7A8492',
    },

    summaryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#12263A',
        marginTop: 3,
    },

    progressCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#E8EFFD',
        justifyContent: 'center',
        alignItems: 'center',
    },

    progressText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#173D8F',
    },

    progressTrack: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E8ECF1',
        marginTop: 14,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: '#173D8F',
    },

    currentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#173D8F',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },

    currentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    currentBadge: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    currentInfo: {
        flex: 1,
    },

    currentOrderNumber: {
        fontSize: 15,
        fontWeight: '700',
        color: '#12263A',
    },

    currentType: {
        fontSize: 12,
        color: '#7A8492',
        marginTop: 2,
    },

    nextBadge: {
        backgroundColor: '#173D8F',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    nextBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    currentCustomer: {
        fontSize: 16,
        fontWeight: '700',
        color: '#12263A',
        marginTop: 12,
    },

    currentAddress: {
        fontSize: 13,
        color: '#7A8492',
        marginTop: 4,
    },

    currentNotes: {
        fontSize: 12,
        color: '#777',
        marginTop: 8,
        lineHeight: 18,
        fontStyle: 'italic',
    },

    currentActions: {
        flexDirection: 'row',
        marginTop: 14,
    },

    callButton: {
        flex: 1,
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#173D8F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },

    callButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#173D8F',
        marginLeft: 6,
    },

    navigateButton: {
        flex: 1,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#173D8F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    navigateButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 6,
    },

    finishedCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },

    finishedIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E9F9EF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    finishedTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#12263A',
        marginTop: 12,
    },

    finishedMessage: {
        fontSize: 13,
        color: '#7A8492',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 20,
    },

    finishButton: {
        alignSelf: 'stretch',
        height: 48,
        borderRadius: 12,
        backgroundColor: '#173D8F',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },

    finishButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#12263A',
        marginBottom: 10,
    },

    stopsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginBottom: 18,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },

    stopRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E8ECF1',
    },

    stopRowLast: {
        borderBottomWidth: 0,
    },

    stopIndicator: {
        alignItems: 'center',
        width: 24,
        marginRight: 10,
    },

    stopDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#B9BEC7',
        backgroundColor: '#FFFFFF',
    },

    stopDotDone: {
        borderColor: '#16A34A',
        backgroundColor: '#16A34A',
        justifyContent: 'center',
        alignItems: 'center',
    },

    stopDotActive: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#173D8F',
        justifyContent: 'center',
        alignItems: 'center',
    },

    stopDotActiveInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#173D8F',
    },

    stopLine: {
        flex: 1,
        width: 2,
        backgroundColor: '#E8ECF1',
        minHeight: 16,
        marginVertical: 2,
    },

    stopInfo: {
        flex: 1,
    },

    stopInfoTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    stopOrderNumber: {
        fontSize: 13,
        fontWeight: '700',
        color: '#173D8F',
    },

    stopTime: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7A8492',
    },

    stopCustomer: {
        fontSize: 14,
        fontWeight: '600',
        color: '#12263A',
        marginTop: 3,
    },

    stopAddress: {
        fontSize: 12,
        color: '#7A8492',
        marginTop: 2,
    },

    stopType: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: 4,
    },

    startButton: {
        backgroundColor: '#173D8F',
        height: 52,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },

    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },

});
