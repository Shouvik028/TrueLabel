import type { Grade } from '@truelabel/core';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme';

import { GradeBadge } from './GradeBadge';
import { SafetyPill, type SafetyDisplayStatus } from './SafetyPill';

export interface ProductCardProps {
  brandName: string;
  productName: string;
  variant?: string | null;
  grade: Grade;
  /** 0–100, or null when there isn't enough data for a Label Accuracy Score. */
  accuracyScore: number | null;
  safetyStatus: SafetyDisplayStatus;
  onPress?: () => void;
}

export function ProductCard({
  brandName,
  productName,
  variant,
  grade,
  accuracyScore,
  safetyStatus,
  onPress,
}: ProductCardProps) {
  const theme = useTheme();
  const initials = productName
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const subtitle = variant ? `${brandName} · ${variant}` : brandName;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${productName}, ${brandName}${variant ? `, ${variant}` : ''}, grade ${grade}`}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          gap: theme.spacing.md,
          minHeight: theme.minTouchTarget,
        },
      ]}>
      <View
        style={[
          styles.thumbnail,
          { backgroundColor: theme.colors.accent, borderRadius: theme.radius.sm },
        ]}>
        <Text style={[styles.thumbnailText, { color: theme.colors.accentOn }]}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={[styles.name, { color: theme.colors.text, fontSize: theme.type.heading.fontSize }]}>
          {productName}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            styles.subtitle,
            { color: theme.colors.textMuted, fontSize: theme.type.caption.fontSize },
          ]}>
          {subtitle}
        </Text>
      </View>
      <View style={[styles.verdicts, { gap: theme.spacing.sm }]}>
        <GradeBadge grade={grade} size="sm" />
        <Text style={[styles.accuracy, { color: theme.colors.textMuted }]}>
          {accuracyScore === null ? '—' : Math.round(accuracyScore)}
        </Text>
        <SafetyPill status={safetyStatus} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailText: {
    fontWeight: '700',
    fontSize: 15,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontWeight: '600',
  },
  subtitle: {},
  verdicts: {
    alignItems: 'flex-end',
  },
  accuracy: {
    fontWeight: '600',
    fontSize: 13,
  },
});
