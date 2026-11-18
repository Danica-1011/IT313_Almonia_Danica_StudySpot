import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudySpace } from '../types';

type BestMatchBannerProps = {
  space: StudySpace | null;
  onPress: (spaceId: string) => void;
};

export const BestMatchBanner: React.FC<BestMatchBannerProps> = ({ space, onPress }) => {
  if (!space) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
        <Text style={styles.emptyText}>No quiet spaces with open slots right now.</Text>
      </View>
    );
  }

  const occupancyPct = Math.round((space.occupied / space.seats) * 100);

  return (
    <Pressable
      onPress={() => onPress(space.id)}
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.9 }]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="sparkles" size={20} color="#F59E0B" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>★ Best match right now</Text>
        <Text style={styles.subtext}>
          {space.name} · {occupancyPct}% full
        </Text>
        <Text style={styles.tapAction}>Tap to open details</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  heading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  subtext: {
    fontSize: 12,
    color: '#78350F',
    marginTop: 2,
  },
  tapAction: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 8,
  },
});