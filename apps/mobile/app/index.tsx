import { CORE_PACKAGE_NAME } from '@truelabel/core';
import { StyleSheet, Text, View } from 'react-native';

export default function PlaceholderScreen() {
  return (
    <View style={styles.container} accessibilityRole="summary" accessibilityLabel="TrueLabel placeholder screen">
      <Text style={styles.title}>TrueLabel</Text>
      <Text style={styles.subtitle}>Phase 0 scaffold — app screens come in later phases.</Text>
      <Text style={styles.subtitle}>{CORE_PACKAGE_NAME} resolved via Metro</Text>
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
    color: '#5B6470',
  },
});
