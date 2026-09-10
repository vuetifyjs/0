// apps/builder/src/plugins/reduced-motion/defaults.ts

// Mirrors ReducedMotionPluginOptions in packages/0/src/composables/useReducedMotion.
// `adapter` is omitted — it's a class instance, so it can only be supplied in code.
export type ReducedMotionMode = 'system' | 'always' | 'never'

export interface ReducedMotionConfig {
  mode: ReducedMotionMode
  persist: boolean
}

export const MODES: ReducedMotionMode[] = ['system', 'always', 'never']

export const MODE_HINTS: Record<ReducedMotionMode, string> = {
  system: 'Follow the OS prefers-reduced-motion setting',
  always: 'Always reduce motion, overriding the OS setting',
  never: 'Never reduce motion, overriding the OS setting',
}

export const defaultConfig: ReducedMotionConfig = {
  mode: 'system',
  persist: false,
}
