import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/src/theme';

export interface FreshnessTagProps {
  /** ISO date string of the latest published test. */
  testedAt: string;
  isStale: boolean;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function FreshnessTag({ testedAt, isStale }: FreshnessTagProps) {
  const theme = useTheme();
  const formattedDate = dateFormatter.format(new Date(testedAt));
  const label = isStale ? 'Stale — retest overdue' : `Tested ${formattedDate}`;
  const color = isStale ? theme.safetyColor('caution') : theme.colors.textMuted;

  return (
    <Text
      style={[styles.text, { color, fontSize: theme.type.caption.fontSize }]}
      accessibilityRole="text"
      accessibilityLabel={label}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '500',
  },
});
