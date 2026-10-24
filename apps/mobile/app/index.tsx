import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useOnboardingHydrated, useOnboardingStore } from '@/src/stores';

/**
 * Entry gate. Renders nothing (splash still visible) until the persisted onboarding
 * state has loaded, then redirects once — so a returning user never sees onboarding.
 */
export default function Index() {
  const hydrated = useOnboardingHydrated();
  const hasOnboarded = useOnboardingStore((state) => state.hasOnboarded);

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated]);

  if (!hydrated) {
    return null;
  }

  return <Redirect href={hasOnboarded ? '/(tabs)/home' : '/onboarding'} />;
}
