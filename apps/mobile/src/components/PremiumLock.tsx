import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme';

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface PremiumLockProps {
  /** The free-tier preview content, shown blurred and dimmed underneath the lock. */
  children: ReactNode;
  onUnlock: () => void;
  label?: string;
}

export function PremiumLock({ children, onUnlock, label = 'Unlock with Premium' }: PremiumLockProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderRadius: theme.radius.md }]}>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants">
        {children}
      </View>
      <BlurView
        intensity={35}
        tint={theme.mode === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: hexToRgba(theme.colors.bg, 0.45) }]}
      />
      <View style={[styles.content, { gap: theme.spacing.sm, padding: theme.spacing.lg }]}>
        <Ionicons name="lock-closed" size={28} color={theme.colors.premium} />
        <Pressable
          onPress={onUnlock}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={[
            styles.button,
            {
              minHeight: theme.minTouchTarget,
              paddingHorizontal: theme.spacing.lg,
              borderRadius: theme.radius.pill,
              backgroundColor: theme.colors.surfaceRaised,
              borderColor: theme.colors.premium,
            },
          ]}>
          <Text style={[styles.buttonText, { color: theme.colors.premium }]}>{label}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    flexDirection: 'row',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 15,
  },
});
