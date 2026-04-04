/// <reference types="@vitest/browser-playwright" />

import type { BrowserCommandContext } from 'vitest/node'

async function drag (ctx: BrowserCommandContext, start: [number, number], ...moves: number[][]) {
  const cdp = await ctx.provider.getCDPSession!(ctx.sessionId)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: start[0], y: start[1] }],
  })
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: start[0], y: start[1] }],
  })
  for (const move of moves) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: move[0], y: move[1] }],
    })
  }
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [{ x: moves.at(-1)[0], y: moves.at(-1)[1] }],
  })
}

async function waitStable (ctx: BrowserCommandContext, selector: string) {
  const el = ctx.iframe.locator(selector)
  const handles = await el.elementHandles()
  await Promise.all(
    handles.map(h => Promise.any([
      h.waitForElementState('stable', { timeout: 1000 }),
      h.waitForElementState('hidden', { timeout: 1000 }),
    ])),
  )
}

async function setFocusEmulationEnabled (ctx: BrowserCommandContext) {
  const cdp = await ctx.provider.getCDPSession!(ctx.sessionId)
  await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true })
}

async function setReduceMotionEnabled (ctx: BrowserCommandContext) {
  await ctx.page.emulateMedia({
    reducedMotion: 'reduce',
  })
}

export const commands = {
  drag,
  waitStable,
  setFocusEmulationEnabled,
  setReduceMotionEnabled,
}

export type CustomCommands = {
  [K in keyof typeof commands]: typeof commands[K] extends (ctx: any, ...args: infer A) => any
    ? (...args: A) => any
    : never
}
