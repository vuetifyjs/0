/**
 * Canonical public docs origin. Staging (`0-dev.vuetifyjs.com`) still
 * points canonicals, JSON-LD, and llms links here so unreleased pages
 * do not compete with prod in search or LLM indexes.
 */
export const PROD_SITE_URL = 'https://0.vuetifyjs.com'

/** False on the `dev`-branch docs build (`VITE_INDEX=false`). */
export const INDEXABLE = import.meta.env.VITE_INDEX !== 'false'
