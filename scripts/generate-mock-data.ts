import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildFixture } from './lib/buildFixture';

export const FIXTURE_PATH = fileURLToPath(
  new URL('../apps/mobile/src/data/mock/fixture.json', import.meta.url),
);

function main() {
  const fixture = buildFixture();
  writeFileSync(FIXTURE_PATH, `${JSON.stringify(fixture, null, 2)}\n`, 'utf-8');
  console.log(`Wrote ${fixture.products.length} products to ${FIXTURE_PATH}`);
}

// Only run when executed directly (`tsx scripts/generate-mock-data.ts`), not
// when the drift test imports FIXTURE_PATH from this module.
const isMain = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main();
}
