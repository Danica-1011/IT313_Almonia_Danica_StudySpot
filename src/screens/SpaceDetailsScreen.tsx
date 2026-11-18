import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SpaceDetailsScreenProps } from '../types/navigation';
import { StudySpace } from '../types';
import { OccupancyBar } from '../components/OccupancyBar';

type Props = SpaceDetailsScreenProps & {
  spaces: StudySpace[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
};

export const SpaceDetailsScreen: React.FC<Props> = ({
  route,
  navigation,
  spaces,
  favorites,
  onToggleFavorite,
}) => {
  const { spaceId } = route.params;
  const space = spaces.find((s) => s.id === spaceId);
  const isFavorite = favorites.includes(spaceId);

  // Set favorite button in the header dynamically
  useLayoutEffect(() => {
    navigation.setOptions({
      title: space ? space.name : 'Space Details',
      headerRight: () => (
        <Pressable hitSlop={10} onPress={() => onToggleFavorite(spaceId)}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#DC2626' : '#FFFFFF'}
          />
        </Pressable>
      ),
    });
  }, [navigation, space, spaceId, isFavorite, onToggleFavorite]);

  if (!space) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="#DC2626" />
        <Text style={styles.notFoundText}>Space not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Placeholder image box matching wireframe */}
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={48} color="#9CA3AF" />
        </View>

        <Text style={styles.title}>{space.name}</Text>
        <Text style={styles.location}>
          {space.building} · {space.floor} · {space.seats} seats
        </Text>

        {/* Amenity Chips */}
        <View style={styles.amenitiesRow}>
          {space.amenities.map((amenity) => (
            <View key={amenity} style={styles.amenityBadge}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>

        {/* Live Occupancy */}
        <Text style={styles.sectionTitle}>Live occupancy</Text>
        <OccupancyBar occupied={space.occupied} seats={space.seats} />
        <Text style={styles.occupancySub}>
          {space.occupied} of {space.seats} seats taken ·{' '}
          {Math.round((space.occupied / space.seats) * 100)}%
        </Text>

        {/* Available slots */}
        <Text style={styles.sectionTitle}>Available slots today</Text>
        <View style={styles.slotsGrid}>
          {space.slots.map((slot) => {
            const isBooked = space.bookedSlots.includes(slot);
            return (
              <View
                key={slot}
                style={[styles.slotItem, isBooked && styles.slotItemBooked]}
              >
                <Text style={[styles.slotText, isBooked && styles.slotTextBooked]}>
                  {slot}
                </Text>
                {isBooked && <Text style={styles.bookedTag}>Taken</Text>}
              </View>
            );
          })}
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{space.description}</Text>
      </ScrollView>

      {/* Fixed Bottom Booking Button */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [styles.bookButton, pressed && { opacity: 0.9 }]}
          onPress={() => navigation.navigate('BookingModal', { spaceId })}
        >
          <Text style={styles.bookButtonText}>Book This Space</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  imagePlaceholder: {
    height: 160,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 12,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  amenityBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  amenityText: {
    fontSize: 12,
    color: '#1A1751',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 14,
    marginBottom: 8,
  },
  occupancySub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  slotItemBooked: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  slotText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  slotTextBooked: {
    color: '#991B1B',
    textDecorationLine: 'line-through',
  },
  bookedTag: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  bookButton: {
    backgroundColor: '#1A1751',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});