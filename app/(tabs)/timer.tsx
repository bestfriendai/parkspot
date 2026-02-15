import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../src/theme';
import { useParkSpotStore } from '../../src/store/parkingStore';
import { Card } from '../../src/components/Card';

export default function TimerScreen() {
  const currentSpot = useParkSpotStore((state) => state.currentSpot);
  const setMeterExpiry = useParkSpotStore((state) => state.setMeterExpiry);
  
  const [selectedHours, setSelectedHours] = useState<number | null>(null);
  const [notificationId, setNotificationId] = useState<string | null>(null);

  useEffect(() => {
    // Request notification permissions
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
    })();
  }, []);

  const handleSetTimer = async (hours: number) => {
    // Cancel existing notification if any
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }

    // Schedule new notification
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Meter Expiring!',
        body: `Your parking time is up. Time to move your car!`,
        sound: true,
      },
      trigger: {
        seconds: hours * 3600,
      },
    });

    setNotificationId(id);
    setSelectedHours(hours);
    
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + hours);
    setMeterExpiry(expiryDate.toISOString());
  };

  const handleCancelTimer = async () => {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      setNotificationId(null);
      setSelectedHours(null);
    }
  };

  const presetTimes = [
    { hours: 0.5, label: '30 min' },
    { hours: 1, label: '1 hour' },
    { hours: 2, label: '2 hours' },
    { hours: 4, label: '4 hours' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timer</Text>
        <Text style={styles.subtitle}>Set a reminder for your parking</Text>
      </View>

      <View style={styles.content}>
        {currentSpot ? (
          <>
            <Card style={styles.infoCard}>
              <Text style={styles.infoIcon}>🚗</Text>
              <Text style={styles.infoTitle}>Timer Active</Text>
              <Text style={styles.infoText}>
                Parking at: {currentSpot.address || 'Unknown location'}
              </Text>
              {selectedHours && (
                <Text style={styles.timerActive}>
                  {selectedHours}h timer set
                </Text>
              )}
            </Card>

            <Text style={styles.sectionTitle}>Set Duration</Text>
            
            <View style={styles.timerGrid}>
              {presetTimes.map((preset) => (
                <TouchableOpacity
                  key={preset.label}
                  style={[
                    styles.timerCard,
                    selectedHours === preset.hours && styles.timerCardActive,
                  ]}
                  onPress={() => handleSetTimer(preset.hours)}
                >
                  <Text style={[
                    styles.timerLabel,
                    selectedHours === preset.hours && styles.timerLabelActive,
                  ]}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedHours && (
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancelTimer}
              >
                <Text style={styles.cancelButtonText}>Cancel Timer</Text>
              </TouchableOpacity>
            )}

            <Card style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 Tips</Text>
              <Text style={styles.tip}>• Street cleaning usually varies by day</Text>
              <Text style={styles.tip}>• Meters often have different limits</Text>
              <Text style={styles.tip}>• Set a buffer time before you need to move</Text>
            </Card>
          </>
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>⏰</Text>
            <Text style={styles.emptyTitle}>No Active Parking</Text>
            <Text style={styles.emptySubtitle}>
              Save a parking spot first to set a timer
            </Text>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  infoCard: {
    alignItems: 'center',
    backgroundColor: colors.accentSecondary,
    borderColor: colors.primary,
    marginBottom: spacing.xl,
  },
  infoIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  infoTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  timerActive: {
    marginTop: spacing.sm,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.success,
  },
  sectionTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  timerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  timerCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
  },
  timerCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timerLabel: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  timerLabelActive: {
    color: '#FFFFFF',
  },
  cancelButton: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fontSize.body,
    color: colors.error,
    fontWeight: fontWeight.medium,
  },
  tipsCard: {
    marginTop: spacing.xl,
  },
  tipsTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  tip: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
