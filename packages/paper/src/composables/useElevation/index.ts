import { getCurrentInstanceName } from '#paper/utils/getCurrentInstanceName'
import { inject, provide, toRef, type InjectionKey } from 'vue'

export interface ElevationConfig {
  [key: string]: number | 'none'
}

export interface ElevationOptions {
  levels?: Record<string, number | 'none'>
  generator?: (level: number | string | 'none') => string
}

export const V0_ELEVATION_KEY: InjectionKey<{ config: ElevationConfig, generator?: ElevationOptions['generator'] }> = Symbol('v0:elevation')

export interface ElevationProps {
  elevation?: number | string | 'none'
}

export function createElevation (options: ElevationOptions = {}) {
  const { levels = {}, generator } = options
  provide(V0_ELEVATION_KEY, { config: levels, generator })
}

export function useElevation (
  props: ElevationProps,
  name = getCurrentInstanceName(),
) {
  const injection = inject(V0_ELEVATION_KEY, null)

  const elevationStyles = toRef(() => {
    const injected = injection?.config?.[props.elevation!]
    const elevation = injected ?? props.elevation

    if (elevation == null) {
      return {}
    }

    const generator = injection?.generator ?? defaultElevationGenerator

    return {
      [`--v0-${name}-elevation`]: generator(elevation),
    }
  })

  return {
    elevationStyles,
  }
}

export function defaultElevationGenerator (_level: number | string | 'none') {
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
