export type { FeaturesAdapterInterface, FeaturesAdapterFlags, FeaturesAdapterValue } from './adapter'
export { FeaturesAdapter } from './adapter'

// Adapters
export type { PostHogClient, PostHogFeaturesAdapterOptions } from './posthog'
export { PostHogFeaturesAdapter } from './posthog'

export type { LaunchDarklyClient, LaunchDarklyFeaturesAdapterOptions } from './launchdarkly'
export { LaunchDarklyFeaturesAdapter } from './launchdarkly'
