import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../types';

type BookingsScreenProps = {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
};

export const BookingsScreen: React.FC<BookingsScreenProps> = ({
  bookings,
  onCancelBooking,
}) => {
  const confirmCancel = (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking for ${booking.spaceName} (${booking.slot})?`,
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => onCancelBooking(booking.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            onLongPress={() => confirmCancel(item)}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleArea}>
                <Text style={styles.spaceTitle}>{item.spaceName}</Text>
                <Text style={styles.detailsText}>
                  {item.date} · {item.slot} · {item.groupSize} {item.groupSize === 1 ? 'person' : 'people'}
                </Text>
              </View>
              <View style={styles.confirmedBadge}>
                <Text style={styles.confirmedText}>Confirmed</Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.purposeText} numberOfLines={1}>
                Purpose: {item.purpose}
              </Text>
              <Pressable
                style={styles.cancelButton}
                onPress={() => confirmCancel(item)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No active bookings</Text>
            <Text style={styles.emptySub}>
              Browse spaces in the Explore tab and reserve your slot.
            </Text>
          </View>
        }
        ListFooterComponent={
          bookings.length > 0 ? (
            <Text style={styles.footerHint}>Long-press any booking to cancel it.</Text>
          ) : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleArea: {
    flex: 1,
    marginRight: 8,
  },
  spaceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  detailsText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  confirmedBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confirmedText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  purposeText: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  footerHint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 12,
  },
});