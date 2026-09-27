import { CORE_PACKAGE_NAME } from '@truelabel/core';
import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Placeholder-only colours. Real theme tokens land in Phase 1 (docs/DESIGN.md).
const PLACEHOLDER_COLORS = {
  light: { bg: '#FFFFFF', text: '#111418', textMuted: '#5B6470' },
  dark: { bg: '#0F1113', text: '#F2F4F5', textMuted: '#A3ACB6' },
};

export default function PlaceholderScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = PLACEHOLDER_COLORS[colorScheme];

  return (
    <View
      style={[styles.container, { backgroundColor: colors.bg }]}
      accessibilityRole="summary"
      accessibilityLabel="TrueLabel placeholder screen">
      <Text style={[styles.title, { color: colors.text }]}>TrueLabel</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Phase 0 scaffold — app screens come in later phases.
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {CORE_PACKAGE_NAME} resolved via Metro
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
});
