import type { InjectionKey } from 'vue'

export interface ElevationConfig {
  [key: string]: number | 'none'
}

export const V0_ELEVATION_KEY: InjectionKey<ElevationConfig> = Symbol('v0:elevation')

export interface ElevationProps {
  elevation?: number | string | 'none'
}

export function createElevation (config: ElevationConfig = {}) {
  provide(V0_ELEVATION_KEY, config)
}

export function useElevation (
  props: ElevationProps,
  name = getCurrentInstanceName(),
) {
  const injection = inject(V0_ELEVATION_KEY, null)

  const elevationStyles = toRef(() => {
    const injected = injection?.[props.elevation!]
    const elevation = injected ?? props.elevation

    if (elevation == null) {
      return {}
    }

    return {
      [`--v0-${name}-elevation`]: elevate(elevation),
    }
  })

  return {
    elevationStyles,
  }
}

function elevate (_level: number | string | 'none') {
  if (_level === 'none') {
    return 'none'
  }

  const level = Number(_level)

  if (Number.isNaN(level)) {
    return _level
  }

  const blur = Math.round(Math.max(1, level * 0.5))
  const spread = Math.round(Math.max(0, level * 0.1))
  const offset = Math.round(Math.max(1, level * 0.2))

  return `0px ${offset}px ${blur}px ${spread}px rgba(0, 0, 0, 0.12), 0px ${Math.max(1, offset * 0.5)}px ${blur * 2}px 0px rgba(0, 0, 0, 0.08)`
}
