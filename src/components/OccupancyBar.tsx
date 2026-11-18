import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type OccupancyBarProps = {
  occupied: number;
  seats: number;
  showText?: boolean;
};

export const OccupancyBar: React.FC<OccupancyBarProps> = ({ occupied, seats, showText = true }) => {
  const percentage = Math.min(Math.round((occupied / seats) * 100), 100);

  let barColor = '#16A34A'; // Green < 50%
  let statusText = 'Quiet';
  if (percentage >= 80) {
    barColor = '#DC2626'; // Red > 80%
    statusText = 'Almost full';
  } else if (percentage >= 50) {
    barColor = '#D97706'; // Amber 50-80%
    statusText = 'Busy';
  }

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: barColor }]} />
      </View>
      {showText && (
        <Text style={[styles.statusText, { color: barColor }]}>
          {percentage}% · {statusText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  track: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'right',
  },
});