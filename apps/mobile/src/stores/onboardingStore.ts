import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** DESIGN.md §5 screen 2 — optional dietary goals. */
export const GOAL_OPTIONS = [
  { id: 'high_protein', label: 'High protein' },
  { id: 'low_sugar', label: 'Low sugar' },
  { id: 'low_sodium', label: 'Low sodium' },
  { id: 'additive_free', label: 'Additive-free' },
  { id: 'kid_safe', label: 'Kid-safe' },
] as const;

export type GoalId = (typeof GOAL_OPTIONS)[number]['id'];

interface OnboardingState {
  hasOnboarded: boolean;
  goals: GoalId[];
  completeOnboarding: (goals?: GoalId[]) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      goals: [],
      completeOnboarding: (goals = []) => set({ hasOnboarded: true, goals }),
      reset: () => set({ hasOnboarded: false, goals: [] }),
    }),
    {
      name: 'truelabel.onboarding',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ hasOnboarded: state.hasOnboarded, goals: state.goals }),
    },
  ),
);

/** True once the persisted state has been read from AsyncStorage. */
export function useOnboardingHydrated(): boolean {
  // useSyncExternalStore re-reads the snapshot after subscribing, so hydration that
  // finishes between the first render and the subscription is not missed.
  return useSyncExternalStore(
    (onChange) => useOnboardingStore.persist.onFinishHydration(onChange),
    () => useOnboardingStore.persist.hasHydrated(),
    () => false,
  );
}
