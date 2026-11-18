import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { BookingModalScreenProps } from '../types/navigation';
import { StudySpace, Booking } from '../types';

type Props = BookingModalScreenProps & {
  spaces: StudySpace[];
  onAddBooking: (booking: Booking) => void;
};

export const BookingModalScreen: React.FC<Props> = ({
  route,
  navigation,
  spaces,
  onAddBooking,
}) => {
  const { spaceId } = route.params;
  const space = spaces.find((s) => s.id === spaceId);

  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [groupSize, setGroupSize] = useState<number>(1);
  const [purpose, setPurpose] = useState<string>('');
  const [slotError, setSlotError] = useState<string>('');
  const [purposeError, setPurposeError] = useState<string>('');

  if (!space) {
    return (
      <View style={styles.notFound}>
        <Text>Space not found.</Text>
      </View>
    );
  }

  const handleIncrement = () => {
    if (groupSize < space.seats) setGroupSize((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (groupSize > 1) setGroupSize((prev) => prev - 1);
  };

  const handleConfirm = () => {
    let hasError = false;

    if (!selectedSlot) {
      setSlotError('Please choose a time slot.');
      hasError = true;
    } else {
      setSlotError('');
    }

    if (purpose.trim().length < 10) {
      setPurposeError('Purpose must be at least 10 characters.');
      hasError = true;
    } else {
      setPurposeError('');
    }

    if (hasError) return;

    // Check if slot was already taken in the meantime
    if (space.bookedSlots.includes(selectedSlot)) {
      Alert.alert('Unavailable', 'This slot has already been booked.');
      return;
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      spaceId: space.id,
      spaceName: space.name,
      building: space.building,
      date: 'Wed, Nov 18, 2026',
      slot: selectedSlot,
      groupSize,
      purpose: purpose.trim(),
    };

    onAddBooking(newBooking);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.spaceTitle}>{space.name}</Text>
        <Text style={styles.spaceSub}>
          Wed, Nov 18, 2026 · {space.building}
        </Text>

        {/* Time Slots */}
        <Text style={styles.label}>Time slot</Text>
        <View style={styles.slotsRow}>
          {space.slots.map((slot) => {
            const isBooked = space.bookedSlots.includes(slot);
            const isSelected = selectedSlot === slot;

            return (
              <Pressable
                key={slot}
                disabled={isBooked}
                onPress={() => {
                  setSelectedSlot(slot);
                  setSlotError('');
                }}
                style={[
                  styles.slotChip,
                  isSelected && styles.slotChipSelected,
                  isBooked && styles.slotChipDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.slotChipText,
                    isSelected && styles.slotChipTextSelected,
                    isBooked && styles.slotChipTextDisabled,
                  ]}
                >
                  {slot}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {!!slotError && <Text style={styles.errorText}>{slotError}</Text>}

        {/* Stepper for Group Size */}
        <Text style={styles.label}>Group size</Text>
        <View style={styles.stepperRow}>
          <Pressable
            style={[styles.stepperBtn, groupSize <= 1 && styles.stepperBtnDisabled]}
            onPress={handleDecrement}
            disabled={groupSize <= 1}
          >
            <Text style={styles.stepperBtnText}>−</Text>
          </Pressable>
          <Text style={styles.stepperValue}>{groupSize}</Text>
          <Pressable
            style={[
              styles.stepperBtn,
              groupSize >= space.seats && styles.stepperBtnDisabled,
            ]}
            onPress={handleIncrement}
            disabled={groupSize >= space.seats}
          >
            <Text style={styles.stepperBtnText}>+</Text>
          </Pressable>
          <Text style={styles.maxSeatsText}>max {space.seats} seats</Text>
        </View>

        {/* Purpose */}
        <Text style={styles.label}>Purpose of use</Text>
        <TextInput
          style={[styles.purposeInput, !!purposeError && styles.inputError]}
          placeholder="e.g. Group research paper preparation"
          value={purpose}
          onChangeText={(text) => {
            setPurpose(text);
            if (purposeError) setPurposeError('');
          }}
          multiline
        />
        {!!purposeError && <Text style={styles.errorText}>{purposeError}</Text>}

        {/* Confirm Button */}
        <Pressable
          style={({ pressed }) => [styles.confirmBtn, pressed && { opacity: 0.85 }]}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmBtnText}>Confirm Booking</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  spaceSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  slotChipSelected: {
    backgroundColor: '#1A1751',
    borderColor: '#1A1751',
  },
  slotChipDisabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
    opacity: 0.5,
  },
  slotChipText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  slotChipTextSelected: {
    color: '#FFFFFF',
  },
  slotChipTextDisabled: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepperBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.4,
  },
  stepperBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  maxSeatsText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 10,
  },
  purposeInput: {
    height: 70,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  confirmBtn: {
    backgroundColor: '#1A1751',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});