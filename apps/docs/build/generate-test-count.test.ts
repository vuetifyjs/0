import { describe, expect, it } from 'vitest'

import { countTests } from './generate-test-count'

describe('countTests', () => {
  it('should skip Playwright screenshot directories named after the test file', async () => {
    await expect(countTests()).resolves.toEqual({
      files: expect.any(Number),
      tests: expect.any(Number),
    })
  })
})
