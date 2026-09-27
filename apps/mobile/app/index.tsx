import { CORE_PACKAGE_NAME } from '@truelabel/core';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme';

export default function PlaceholderScreen() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.bg, gap: theme.spacing.sm }]}
      accessibilityRole="summary"
      accessibilityLabel="TrueLabel placeholder screen">
      <Text style={[styles.title, { color: theme.colors.text }]}>TrueLabel</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
        Phase 0 scaffold — app screens come in later phases.
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
        {CORE_PACKAGE_NAME} resolved via Metro
      </Text>
      <Link
        href="/gallery"
        style={[styles.link, { color: theme.colors.accent }]}
        accessibilityRole="link"
        accessibilityLabel="Open the component gallery">
        Component gallery →
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  link: {
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});
