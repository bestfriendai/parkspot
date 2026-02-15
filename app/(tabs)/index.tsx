import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Animated, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../src/theme';
import { useParkSpotStore, ParkingSpot } from '../../src/store/parkingStore';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';

export default function HomeScreen() {
  const currentSpot = useParkSpotStore((state) => state.currentSpot);
  const saveSpot = useParkSpotStore((state) => state.saveSpot);
  const clearSpot = useParkSpotStore((state) => state.clearSpot);
  
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [meterTime, setMeterTime] = useState<number>(0);
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required to save your parking spot.');
      }
    })();
  }, []);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc);
      
      // Reverse geocode to get address
      const [result] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      
      if (result) {
        const addr = [
          result.streetNumber,
          result.street,
          result.city,
          result.region,
        ].filter(Boolean).join(', ');
        setAddress(addr);
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Could not get your location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSpot = async () => {
    if (!location) {
      await getCurrentLocation();
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const spot: ParkingSpot = {
      id: Date.now().toString(),
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: address,
      dateParked: new Date().toISOString(),
      isActive: true,
    };

    saveSpot(spot);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Alert.alert('Spot Saved! 🚗', address ? `Saved at ${address}` : 'Your parking spot has been saved.');
  };

  const handleClearSpot = () => {
    Alert.alert(
      'Clear Spot',
      'Are you sure you want to clear your saved parking spot?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            clearSpot();
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setLocation(null);
            setAddress('');
            setMeterTime(0);
          }
        },
      ]
    );
  };

  const handleNavigateToCar = () => {
    if (!currentSpot) return;
    
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${currentSpot.latitude},${currentSpot.longitude}`;
    const label = 'My Car';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (!currentSpot) {
        Alert.alert('No Active Spot', 'Save a parking spot before attaching a photo.');
        return;
      }

      const imageUri = result.assets?.[0]?.uri;
      if (!imageUri) {
        Alert.alert('Error', 'Could not read the captured photo. Please try again.');
        return;
      }

      saveSpot({ ...currentSpot, imageUri });
      Alert.alert('Photo Saved', 'Photo has been attached to your parking spot.');
    }
  };

  const handleSetMeter = (hours: number) => {
    setMeterTime(hours);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + hours);
    
    // Schedule notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Meter Expiring!',
        body: `Your parking meter expires in ${hours} hour${hours > 1 ? 's' : ''}. Time to move!`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: hours * 3600,
        repeats: false,
      },
    });
  };

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const getTimeSinceParked = () => {
    if (!currentSpot) return '';
    const parked = new Date(currentSpot.dateParked);
    const now = new Date();
    const diffMs = now.getTime() - parked.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ParkSpot</Text>
        <Text style={styles.subtitle}>Never forget where you parked</Text>
      </View>

      <View style={styles.content}>
        {currentSpot ? (
          <Card style={styles.activeSpotCard}>
            <View style={styles.activeHeader}>
              <View style={styles.activeIndicator}>
                <View style={styles.pulsingDot} />
                <Text style={styles.activeText}>ACTIVE</Text>
              </View>
              <Text style={styles.timeParked}>{getTimeSinceParked()}</Text>
            </View>

            <Text style={styles.spotAddress} numberOfLines={2}>
              {currentSpot.address || `${currentSpot.latitude.toFixed(4)}, ${currentSpot.longitude.toFixed(4)}`}
            </Text>

            {currentSpot.level && (
              <Text style={styles.spotDetails}>Level: {currentSpot.level}</Text>
            )}
            {currentSpot.spotNumber && (
              <Text style={styles.spotDetails}>Spot: {currentSpot.spotNumber}</Text>
            )}

            <View style={styles.activeActions}>
              <TouchableOpacity 
                style={styles.navigateButton}
                onPress={handleNavigateToCar}
              >
                <Text style={styles.navigateButtonText}>🧭 Navigate</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.photoButton}
                onPress={handleTakePhoto}
              >
                <Text style={styles.photoButtonText}>📷 Photo</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearSpot}
            >
              <Text style={styles.clearButtonText}>Clear Spot</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🚗</Text>
            <Text style={styles.emptyTitle}>No Active Spot</Text>
            <Text style={styles.emptySubtitle}>
              Tap the button below to save your current parking location
            </Text>
          </Card>
        )}

        {/* Meter Timer */}
        {currentSpot && (
          <Card style={styles.timerCard}>
            <Text style={styles.timerTitle}>⏰ Meter Timer</Text>
            <Text style={styles.timerSubtitle}>Set a reminder when your parking expires</Text>
            
            <View style={styles.timerButtons}>
              {[1, 2, 4].map((hours) => (
                <TouchableOpacity
                  key={hours}
                  style={[
                    styles.timerOption,
                    meterTime === hours && styles.timerOptionActive,
                  ]}
                  onPress={() => handleSetMeter(hours)}
                >
                  <Text style={[
                    styles.timerOptionText,
                    meterTime === hours && styles.timerOptionTextActive,
                  ]}>
                    {hours}h
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}
      </View>

      <View style={styles.footer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Button
            title={currentSpot ? 'Update Location' : 'Save Parking Spot'}
            onPress={() => {
              animatePress();
              handleSaveSpot();
            }}
            size="large"
            style={styles.mainButton}
          />
        </Animated.View>
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
    color: colors.primary,
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
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  activeSpotCard: {
    backgroundColor: colors.accentSecondary,
    borderColor: colors.primary,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  activeText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.success,
  },
  timeParked: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  spotAddress: {
    fontSize: fontSize.body,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  spotDetails: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  activeActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  navigateButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  photoButton: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoButtonText: {
    color: colors.text,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
  },
  clearButton: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  clearButtonText: {
    color: colors.error,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
  },
  timerCard: {
    marginTop: spacing.md,
  },
  timerTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  timerSubtitle: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timerOption: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  timerOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timerOptionText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  timerOptionTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  mainButton: {
    width: '100%',
  },
});
