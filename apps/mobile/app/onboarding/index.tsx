import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components';
import { useOnboardingStore } from '@/src/stores';
import { useTheme } from '@/src/theme';

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    id: 'grade',
    icon: 'ribbon-outline',
    title: 'Food Grade, A to F',
    body: 'A single grade for how good a product is for you, based on values measured in a lab: nutrition, additives and contaminants.',
  },
  {
    id: 'accuracy',
    icon: 'checkmark-done-outline',
    title: 'Label Accuracy',
    body: 'A score from 0 to 100 showing how closely the printed label matches what the lab measured. Good grade and honest label are two different questions.',
  },
  {
    id: 'lab',
    icon: 'flask-outline',
    title: 'Every result is from a real lab test',
    body: 'We buy products from shops and send them to accredited labs. Each result shows the batch and the date it was tested.',
  },
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  const isLast = index === SLIDES.length - 1;

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const onContinue = () => {
    if (isLast) {
      router.push('/onboarding/goals');
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    setIndex(index + 1);
  };

  const onSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)/home');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg, paddingTop: insets.top }]}>
      <View style={[styles.topRow, { paddingHorizontal: theme.spacing.lg }]}>
        <Button label="Skip" variant="text" onPress={onSkip} accessibilityLabel="Skip introduction" />
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(slide) => slide.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <View
            style={[styles.slide, { width, padding: theme.spacing.xl, gap: theme.spacing.lg }]}
            accessible
            accessibilityLabel={`${item.title}. ${item.body}`}>
            <Ionicons name={item.icon} size={88} color={theme.colors.accent} />
            <Text style={[theme.type.title, styles.center, { color: theme.colors.text }]}>
              {item.title}
            </Text>
            <Text style={[theme.type.body, styles.center, { color: theme.colors.textMuted }]}>
              {item.body}
            </Text>
          </View>
        )}
      />

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: insets.bottom + theme.spacing.lg,
            gap: theme.spacing.lg,
          },
        ]}>
        <View
          style={styles.dots}
          accessible
          accessibilityLabel={`Page ${index + 1} of ${SLIDES.length}`}>
          {SLIDES.map((slide, i) => (
            <View
              key={slide.id}
              style={[
                styles.dot,
                {
                  backgroundColor: i === index ? theme.colors.accent : theme.colors.border,
                  width: i === index ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.fullWidth}>
          <Button
            label={isLast ? 'Choose your goals' : 'Continue'}
            onPress={onContinue}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topRow: { alignItems: 'flex-end' },
  slide: { alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
  footer: { alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4 },
  fullWidth: { alignSelf: 'stretch' },
});
