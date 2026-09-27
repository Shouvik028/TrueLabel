import { NOT_ASSESSED_WORD, SAFETY_WORDS, type SafetyStatus } from '@truelabel/core';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme';

export type SafetyDisplayStatus = SafetyStatus | 'not_assessed';

const ICONS: Record<SafetyDisplayStatus, keyof typeof Ionicons.glyphMap> = {
  safe: 'shield-checkmark',
  caution: 'alert-circle',
  unsafe: 'close-circle',
  not_assessed: 'help-circle',
};

export interface SafetyPillProps {
  status: SafetyDisplayStatus;
}

export function SafetyPill({ status }: SafetyPillProps) {
  const theme = useTheme();
  const color = status === 'not_assessed' ? theme.colors.textMuted : theme.safetyColor(status);
  const word = status === 'not_assessed' ? NOT_ASSESSED_WORD : SAFETY_WORDS[status];

  return (
    <View
      style={[
        styles.pill,
        {
          borderRadius: theme.radius.pill,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Safety status: ${word}`}>
      <Ionicons name={ICONS[status]} size={16} color={color} />
      <Text style={[styles.word, { color, fontSize: theme.type.caption.fontSize }]}>{word}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
  },
  word: {
    fontWeight: '600',
  },
});
