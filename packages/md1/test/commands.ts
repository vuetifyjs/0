/// <reference types="@vitest/browser-playwright" />

// Types
import type { BrowserCommandContext } from 'vitest/node'

/**
 * A real mouse press: Playwright moves the pointer over the element and holds
 * the primary button down, so `:hover` and `:active` match. Synthetic pointer
 * events dispatched from the test never set `:active`.
 */
async function press (ctx: BrowserCommandContext, selector: string) {
  await ctx.iframe.locator(selector).hover()
  await ctx.page.mouse.down()
}

/** Lifts the button held by `press`; the pointer stays where it is. */
async function release (ctx: BrowserCommandContext) {
  await ctx.page.mouse.up()
}

/**
 * Emulates Windows High Contrast (`forced-colors: active`); `false` restores
 * the default. Unlike touch emulation it resets cleanly, so a test can flip it
 * and put it back.
 */
async function forcedColors (ctx: BrowserCommandContext, active: boolean) {
  await ctx.page.emulateMedia({ forcedColors: active ? 'active' : null })
}

/*
 * No pointer-type command: Chromium's `Emulation.setTouchEmulationEnabled`
 * flips the primary pointer to coarse, but disabling it restores `pointer: none`
 * rather than `fine`, so the emulation would leak into every later test in the
 * page. Handset-only rules are asserted from the stylesheet instead.
 */

export const commands = {
  forcedColors,
  press,
  release,
}

/** The browser-side signatures: vitest strips the context argument. */
export type Md1Commands = {
  [K in keyof typeof commands]: typeof commands[K] extends (ctx: BrowserCommandContext, ...args: infer A) => infer R
    ? (...args: A) => R
    : never
}
