// Utilities
import { inject, provide, toRef } from 'vue'

// Types
import type { InjectionKey } from 'vue'

export interface ElevationConfig {
  [key: string]: string
}

export interface ElevationOptions {
  levels?: Record<string, string>
}

export const V0_ELEVATION_KEY: InjectionKey<{ config: ElevationConfig }> = Symbol('v0:elevation')

export interface ElevationProps {
  elevation?: string
}

export function createElevation (options: ElevationOptions = {}) {
  const { levels = {} } = options
  provide(V0_ELEVATION_KEY, { config: levels })
}

export function useElevation (props: ElevationProps) {
  const injection = inject(V0_ELEVATION_KEY, null)

  const elevationClasses = toRef(() => {
    const classes: string[] = []
    const level = injection?.config?.[props.elevation!] ?? props.elevation

    if (level) classes.push(`shadow-${level}`)

    return classes
  })

  return { elevationClasses }
}
