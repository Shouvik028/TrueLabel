import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components';
import { GOAL_OPTIONS, useOnboardingStore, type GoalId } from '@/src/stores';
import { useTheme } from '@/src/theme';

export default function GoalsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const [selected, setSelected] = useState<GoalId[]>([]);

  const toggle = (id: GoalId) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((goal) => goal !== id) : [...current, id],
    );

  const finish = (goals: GoalId[]) => {
    completeOnboarding(goals);
    // replace, not push: the back gesture must not return to the onboarding slides.
    router.replace('/(tabs)/home');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.bg,
          paddingTop: insets.top + theme.spacing.xl,
          paddingBottom: insets.bottom + theme.spacing.lg,
          paddingHorizontal: theme.spacing.lg,
          gap: theme.spacing.lg,
        },
      ]}>
      <Text style={[theme.type.title, { color: theme.colors.text }]} accessibilityRole="header">
        What matters to you?
      </Text>
      <Text style={[theme.type.body, { color: theme.colors.textMuted }]}>
        Optional. Pick any goals that apply. You can change them later in Profile.
      </Text>

      <View style={[styles.chips, { gap: theme.spacing.sm }]}>
        {GOAL_OPTIONS.map((goal) => {
          const active = selected.includes(goal.id);
          return (
            <Pressable
              key={goal.id}
              onPress={() => toggle(goal.id)}
              accessibilityRole="checkbox"
              accessibilityLabel={goal.label}
              accessibilityState={{ checked: active }}
              style={[
                styles.chip,
                {
                  minHeight: theme.minTouchTarget,
                  paddingHorizontal: theme.spacing.lg,
                  borderRadius: theme.radius.pill,
                  borderColor: active ? theme.colors.accent : theme.colors.border,
                  backgroundColor: active ? theme.colors.accent : theme.colors.surface,
                },
              ]}>
              <Text
                style={[
                  theme.type.body,
                  { color: active ? theme.colors.accentOn : theme.colors.text },
                ]}>
                {active ? '✓ ' : ''}
                {goal.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.spacer, { gap: theme.spacing.sm }]} />

      <Button label="Done" onPress={() => finish(selected)} />
      <Button label="Skip" variant="text" onPress={() => finish([])} accessibilityLabel="Skip goals" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  spacer: { flex: 1 },
});
