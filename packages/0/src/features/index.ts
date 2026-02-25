/**
 * @module features
 *
 * @remarks
 * Feature flag composable for @vuetify/v0.
 * Import third-party adapters from their specific subpaths:
 * - `@vuetify/v0/features/adapters/posthog`
 * - `@vuetify/v0/features/adapters/flagsmith`
 * - `@vuetify/v0/features/adapters/launchdarkly`
 *
 * @example
 * ```ts
 * import { createFeaturesPlugin, useFeatures, FeaturesAdapter } from '@vuetify/v0/features'
 * import { PostHogFeatureAdapter } from '@vuetify/v0/features/adapters/posthog'
 * ```
 */

export * from '#v0/composables/useFeatures'
