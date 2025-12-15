/**
 * @module useDate/bridge
 *
 * @remarks
 * Bridge adapters for Vuetify 3 compatibility.
 *
 * Provides a wrapper that converts v0's Temporal-based DateAdapter
 * to be compatible with Vuetify 3's internal date composable.
 */

export type { Vuetify3DateAdapter, Vuetify3DateBridgeOptions } from './vuetify3'
export { createVuetify3DateBridge } from './vuetify3'
