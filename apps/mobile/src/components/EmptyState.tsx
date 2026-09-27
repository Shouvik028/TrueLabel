import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme';

export interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { padding: theme.spacing.xl, gap: theme.spacing.sm }]}>
      <Ionicons name={icon} size={40} color={theme.colors.textMuted} />
      <Text
        style={[styles.title, { color: theme.colors.text, fontSize: theme.type.heading.fontSize }]}>
        {title}
      </Text>
      <Text
        style={[
          styles.message,
          { color: theme.colors.textMuted, fontSize: theme.type.body.fontSize },
        ]}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={[
            styles.action,
            {
              minHeight: theme.minTouchTarget,
              paddingHorizontal: theme.spacing.lg,
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.accent,
              marginTop: theme.spacing.sm,
            },
          ]}>
          <Text style={[styles.actionText, { color: theme.colors.accentOn }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  action: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontWeight: '600',
    fontSize: 15,
  },
});
