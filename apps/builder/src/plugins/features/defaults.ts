// apps/builder/src/plugins/features/defaults.ts

export type FeaturesAdapter =
  | 'none'
  | 'FlagsmithFeaturesAdapter'
  | 'LaunchDarklyFeaturesAdapter'
  | 'PostHogFeaturesAdapter'

export interface FeaturesConfig {
  features: Record<string, boolean>
  adapter: FeaturesAdapter
}

export const FEATURES_ADAPTERS: FeaturesAdapter[] = [
  'none',
  'FlagsmithFeaturesAdapter',
  'LaunchDarklyFeaturesAdapter',
  'PostHogFeaturesAdapter',
]

export const defaultConfig: FeaturesConfig = {
  features: {},
  adapter: 'none',
}
