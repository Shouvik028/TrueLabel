import { describe, expect, it } from 'vitest';

import { CORE_PACKAGE_NAME } from './index';

describe('@truelabel/core', () => {
  it('exports a package name', () => {
    expect(CORE_PACKAGE_NAME).toBe('@truelabel/core');
  });
});
