import { ACCURACY_BAND_WORDS, type AccuracyBand } from '@truelabel/core';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme';

export interface AccuracyMeterProps {
  /** 0–100, or null when there isn't enough label/lab data to score (band is then "insufficient_data"). */
  score: number | null;
  band: AccuracyBand;
}

export function AccuracyMeter({ score, band }: AccuracyMeterProps) {
  const theme = useTheme();
  const color = theme.accuracyBandColor(band);
  const word = ACCURACY_BAND_WORDS[band];
  const hasScore = score !== null;
  const clampedScore = hasScore ? Math.max(0, Math.min(100, score)) : 0;

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={hasScore ? `Label accuracy ${Math.round(score)} out of 100, ${word}` : `Label accuracy: ${word}`}
      accessibilityValue={hasScore ? { min: 0, max: 100, now: Math.round(score) } : undefined}>
      <View style={styles.header}>
        {hasScore ? (
          <Text style={[styles.number, { color: theme.colors.text }]}>{Math.round(score)}</Text>
        ) : null}
        <Text style={[styles.band, { color, fontSize: theme.type.body.fontSize }]}>{word}</Text>
      </View>
      <View
        style={[
          styles.track,
          { backgroundColor: theme.colors.border, borderRadius: theme.radius.sm },
        ]}>
        {hasScore ? (
          <View
            style={[
              styles.fill,
              { width: `${clampedScore}%`, backgroundColor: color, borderRadius: theme.radius.sm },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  number: {
    fontSize: 22,
    fontWeight: '700',
  },
  band: {
    fontWeight: '600',
  },
  track: {
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
