import { useParkSpotStore } from '../store/parkingStore';

export type SubscriptionStatus = 'active' | 'inactive';

export function useSubscription() {
  const isPro = useParkSpotStore((state) => state.isPremium);

  const status: SubscriptionStatus = isPro ? 'active' : 'inactive';

  const openPaywall = () => '/paywall';

  return { status, isPro, openPaywall };
}
