import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { formatTimeWindow } from '../utils/format';

type Props = {
  visible: boolean;
  mode: 'date' | 'time';
  title: string;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
};

const TEAL = '#0F363F';
const TEAL_MID = '#1E5660';
const TEAL_TINT = '#E2ECEB';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const TIME_SLOTS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  return cells;
}

export default function DateTimePickerModal({
  visible,
  mode,
  title,
  value,
  onChange,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewMonth, setViewMonth] = useState({
    y: value.getFullYear(),
    m: value.getMonth(),
  });

  useEffect(() => {
    if (visible) {
      setViewMonth({ y: value.getFullYear(), m: value.getMonth() });
    }
  }, [visible, value]);

  const grid = useMemo(
    () => buildCalendarGrid(viewMonth.y, viewMonth.m),
    [viewMonth]
  );

  const monthLabel = new Date(viewMonth.y, viewMonth.m, 1).toLocaleString(
    'en-US',
    { month: 'long', year: 'numeric' }
  );

  const canGoPrev =
    viewMonth.y > today.getFullYear() ||
    (viewMonth.y === today.getFullYear() && viewMonth.m > today.getMonth());

  const goPrev = () =>
    setViewMonth(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }));
  const goNext = () =>
    setViewMonth(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }));

  const selectDate = (day: number) => {
    const next = new Date(viewMonth.y, viewMonth.m, day, value.getHours(), value.getMinutes());
    onChange(next);
    onClose();
  };

  const selectTime = (hour: number) => {
    const next = new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      hour,
      0
    );
    onChange(next);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={18} color={TEXT_MUTED} />
            </TouchableOpacity>
          </View>

          {mode === 'date' ? (
            <View style={styles.calendar}>
              <View style={styles.monthRow}>
                <TouchableOpacity
                  style={[styles.monthArrow, !canGoPrev && styles.monthArrowDisabled]}
                  onPress={goPrev}
                  disabled={!canGoPrev}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={22}
                    color={canGoPrev ? TEAL : '#C6CFD6'}
                  />
                </TouchableOpacity>
                <Text style={styles.monthLabel}>{monthLabel}</Text>
                <TouchableOpacity style={styles.monthArrow} onPress={goNext}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={22}
                    color={TEAL}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.weekRow}>
                {WEEKDAYS.map((d, i) => (
                  <Text key={i} style={styles.weekday}>
                    {d}
                  </Text>
                ))}
              </View>

              <View style={styles.grid}>
                {grid.map((day, i) =>
                  day === null ? (
                    <View key={i} style={styles.dayCell} />
                  ) : (
                    <TouchableOpacity
                      key={i}
                      style={styles.dayCell}
                      disabled={
                        startOfDay(new Date(viewMonth.y, viewMonth.m, day)) <
                        today
                      }
                      onPress={() => selectDate(day)}
                    >
                      <View
                        style={[
                          styles.dayButton,
                          isSameDay(
                            new Date(viewMonth.y, viewMonth.m, day),
                            value
                          ) && styles.daySelected,
                          startOfDay(
                            new Date(viewMonth.y, viewMonth.m, day)
                          ) < today && styles.dayDisabled,
                          isSameDay(
                            new Date(viewMonth.y, viewMonth.m, day),
                            today
                          ) && styles.dayToday,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isSameDay(
                              new Date(viewMonth.y, viewMonth.m, day),
                              value
                            ) && styles.dayTextSelected,
                            startOfDay(
                              new Date(viewMonth.y, viewMonth.m, day)
                            ) < today && styles.dayTextDisabled,
                          ]}
                        >
                          {day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          ) : (
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map((hour) => {
                const slot = new Date(
                  value.getFullYear(),
                  value.getMonth(),
                  value.getDate(),
                  hour,
                  0
                );
                const selected = slot.getHours() === value.getHours();
                const isToday = isSameDay(value, new Date());
                const now = new Date();
                const isPast = isToday && hour < now.getHours();
                return (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timeChip,
                      selected && styles.timeChipSelected,
                      isPast && styles.timeChipDisabled,
                    ]}
                    disabled={isPast}
                    onPress={() => selectTime(hour)}
                  >
                    <Text
                      style={[
                        styles.timeChipText,
                        selected && styles.timeChipTextSelected,
                        isPast && styles.timeChipTextDisabled,
                      ]}
                    >
                      {formatTimeWindow(slot)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 38, 58, 0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: '80%',
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D9DFE5',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: TEXT_DARK,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: {
    alignItems: 'center',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  monthArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TEAL_TINT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthArrowDisabled: {
    backgroundColor: '#F1F4F6',
  },
  monthLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: TEXT_DARK,
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 4,
  },
  weekday: {
    width: '14.28%',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_MUTED,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    marginVertical: 3,
  },
  dayButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelected: {
    backgroundColor: TEAL,
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: TEAL,
  },
  dayDisabled: {
    opacity: 0.3,
  },
  dayText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: TEXT_DARK,
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  dayTextDisabled: {
    color: TEXT_MUTED,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeChip: {
    width: '48%',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  timeChipSelected: {
    borderColor: TEAL,
    backgroundColor: TEAL_TINT,
  },
  timeChipText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: TEAL_MID,
  },
  timeChipTextSelected: {
    fontFamily: 'Poppins_600SemiBold',
    color: TEAL,
  },
  timeChipDisabled: {
    opacity: 0.35,
    backgroundColor: '#F1F4F6',
    borderColor: '#F1F4F6',
  },
  timeChipTextDisabled: {
    color: TEXT_MUTED,
  },
});
