import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../src/theme';
import { useParkSpotStore } from '../../src/store/parkingStore';
import { useSubscription } from '../../src/services/purchases';
import { Card } from '../../src/components/Card';

interface SettingRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  isDestructive?: boolean;
}

function SettingRow({ label, value, onPress, isSwitch, switchValue, onSwitchChange, isDestructive }: SettingRowProps) {
  const content = (
    <View style={styles.settingRow}>
      <Text style={[styles.settingLabel, isDestructive && styles.destructiveText]}>{label}</Text>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary + '80' }}
          thumbColor={switchValue ? colors.primary : colors.surface}
        />
      ) : value ? (
        <View style={styles.settingValue}>
          <Text style={styles.settingValueText}>{value}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      ) : onPress ? (
        <Text style={styles.chevron}>›</Text>
      ) : null}
    </View>
  );

  if (onPress && !isSwitch) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export default function SettingsScreen() {
  const { isPro, openPaywall } = useSubscription();
  const history = useParkSpotStore((state) => state.history);

  const handleRateApp = () => {
    Linking.openURL('https://apps.apple.com');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy');
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'This will permanently delete all your parking history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Done', 'History cleared.');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Subscription Section */}
        <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
        <Card padding="none" style={styles.section}>
          <SettingRow 
            label="Premium Status" 
            value={isPro ? 'Active' : 'Free Plan'} 
            onPress={!isPro ? openPaywall : undefined}
          />
          {!isPro && (
            <TouchableOpacity onPress={openPaywall}>
              <View style={styles.upgradeBanner}>
                <Text style={styles.upgradeTitle}>Unlock Premium</Text>
                <Text style={styles.upgradeSubtitle}>Unlimited history, multiple spots & more</Text>
              </View>
            </TouchableOpacity>
          )}
        </Card>

        {/* App Section */}
        <Text style={styles.sectionTitle}>APP</Text>
        <Card padding="none" style={styles.section}>
          <SettingRow label="Rate ParkSpot" onPress={handleRateApp} />
          <View style={styles.divider} />
          <SettingRow label="Privacy Policy" onPress={handlePrivacyPolicy} />
          <View style={styles.divider} />
          <SettingRow label="Version" value="1.0.0" />
        </Card>

        {/* Data Section */}
        <Text style={styles.sectionTitle}>DATA</Text>
        <Card padding="none" style={styles.section}>
          <SettingRow label="Clear History" onPress={handleClearHistory} isDestructive />
        </Card>

        {/* Stats */}
        <Text style={styles.sectionTitle}>STATISTICS</Text>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>Spots Saved</Text>
            </View>
          </View>
        </Card>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  sectionTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.textMuted,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  section: {
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  settingLabel: {
    fontSize: fontSize.body,
    color: colors.text,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: spacing.lg,
  },
  destructiveText: {
    color: colors.error,
  },
  upgradeBanner: {
    backgroundColor: colors.primary + '10',
    padding: spacing.lg,
    margin: spacing.md,
    borderRadius: borderRadius.md,
  },
  upgradeTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  upgradeSubtitle: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  statsCard: {
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
