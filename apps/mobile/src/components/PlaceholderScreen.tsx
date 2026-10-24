import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/theme';

import { EmptyState } from './EmptyState';

export interface PlaceholderScreenProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

/** Temporary body for tab screens that a later branch will build. */
export function PlaceholderScreen({ icon, title, message }: PlaceholderScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg, paddingTop: insets.top }]}>
      <EmptyState icon={icon} title={title} message={message} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
