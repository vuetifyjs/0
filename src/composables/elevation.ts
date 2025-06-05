import { inject, provide, computed, type ComputedRef, type InjectionKey } from 'vue'

export interface ElevationConfig {
  [key: string]: number | 'none'
}

export interface ElevationComposable {
  config: ComputedRef<ElevationConfig>
  getElevation: (key?: string) => string | null
}

const VUETIFY_0_ELEVATION_DEFAULTS: ElevationConfig = {
  none: 'none',
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
  xxl: 24
}

export type ElevationKeys = keyof typeof VUETIFY_0_ELEVATION_DEFAULTS

export const VUETIFY_0_ELEVATION_KEY: InjectionKey<ElevationConfig> = Symbol('vuetify-0:elevation')

export function provideElevation(config: ElevationConfig) {
  provide(VUETIFY_0_ELEVATION_KEY, config)
}

export function useElevation(): ElevationComposable {
  const injection = inject(VUETIFY_0_ELEVATION_KEY, null)

  const config = computed(() => injection || VUETIFY_0_ELEVATION_DEFAULTS)

  function getElevation(key?: string): string | null {
    if (!key) return null

    const current = config.value
    const level = current[key]

    if (level === undefined) {
      const fallback = VUETIFY_0_ELEVATION_DEFAULTS[key]

      return (fallback === undefined) ? null : generateShadow(fallback)
    }

    return generateShadow(level)
  }

  return {
    config,
    getElevation
  }
}

function generateShadow(level: number | 'none'): string {
  if (level === 'none') return 'none'
  if (typeof level !== 'number' || level <= 0) return 'none'

  const blur = Math.max(1, level * 0.5)
  const spread = Math.max(0, level * 0.1)
  const offset = Math.max(1, level * 0.2)

  return `0px ${offset}px ${blur}px ${spread}px rgba(0, 0, 0, 0.12), 0px ${Math.max(1, offset * 0.5)}px ${blur * 2}px 0px rgba(0, 0, 0, 0.08)`
}

export { VUETIFY_0_ELEVATION_DEFAULTS }
