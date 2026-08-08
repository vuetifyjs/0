// apps/builder/src/plugins/tooltip/defaults.ts

// Mirrors TooltipPluginOptions in packages/0/src/composables/useTooltip. Values here are
// the composable's own documented defaults.
export interface TooltipConfig {
  openDelay: number
  closeDelay: number
  skipDelay: number
  disabled: boolean
}

export const defaultConfig: TooltipConfig = {
  openDelay: 700,
  closeDelay: 150,
  skipDelay: 300,
  disabled: false,
}
