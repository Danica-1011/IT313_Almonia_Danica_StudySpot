import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudySpace } from '../types';
import { OccupancyBar } from './OccupancyBar';

type SpaceCardProps = {
  space: StudySpace;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onPress: () => void;
  cardWidth?: string | number;
};

export const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  isFavorite,
  onToggleFavorite,
  onPress,
  cardWidth = '100%',
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth as any },
        pressed && styles.pressedCard,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{space.name}</Text>
          <Text style={styles.subtitle}>
            {space.floor} · {space.type} · {space.seats} seats
          </Text>
        </View>
        <Pressable
          hitSlop={8}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite(space.id);
          }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? '#DC2626' : '#9CA3AF'}
          />
        </Pressable>
      </View>

      <OccupancyBar occupied={space.occupied} seats={space.seats} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
    }),
  },
  pressedCard: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});