import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/src/theme';

const BUTTON_SIZE = 60;
const RAISE = 18;

/** Raised centre tab button (DESIGN.md §3 `ScanButton`). */
export function ScanButton({ onPress, onLongPress, accessibilityState }: BottomTabBarButtonProps) {
  const theme = useTheme();
  const focused = accessibilityState?.selected === true;

  return (
    <View style={styles.slot}>
      <PlatformPressable
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="button"
        accessibilityLabel="Scan a barcode"
        accessibilityState={{ selected: focused }}
        pressOpacity={0.85}
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.accent,
            borderColor: theme.colors.bg,
            minWidth: theme.minTouchTarget,
            minHeight: theme.minTouchTarget,
          },
        ]}>
        <Ionicons name="barcode-outline" size={30} color={theme.colors.accentOn} />
      </PlatformPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -RAISE,
  },
});
