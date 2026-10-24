import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/src/theme';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'text';
  accessibilityLabel?: string;
}

export function Button({ label, onPress, variant = 'primary', accessibilityLabel }: ButtonProps) {
  const theme = useTheme();
  const primary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={[
        styles.base,
        {
          minHeight: theme.minTouchTarget,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.radius.md,
          backgroundColor: primary ? theme.colors.accent : 'transparent',
        },
      ]}>
      <Text
        style={[
          styles.label,
          { color: primary ? theme.colors.accentOn : theme.colors.accent },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
