import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TEAL = '#0F363F';
const TEXT_DARK = '#1F2933';

const STEPS = ['Pickup', 'Review', 'Payment', 'Done'];

type Props = {
  current: number;
  title: string;
};

export default function BookingProgress({ current, title }: Props) {
  return (
    <>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{title}</Text>
      </View>

      <View style={styles.progressBar}>
        {STEPS.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < current;
          const isActive = stepNum === current;
          return (
            <React.Fragment key={label}>
              <View style={styles.step}>
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCircleDone,
                    isActive && styles.stepCircleActive,
                  ]}
                >
                  {isCompleted ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={14}
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        isActive && styles.stepNumberActive,
                      ]}
                    >
                      {stepNum}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    (isCompleted || isActive) && styles.stepLabelActive,
                  ]}
                >
                  {label}
                </Text>
              </View>
              {index < STEPS.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    index + 1 < current && styles.stepLineActive,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  progressLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEXT_DARK,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  step: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CFD8E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleDone: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  stepCircleActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
    elevation: 3,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  stepNumber: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#9AA5B1',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    color: '#9AA5B1',
    marginTop: 5,
  },
  stepLabelActive: {
    color: TEAL,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E1E7EC',
    marginHorizontal: 6,
    marginBottom: 20,
  },
  stepLineActive: {
    backgroundColor: TEAL,
  },
});
