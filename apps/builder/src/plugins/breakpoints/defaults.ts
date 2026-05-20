// apps/builder/src/plugins/breakpoints/defaults.ts

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface BreakpointsConfig {
  mobileBreakpoint: BreakpointName | number
  breakpoints: Record<BreakpointName, number>
}

export const BREAKPOINT_NAMES: BreakpointName[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

export const defaultConfig: BreakpointsConfig = {
  mobileBreakpoint: 'lg',
  breakpoints: { xs: 0, sm: 600, md: 840, lg: 1145, xl: 1545, xxl: 2138 },
}

export const PRESETS: Record<string, Record<BreakpointName, number>> = {
  Tailwind: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
  Bootstrap: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 },
  Material: { xs: 0, sm: 600, md: 840, lg: 1145, xl: 1545, xxl: 2138 },
}
