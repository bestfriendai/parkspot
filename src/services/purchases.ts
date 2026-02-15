import { useEffect, useState } from 'react';

// RevenueCat integration stub
// In production, install: npm install react-native-purchases @react-native-purchases/purchases

export const REVENUECAT_API_KEY = 'REPLACE_WITH_YOUR_API_KEY';

export type SubscriptionStatus = 'active' | 'inactive' | 'loading';

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>('loading');
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        // In production: initialize RevenueCat and check entitlements
        setStatus('inactive');
        setIsPro(false);
      } catch (error) {
        console.error('Failed to load subscription:', error);
        setStatus('inactive');
      }
    };

    loadSubscription();
  }, []);

  const openPaywall = () => {
    return '/paywall';
  };

  return { status, isPro, openPaywall };
}
