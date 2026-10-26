/**
 * @module date
 *
 * @remarks
 * Date adapters. `PlainDateAdapter` stores a JavaScript `Date`.
 * `V0DateAdapter` stores a Temporal date and loads its polyfill, so import
 * that class from this entry rather than `@vuetify/v0`.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createDatePlugin } from '@vuetify/v0'
 * import { PlainDateAdapter } from '@vuetify/v0/date'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 *
 * app.use(createDatePlugin({ adapter: new PlainDateAdapter() }))
 * ```
 */

export { PlainDateAdapter } from '#v0/composables/useDate/adapters/plain'
export { V0DateAdapter } from '#v0/composables/useDate/adapters/v0'
