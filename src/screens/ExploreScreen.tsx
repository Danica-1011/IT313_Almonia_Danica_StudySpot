import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  SectionList,
  ScrollView,
  StyleSheet,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StudySpace } from '../types';
import { RootStackParamList } from '../types/navigation';
import { SpaceCard } from '../components/SpaceCard';
import { FilterChip } from '../components/FilterChip';
import { BestMatchBanner } from '../components/BestMatchBanner';

type ExploreScreenProps = {
  spaces: StudySpace[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
};

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  spaces,
  favorites,
  onToggleFavorite,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 600;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Quiet' | 'Group' | 'Open now' | 'Favorites'>('All');
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const updateTimestamp = useCallback(() => {
    const now = new Date();
    setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  // F6: Refresh timestamp on focus
  useFocusEffect(
    useCallback(() => {
      updateTimestamp();
    }, [updateTimestamp])
  );

  // F6: Pull-to-refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      updateTimestamp();
      setRefreshing(false);
    }, 800);
  };

  // F5: Filter spaces based on search and active chip
  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      const matchesSearch =
        space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.building.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'Quiet') return space.type === 'Quiet';
      if (activeFilter === 'Group') return space.type === 'Group';
      if (activeFilter === 'Open now') {
        const availableCount = space.slots.length - space.bookedSlots.length;
        return availableCount > 0;
      }
      if (activeFilter === 'Favorites') return favorites.includes(space.id);

      return true;
    });
  }, [spaces, searchQuery, activeFilter, favorites]);

  // Group into SectionList sections
  const sections = useMemo(() => {
    const buildings = Array.from(new Set(filteredSpaces.map((s) => s.building)));
    return buildings.map((building) => ({
      title: building,
      data: filteredSpaces.filter((s) => s.building === building),
    }));
  }, [filteredSpaces]);

  // Best Match Rule: Quiet space with lowest occupancy that still has open slots
  const bestMatchSpace = useMemo(() => {
    const candidates = spaces.filter((s) => {
      const hasOpenSlot = s.slots.some((slot) => !s.bookedSlots.includes(slot));
      return s.type === 'Quiet' && hasOpenSlot;
    });

    if (candidates.length === 0) return null;

    return candidates.reduce((prev, curr) => {
      const prevRatio = prev.occupied / prev.seats;
      const currRatio = curr.occupied / curr.seats;
      return currRatio < prevRatio ? curr : prev;
    });
  }, [spaces]);

  const handleOpenSpace = (spaceId: string) => {
    navigation.navigate('SpaceDetails', { spaceId });
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search spaces or buildings..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Filter Chips Horizontal Scroll */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersList}>
          {(['All', 'Quiet', 'Group', 'Open now', 'Favorites'] as const).map((filter) => (
            <FilterChip
              key={filter}
              label={filter === 'Favorites' ? `♥ Favs (${favorites.length})` : filter}
              selected={activeFilter === filter}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Best Match Banner */}
      <BestMatchBanner space={bestMatchSpace} onPress={handleOpenSpace} />

      {/* SectionList of Spaces */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>
        )}
        renderItem={({ item }) => (
          <SpaceCard
            space={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={onToggleFavorite}
            onPress={() => handleOpenSpace(item.id)}
            cardWidth={isWideScreen ? '48%' : '100%'}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={44} color="#9CA3AF" />
            <Text style={styles.emptyText}>No spaces match your search.</Text>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.refreshText}>
            Last refreshed {lastRefreshed || 'just now'} · pull down to refresh
          </Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 14,
    color: '#111827',
  },
  filtersWrapper: {
    marginBottom: 4,
  },
  filtersList: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 8,
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: '#6B7280',
  },
  refreshText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 16,
  },
});