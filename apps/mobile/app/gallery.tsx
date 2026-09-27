import { ACCURACY_BAND_WORDS, GRADES, type AccuracyBand, type Grade } from '@truelabel/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AccuracyMeter,
  EmptyState,
  FreshnessTag,
  GradeBadge,
  PremiumLock,
  ProductCard,
  Skeleton,
} from '@/src/components';
import { SafetyPill, type SafetyDisplayStatus } from '@/src/components/SafetyPill';
import { ALL_MOCK_PRODUCTS } from '@/src/data';
import { useTheme } from '@/src/theme';

const SAFETY_STATUSES: SafetyDisplayStatus[] = ['safe', 'caution', 'unsafe', 'not_assessed'];
const ACCURACY_SAMPLES: { band: AccuracyBand; score: number | null }[] = [
  { band: 'accurate', score: 95 },
  { band: 'minor_gaps', score: 80 },
  { band: 'misleading', score: 60 },
  { band: 'inaccurate', score: 30 },
  { band: 'insufficient_data', score: null },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.md }}>
      <Text
        accessibilityRole="header"
        style={[styles.sectionTitle, { color: theme.colors.text, fontSize: theme.type.title.fontSize }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function GalleryScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.bg }}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg, gap: theme.spacing.xl }]}>
      <Section title={`Mock products (${ALL_MOCK_PRODUCTS.length})`}>
        <View style={{ gap: theme.spacing.md }}>
          {ALL_MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              brandName={product.brandName}
              productName={product.name}
              variant={product.variant}
              grade={product.grade}
              accuracyScore={product.labelAccuracy}
              safetyStatus={product.safety}
            />
          ))}
        </View>
      </Section>

      <Section title="GradeBadge — every grade">
        <View style={[styles.row, { gap: theme.spacing.lg }]}>
          {GRADES.map((grade: Grade) => (
            <GradeBadge key={grade} grade={grade} size="lg" showWord />
          ))}
        </View>
      </Section>

      <Section title="AccuracyMeter — every band">
        <View style={{ gap: theme.spacing.md }}>
          {ACCURACY_SAMPLES.map((sample) => (
            <View key={sample.band}>
              <Text style={{ color: theme.colors.textMuted, fontSize: theme.type.caption.fontSize }}>
                {ACCURACY_BAND_WORDS[sample.band]}
              </Text>
              <AccuracyMeter score={sample.score} band={sample.band} />
            </View>
          ))}
        </View>
      </Section>

      <Section title="SafetyPill — every status">
        <View style={[styles.row, { gap: theme.spacing.md }]}>
          {SAFETY_STATUSES.map((status) => (
            <SafetyPill key={status} status={status} />
          ))}
        </View>
      </Section>

      <Section title="FreshnessTag — fresh vs stale">
        <View style={{ gap: theme.spacing.sm }}>
          <FreshnessTag testedAt="2026-08-12" isStale={false} />
          <FreshnessTag testedAt="2026-01-10" isStale />
        </View>
      </Section>

      <Section title="ProductCard">
        <View style={{ gap: theme.spacing.md }}>
          <ProductCard
            brandName="Demo Nutrition Co."
            productName="Whey Isolate Chocolate"
            variant="1 kg"
            grade="A"
            accuracyScore={92}
            safetyStatus="safe"
          />
          <ProductCard
            brandName="Sample Foods Pvt Ltd"
            productName="Peanut Protein Bar"
            variant="12 pack"
            grade="D"
            accuracyScore={55}
            safetyStatus="caution"
          />
          <ProductCard
            brandName="Demo Nutrition Co."
            productName="Mass Gainer Vanilla"
            variant={null}
            grade="F"
            accuracyScore={null}
            safetyStatus="unsafe"
          />
        </View>
      </Section>

      <Section title="EmptyState">
        <EmptyState
          icon="search"
          title="No results"
          message="We couldn't find that product. You can request it be tested."
          actionLabel="Request testing"
          onAction={() => {}}
        />
      </Section>

      <Section title="Skeleton">
        <View style={{ gap: theme.spacing.sm }}>
          <Skeleton height={20} width="60%" />
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="80%" />
        </View>
      </Section>

      <Section title="PremiumLock — locked vs unlocked">
        <View style={{ gap: theme.spacing.md }}>
          <PremiumLock onUnlock={() => {}}>
            <View
              style={[
                styles.previewBlock,
                { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md },
              ]}>
              <Text style={{ color: theme.colors.text }}>Contaminant results, score history…</Text>
            </View>
          </PremiumLock>
          <View
            style={[
              styles.previewBlock,
              { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md },
            ]}>
            <Text style={{ color: theme.colors.text }}>Unlocked: same content, no lock overlay</Text>
          </View>
        </View>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 48,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontWeight: '700',
  },
  previewBlock: {
    height: 100,
    padding: 16,
    justifyContent: 'center',
  },
});
