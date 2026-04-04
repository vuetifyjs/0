/// <reference path="./globals.d.ts" />

import { cleanup } from '@testing-library/vue'
import { afterEach, beforeAll } from 'vitest'
import { commands } from 'vitest/browser'

beforeAll(async () => {
  await commands.setFocusEmulationEnabled()
  await commands.setReduceMotionEnabled()
})

afterEach(() => {
  cleanup()
})
