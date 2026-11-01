import { PlaceholderScreen } from '@/src/components';

// Placeholder only. The camera arrives in feat/barcode-scanner and must be active
// only while this tab is focused (see DECISIONS.md #18).
export default function ScanScreen() {
  return (
    <PlaceholderScreen
      icon="barcode-outline"
      title="Scan"
      message="Barcode scanning will be available here soon."
    />
  );
}
