import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ParkingSpot {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  level?: string;
  spotNumber?: string;
  notes?: string;
  imageUri?: string;
  dateParked: string;
  meterExpiry?: string; // For timer feature
  isActive: boolean;
}

interface ParkSpotState {
  currentSpot: ParkingSpot | null;
  history: ParkingSpot[];
  isPremium: boolean;
  onboardingComplete: boolean;
  
  // Actions
  saveSpot: (spot: ParkingSpot) => void;
  clearSpot: () => void;
  setMeterExpiry: (expiry: string) => void;
  setPremium: (value: boolean) => void;
  completeOnboarding: () => void;
  loadFromStorage: () => Promise<void>;
  persist: () => Promise<void>;
}

export const useParkSpotStore = create<ParkSpotState>((set, get) => ({
  currentSpot: null,
  history: [],
  isPremium: false,
  onboardingComplete: false,

  saveSpot: (spot) => {
    set({ currentSpot: spot });
    // Also add to history if not already there
    const state = get();
    const existingIndex = state.history.findIndex(s => s.id === spot.id);
    if (existingIndex === -1) {
      set({ history: [spot, ...state.history].slice(0, 50) });
    }
    get().persist();
  },

  clearSpot: () => {
    const state = get();
    if (state.currentSpot) {
      // Move current spot to history
      const archivedSpot = { ...state.currentSpot, isActive: false };
      set({ 
        currentSpot: null,
        history: [archivedSpot, ...state.history].slice(0, 50)
      });
    }
    get().persist();
  },

  setMeterExpiry: (expiry) => {
    const state = get();
    if (state.currentSpot) {
      const updated = { ...state.currentSpot, meterExpiry: expiry };
      set({ currentSpot: updated });
      get().persist();
    }
  },

  setPremium: (value) => {
    set({ isPremium: value });
    get().persist();
  },

  completeOnboarding: () => {
    set({ onboardingComplete: true });
    get().persist();
  },

  loadFromStorage: async () => {
    try {
      const [spotData, historyData, premiumData, onboardingData] = await Promise.all([
        AsyncStorage.getItem('parkspot_current'),
        AsyncStorage.getItem('parkspot_history'),
        AsyncStorage.getItem('parkspot_premium'),
        AsyncStorage.getItem('parkspot_onboarding'),
      ]);
      
      set({
        currentSpot: spotData ? JSON.parse(spotData) : null,
        history: historyData ? JSON.parse(historyData) : [],
        isPremium: premiumData === 'true',
        onboardingComplete: onboardingData === 'true',
      });
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  },

  persist: async () => {
    const state = get();
    try {
      await Promise.all([
        state.currentSpot ? AsyncStorage.setItem('parkspot_current', JSON.stringify(state.currentSpot)) : AsyncStorage.removeItem('parkspot_current'),
        AsyncStorage.setItem('parkspot_history', JSON.stringify(state.history)),
        AsyncStorage.setItem('parkspot_premium', String(state.isPremium)),
        AsyncStorage.setItem('parkspot_onboarding', String(state.onboardingComplete)),
      ]);
    } catch (error) {
      console.error('Failed to persist:', error);
    }
  },
}));
