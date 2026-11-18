import React, { useState } from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { User } from '../types';

type ProfileScreenProps = {
  user: User;
  bookingsCount: number;
  favoritesCount: number;
  onLogout: () => void;
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  bookingsCount,
  favoritesCount,
  onLogout,
}) => {
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Compute initials (e.g. "Juan Dela Cruz" -> "JD")
  const initials = user.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  return (
    <View style={styles.container}>
      {/* Avatar Circle */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials || 'ST'}</Text>
      </View>

      <Text style={styles.name}>{user.fullName}</Text>
      <Text style={styles.section}>{user.section}</Text>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{bookingsCount}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{favoritesCount}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>

      {/* Settings Row: Booking reminders */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Booking reminders</Text>
        <Switch
          value={remindersEnabled}
          onValueChange={setRemindersEnabled}
          trackColor={{ false: '#D1D5DB', true: '#1A1751' }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Log Out */}
      <Pressable
        style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.85 }]}
        onPress={onLogout}
      >
        <Text style={styles.logoutBtnText}>Log Out</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  section: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1751',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 30,
  },
  settingLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  logoutBtn: {
    width: '100%',
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
});