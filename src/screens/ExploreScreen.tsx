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
import { SafeAreaView } from 'react-native-safe-area-context';
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
  
  // F11: Responsive width check
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

  useFocusEffect(
    useCallback(() => {
      updateTimestamp();
    }, [updateTimestamp])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      updateTimestamp();
      setRefreshing(false);
    }, 800);
  };

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

  // Group into SectionList sections (chunk into rows of 2 on wide screens)
  const sections = useMemo(() => {
    const buildings = Array.from(new Set(filteredSpaces.map((s) => s.building)));
    return buildings.map((building) => {
      const buildingSpaces = filteredSpaces.filter((s) => s.building === building);

      if (isWideScreen) {
        const rows: StudySpace[][] = [];
        for (let i = 0; i < buildingSpaces.length; i += 2) {
          rows.push(buildingSpaces.slice(i, i + 2));
        }
        return { title: building, data: rows as any };
      }

      return { title: building, data: buildingSpaces as any };
    });
  }, [filteredSpaces, isWideScreen]);

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
    // SafeAreaView with edges={['left', 'right']} prevents phone navigation bar overlap!
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, isWideScreen && styles.searchContainerWide]}>
        <Ionicons name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isWideScreen && styles.searchInputWide]}
          placeholder="Search spaces or buildings..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Filter Chips */}
      <View style={[styles.filtersWrapper, isWideScreen && { marginBottom: 2 }]}>
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

      {/* SectionList */}
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => (Array.isArray(item) ? `row-${index}` : item.id)}
        contentContainerStyle={[styles.listContent, isWideScreen && styles.listContentWide]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, isWideScreen && styles.sectionHeaderWide]}>
            {title.toUpperCase()}
          </Text>
        )}
        renderItem={({ item }) => {
          if (isWideScreen && Array.isArray(item)) {
            return (
              <View style={styles.wideRow}>
                {item.map((space: StudySpace) => (
                  <View key={space.id} style={styles.wideCardWrapper}>
                    <SpaceCard
                      space={space}
                      isFavorite={favorites.includes(space.id)}
                      onToggleFavorite={onToggleFavorite}
                      onPress={() => handleOpenSpace(space.id)}
                    />
                  </View>
                ))}
                {item.length === 1 && <View style={styles.wideCardWrapper} />}
              </View>
            );
          }

          return (
            <SpaceCard
              space={item as StudySpace}
              isFavorite={favorites.includes((item as StudySpace).id)}
              onToggleFavorite={onToggleFavorite}
              onPress={() => handleOpenSpace((item as StudySpace).id)}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={36} color="#9CA3AF" />
            <Text style={styles.emptyText}>No spaces match your search.</Text>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.refreshText}>
            Last refreshed {lastRefreshed || 'just now'} · pull down to refresh
          </Text>
        }
      />
    </SafeAreaView>
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
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchContainerWide: {
    marginTop: 6,
    marginBottom: 4,
    marginHorizontal: 16,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#111827',
  },
  searchInputWide: {
    height: 34,
    fontSize: 13,
  },
  filtersWrapper: {
    marginBottom: 4,
  },
  filtersList: {
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  listContentWide: {
    paddingHorizontal: 16,
    paddingBottom: 70, // extra padding so you can scroll past the bottom tabs
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 6,
  },
  sectionHeaderWide: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 11,
  },
  wideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 4,
  },
  wideCardWrapper: {
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  refreshText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 12,
  },
});