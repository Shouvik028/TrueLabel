import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarButtonProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/src/theme';

const BUTTON_SIZE = 60;
const RAISE = 18;
const PRESSED_OPACITY = 0.85;
// Alpha suffix (~20%) appended to the on-accent colour for the Android ripple.
const RIPPLE_ALPHA = '33';

/**
 * Raised centre tab button (DESIGN.md §3 `ScanButton`).
 *
 * The slot is exactly as tall as the button and is pulled up by `RAISE`, so the
 * pressable sits fully inside its parent's bounds. Touches on the raised top edge
 * then land on the pressable instead of relying on a child overflowing its parent.
 */
export function ScanButton({ onPress, onLongPress, accessibilityState }: BottomTabBarButtonProps) {
  const theme = useTheme();
  const focused = accessibilityState?.selected === true;

  return (
    <View style={styles.slot}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="button"
        accessibilityLabel="Scan a barcode"
        accessibilityState={{ selected: focused }}
        android_ripple={{ color: `${theme.colors.accentOn}${RIPPLE_ALPHA}` }}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.colors.accent,
            borderColor: theme.colors.bg,
            minWidth: theme.minTouchTarget,
            minHeight: theme.minTouchTarget,
            opacity: pressed ? PRESSED_OPACITY : 1,
          },
        ]}>
        <Ionicons name="barcode-outline" size={30} color={theme.colors.accentOn} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    height: BUTTON_SIZE,
    marginTop: -RAISE,
    alignItems: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
