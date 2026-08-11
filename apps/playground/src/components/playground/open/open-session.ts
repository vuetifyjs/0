/**
 * Short-lived memory for the Open example dialog across close/reopen.
 * Survives unmount (dialog is v-if'd) for TTL_MS, then resets to defaults.
 */

// Local
// Types
import type { OpenRail } from './types'

const TTL_MS = 2 * 60 * 1000

const RAILS: OpenRail[] = ['components', 'composables', 'plugins', 'vuetify', 'saved']

export interface OpenSessionState {
  rail: OpenRail
  /** Main list pane scroll (gallery / examples / saved). */
  scrollTop: number
  query: string
}

interface OpenSession extends OpenSessionState {
  expiresAt: number
}

let session: OpenSession | null = null

function isRail (value: string): value is OpenRail {
  return (RAILS as string[]).includes(value)
}

/** Read session if still within the 2-minute window; otherwise clear and return null. */
export function readOpenSession (): OpenSessionState | null {
  if (!session) return null
  if (Date.now() > session.expiresAt) {
    session = null
    return null
  }
  return {
    rail: session.rail,
    scrollTop: session.scrollTop,
    query: session.query,
  }
}

/** Persist rail / scroll / filter and refresh the TTL. */
export function writeOpenSession (state: OpenSessionState) {
  session = {
    rail: isRail(state.rail) ? state.rail : 'components',
    scrollTop: Math.max(0, state.scrollTop || 0),
    query: state.query ?? '',
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
