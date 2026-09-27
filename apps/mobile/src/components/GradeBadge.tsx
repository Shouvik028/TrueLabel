import { GRADE_WORDS, type Grade } from '@truelabel/core';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme';

export type GradeBadgeSize = 'sm' | 'md' | 'lg';

const SIZES: Record<GradeBadgeSize, { box: number; font: number }> = {
  sm: { box: 28, font: 15 },
  md: { box: 44, font: 20 },
  lg: { box: 72, font: 34 },
};

export interface GradeBadgeProps {
  grade: Grade;
  size?: GradeBadgeSize;
  /** Show the grade word ("Excellent", "Poor", …) below the badge. */
  showWord?: boolean;
}

export function GradeBadge({ grade, size = 'md', showWord = false }: GradeBadgeProps) {
  const theme = useTheme();
  const { fill, textOnFill } = theme.gradeColor(grade);
  const { box, font } = SIZES[size];
  const word = GRADE_WORDS[grade];

  return (
    <View
      style={styles.container}
      accessibilityRole="text"
      accessibilityLabel={`Food grade ${grade}, ${word}`}>
      <View
        style={[
          styles.badge,
          {
            width: box,
            height: box,
            borderRadius: theme.radius.sm,
            backgroundColor: fill,
          },
        ]}>
        <Text style={[styles.letter, { fontSize: font, color: textOnFill }]}>{grade}</Text>
      </View>
      {showWord ? (
        <Text style={[styles.word, { fontSize: theme.type.caption.fontSize, color: theme.colors.text }]}>
          {word}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontWeight: '700',
  },
  word: {
    fontWeight: '600',
  },
});
