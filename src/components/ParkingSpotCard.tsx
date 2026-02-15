import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { ParkingSpot } from '../store/parkingStore';

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  onPress: () => void;
  isActive?: boolean;
  onNavigate?: () => void;
}

export function ParkingSpotCard({ spot, onPress, isActive, onNavigate }: ParkingSpotCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeSinceParked = () => {
    const parked = new Date(spot.dateParked);
    const now = new Date();
    const diffMs = now.getTime() - parked.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <TouchableOpacity style={[styles.card, isActive && styles.activeCard]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🚗</Text>
        {isActive && <View style={styles.activeDot} />}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.time}>{getTimeSinceParked()}</Text>
          {isActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.address} numberOfLines={1}>
          {spot.address || `${spot.latitude.toFixed(4)}, ${spot.longitude.toFixed(4)}`}
        </Text>
        
        {spot.level || spot.spotNumber && (
          <Text style={styles.details}>
            {spot.level && `Level ${spot.level}`}
            {spot.level && spot.spotNumber && ' • '}
            {spot.spotNumber && `Spot ${spot.spotNumber}`}
          </Text>
        )}
        
        <Text style={styles.date}>{formatDate(spot.dateParked)}</Text>
      </View>

      {onNavigate && (
        <TouchableOpacity style={styles.navigateButton} onPress={onNavigate}>
          <Text style={styles.navigateIcon}>→</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  activeCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.accentSecondary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    position: 'relative',
  },
  icon: {
    fontSize: 24,
  },
  activeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  time: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  activeBadge: {
    marginLeft: spacing.sm,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  address: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  details: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: colors.textMuted,
  },
  navigateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigateIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
});
