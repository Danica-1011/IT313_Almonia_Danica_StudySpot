import React from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudySpace } from '../types';

type BestMatchBannerProps = {
  space: StudySpace | null;
  onPress: (spaceId: string) => void;
};

export const BestMatchBanner: React.FC<BestMatchBannerProps> = ({ space, onPress }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 600;

  if (!space) {
    return (
      <View style={[styles.container, styles.emptyContainer, isWide && styles.containerWide]}>
        <Ionicons name="information-circle-outline" size={18} color="#6B7280" />
        <Text style={styles.emptyText}>No quiet spaces with open slots right now.</Text>
      </View>
    );
  }

  const occupancyPct = Math.round((space.occupied / space.seats) * 100);

  return (
    <Pressable
      onPress={() => onPress(space.id)}
      style={({ pressed }) => [
        styles.container,
        isWide && styles.containerWide,
        pressed && { opacity: 0.9 },
      ]}
    >
      <Ionicons name="sparkles" size={18} color="#F59E0B" style={styles.icon} />
      <View style={[styles.textContainer, isWide && styles.textContainerWide]}>
        <Text style={styles.heading}>★ Best match right now: </Text>
        <Text style={styles.subtext}>
          {space.name} · {occupancyPct}% full
        </Text>
      </View>
      <Text style={styles.tapAction}>Tap to open</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerWide: {
    marginHorizontal: 12,
    marginVertical: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  emptyContainer: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  icon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  textContainerWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  subtext: {
    fontSize: 12,
    color: '#78350F',
  },
  tapAction: {
    fontSize: 11,
    color: '#B45309',
    textDecorationLine: 'underline',
    marginLeft: 6,
  },
  emptyText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 6,
  },
});