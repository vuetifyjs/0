/**
 * Short-lived memory for the Open example dialog across close/reopen.
 * Survives unmount (dialog is v-if'd) for TTL_MS, then resets to defaults.
 */

// Local
// Types
import { normalizeOpenRail, type OpenKind, type OpenRail } from './types'

const TTL_MS = 2 * 60 * 1000

const RAILS: OpenRail[] = ['v0', 'vuetify', 'saved']
const KINDS: Array<OpenKind | 'all'> = ['all', 'components', 'composables', 'plugins']

export interface OpenSessionState {
  rail: OpenRail
  /** Gallery / saved list scroll (never the examples drill-in pane). */
  scrollTop: number
  /** Examples list scroll while drilled into a feature. */
  examplesScrollTop: number
  query: string
  /** Vuetify0 kind chip. */
  kind: OpenKind | 'all'
  /**
   * Feature name last opened on a gallery rail (wayfinding chip).
   * Scoped by lastFeatureRail so v0 and Vuetify names don't collide.
   */
  lastFeature?: string
  lastFeatureRail?: OpenRail
  /**
   * Feature currently drilled into (examples pane). Restored on reopen so
   * close → open does not dump the user back on the gallery.
   */
  selectedName?: string
}

interface OpenSession extends OpenSessionState {
  expiresAt: number
}

let session: OpenSession | null = null

function isRail (value: string): value is OpenRail {
  return (RAILS as string[]).includes(value)
}

function normalizeKind (value: string | undefined): OpenKind | 'all' {
  if (value && (KINDS as string[]).includes(value)) return value as OpenKind | 'all'
  return 'all'
}

/** Read session if still within the 2-minute window; otherwise clear and return null. */
export function readOpenSession (): OpenSessionState | null {
  if (!session) return null
  if (Date.now() > session.expiresAt) {
    session = null
    return null
  }
  return {
    rail: normalizeOpenRail(session.rail),
    scrollTop: session.scrollTop,
    examplesScrollTop: session.examplesScrollTop ?? 0,
    query: session.query,
    kind: normalizeKind(session.kind),
    lastFeature: session.lastFeature,
    lastFeatureRail: session.lastFeatureRail
      ? normalizeOpenRail(session.lastFeatureRail)
      : undefined,
    selectedName: session.selectedName,
  }
}

/** Persist open-dialog surface state and refresh the TTL. */
export function writeOpenSession (state: OpenSessionState) {
  const rail = normalizeOpenRail(state.rail)
  session = {
    rail: isRail(rail) ? rail : 'v0',
    scrollTop: Math.max(0, state.scrollTop || 0),
    examplesScrollTop: Math.max(0, state.examplesScrollTop || 0),
    query: state.query ?? '',
    kind: normalizeKind(state.kind),
    lastFeature: state.lastFeature,
    lastFeatureRail: state.lastFeatureRail
      ? normalizeOpenRail(state.lastFeatureRail)
      : undefined,
    selectedName: state.selectedName,
    expiresAt: Date.now() + TTL_MS,
  }
}

/** Touch expiry without changing values (e.g. while the dialog stays open). */
export function touchOpenSession () {
  if (!session) return
  if (Date.now() > session.expiresAt) {
    session = null
    return
  }
  session.expiresAt = Date.now() + TTL_MS
}
