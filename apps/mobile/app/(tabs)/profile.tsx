import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOnboardingStore } from '@/src/stores';
import { useTheme } from '@/src/theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const resetOnboarding = useOnboardingStore((state) => state.reset);

  const rowStyle = [
    styles.row,
    {
      minHeight: theme.minTouchTarget,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.md,
    },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.bg }}
      contentContainerStyle={{
        paddingTop: insets.top + theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
        gap: theme.spacing.md,
      }}>
      <Text style={[theme.type.title, { color: theme.colors.text }]} accessibilityRole="header">
        Profile
      </Text>
      <Text style={[theme.type.body, { color: theme.colors.textMuted }]}>
        Goals, notifications and privacy settings will appear here.
      </Text>

      {__DEV__ ? (
        <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
          <Text
            style={[theme.type.heading, { color: theme.colors.text }]}
            accessibilityRole="header">
            Developer
          </Text>
          <Pressable
            onPress={() => router.push('/gallery')}
            accessibilityRole="button"
            accessibilityLabel="Open the component gallery"
            style={rowStyle}>
            <Ionicons name="grid-outline" size={20} color={theme.colors.text} />
            <Text style={[theme.type.body, styles.rowLabel, { color: theme.colors.text }]}>
              Component gallery
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </Pressable>
          <Pressable
            onPress={() => {
              resetOnboarding();
              router.replace('/onboarding');
            }}
            accessibilityRole="button"
            accessibilityLabel="Reset onboarding"
            style={rowStyle}>
            <Ionicons name="refresh-outline" size={20} color={theme.colors.text} />
            <Text style={[theme.type.body, styles.rowLabel, { color: theme.colors.text }]}>
              Reset onboarding
            </Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    flex: 1,
  },
});
