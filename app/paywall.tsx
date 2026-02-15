import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../src/theme';
import { useSubscription } from '../src/services/purchases';

const FEATURES = [
  { icon: '📍', title: 'Unlimited History', desc: 'Save as many parking spots as you want' },
  { icon: '📸', title: 'Photo Attachments', desc: 'Snap photos of your parking location' },
  { icon: '🔔', title: 'Smart Reminders', desc: 'Meter expiration notifications' },
  { icon: '🗺️', title: 'Multiple Spots', desc: 'Save parking for car, bike, and more' },
  { icon: '🌟', title: 'Priority Support', desc: 'Get help when you need it' },
];

export default function PaywallScreen() {
  const router = useRouter();
  const { isPro } = useSubscription();

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Coming Soon', 'Subscription will be available in production.');
  };

  const handleRestore = () => {
    Alert.alert('Restore', 'No previous purchases found.');
  };

  if (isPro) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.alreadyContainer}>
          <Text style={styles.alreadyIcon}>✨</Text>
          <Text style={styles.alreadyTitle}>You're Premium!</Text>
          <Text style={styles.alreadySubtitle}>
            Thank you for supporting ParkSpot. Enjoy unlimited parking!
          </Text>
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => router.back()}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <Text style={styles.heroIcon}>🚗</Text>
          <Text style={styles.heroTitle}>ParkSpot Premium</Text>
          <Text style={styles.heroSubtitle}>
            Never lose your car again
          </Text>
        </View>

        <View style={styles.featuresList}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pricingSection}>
          <TouchableOpacity 
            style={[styles.planCard, styles.popularPlan]}
            onPress={() => handleSubscribe('yearly')}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>BEST VALUE</Text>
            </View>
            <Text style={styles.planName}>Annual</Text>
            <Text style={styles.planPrice}>$14.99</Text>
            <Text style={styles.planPeriod}>per year</Text>
            <Text style={styles.savingsBadge}>Save 50%</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.planCard}
            onPress={() => handleSubscribe('monthly')}
          >
            <Text style={styles.planName}>Monthly</Text>
            <Text style={styles.planPrice}>$2.99</Text>
            <Text style={styles.planPeriod}>per month</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          Subscriptions automatically renew unless canceled.{'\n'}
          By subscribing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxxl,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  featuresList: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  pricingSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
  },
  popularPlan: {
    borderColor: colors.primary,
    borderWidth: 2,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
  planName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  planPrice: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  planPeriod: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  savingsBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    color: colors.success,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  restoreText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  termsText: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  alreadyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  alreadyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  alreadyTitle: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  alreadySubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
});
