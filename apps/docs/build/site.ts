export const PROD_SITE_URL = 'https://0.vuetifyjs.com'

export const PROD_ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: ${PROD_SITE_URL}/sitemap.xml

# LLM context bundles — curated documentation for AI assistants.
# Index:     ${PROD_SITE_URL}/llms.txt
# Full text: ${PROD_SITE_URL}/llms-full.txt
# Agent skill: ${PROD_SITE_URL}/SKILL.md
# Every docs page also serves its source markdown at the same path + ".md"
# (e.g. ${PROD_SITE_URL}/composables/data/create-filter.md), advertised
# per-page via <link rel="alternate" type="text/markdown">.
`

export const PREVIEW_ROBOTS_TXT = `User-agent: *
Disallow: /
`

export function isIndexable (env: NodeJS.ProcessEnv = process.env): boolean {
  return env.VITE_INDEX !== 'false'
}

export function robotsTxt (indexable = isIndexable()): string {
  return indexable ? PROD_ROBOTS_TXT : PREVIEW_ROBOTS_TXT
}
