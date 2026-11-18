import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { User, StudySpace, Booking } from './src/types';
import { RootStackParamList, TabParamList } from './src/types/navigation';
import { INITIAL_SPACES } from './src/data/spaces';

// Screens
import { LoginScreen } from './src/screens/LoginScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { SpaceDetailsScreen } from './src/screens/SpaceDetailsScreen';
import { BookingModalScreen } from './src/screens/BookingModalScreen';
import { BookingsScreen } from './src/screens/BookingsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const NAVY = '#1A1751';

export default function App() {
  // F12: All shared state lives in App
  const [user, setUser] = useState<User | null>(null);
  const [spaces, setSpaces] = useState<StudySpace[]>(INITIAL_SPACES);
  const [favorites, setFavorites] = useState<string[]>(['s2']);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Toggle Favorite Handler
  const handleToggleFavorite = (spaceId: string) => {
    setFavorites((prev) =>
      prev.includes(spaceId) ? prev.filter((id) => id !== spaceId) : [...prev, spaceId]
    );
  };

  // Add Booking Handler: Updates both bookings list and space bookedSlots
  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setSpaces((prev) =>
      prev.map((space) => {
        if (space.id === newBooking.spaceId) {
          return {
            ...space,
            bookedSlots: [...space.bookedSlots, newBooking.slot],
            occupied: Math.min(space.occupied + newBooking.groupSize, space.seats),
          };
        }
        return space;
      })
    );
  };

  // Cancel Booking Handler: Frees the slot
  const handleCancelBooking = (bookingId: string) => {
    const cancelled = bookings.find((b) => b.id === bookingId);
    if (!cancelled) return;

    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    setSpaces((prev) =>
      prev.map((space) => {
        if (space.id === cancelled.spaceId) {
          return {
            ...space,
            bookedSlots: space.bookedSlots.filter((slot) => slot !== cancelled.slot),
            occupied: Math.max(space.occupied - cancelled.groupSize, 0),
          };
        }
        return space;
      })
    );
  };

  // Bottom Tabs Navigator Component
  function MainTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: NAVY },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
          tabBarActiveTintColor: NAVY,
          tabBarInactiveTintColor: '#9CA3AF',
        }}
      >
        <Tab.Screen
          name="Explore"
          options={{
            title: 'Explore Spaces',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <ExploreScreen
              spaces={spaces}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Bookings"
          options={{
            title: 'My Bookings',
            tabBarBadge: bookings.length > 0 ? bookings.length : undefined,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <BookingsScreen
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <ProfileScreen
              user={user!}
              bookingsCount={bookings.length}
              favoritesCount={favorites.length}
              onLogout={() => setUser(null)}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: NAVY },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        {/* F2: Conditional Navigation */}
        {user === null ? (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {() => <LoginScreen onLogin={setUser} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SpaceDetails"
              options={{ title: 'Space Details' }}
            >
              {(props) => (
                <SpaceDetailsScreen
                  {...props}
                  spaces={spaces}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="BookingModal"
              options={{
                presentation: 'modal',
                title: 'Book Space',
              }}
            >
              {(props) => (
                <BookingModalScreen
                  {...props}
                  spaces={spaces}
                  onAddBooking={handleAddBooking}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}