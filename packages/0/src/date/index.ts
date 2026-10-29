/**
 * @module date
 *
 * @remarks
 * Date adapters. `PlainDateAdapter` stores a JavaScript `Date` — import it
 * from `@vuetify/v0`. `V0DateAdapter` stores a Temporal date and loads its
 * polyfill, so import that class from this entry. Importing
 * `PlainDateAdapter` from this entry evaluates the polyfill module too.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createDatePlugin } from '@vuetify/v0'
 * import { V0DateAdapter } from '@vuetify/v0/date'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 *
 * app.use(createDatePlugin({ adapter: new V0DateAdapter() }))
 * ```
 */

export { PlainDateAdapter } from '#v0/composables/useDate/adapters/plain'
export { V0DateAdapter } from '#v0/composables/useDate/adapters/v0'
export type { V0DateAdapterOptions } from '#v0/composables/useDate/adapters/v0'
