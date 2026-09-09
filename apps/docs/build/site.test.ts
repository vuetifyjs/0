import { describe, expect, it } from 'vitest'

import { isIndexable, PREVIEW_ROBOTS_TXT, PROD_ROBOTS_TXT, robotsTxt } from './site'

describe('docs site robots', () => {
  it('should treat an unset VITE_INDEX as indexable', () => {
    expect(isIndexable({})).toBe(true)
    expect(isIndexable({ VITE_INDEX: 'true' })).toBe(true)
  })

  it('should treat VITE_INDEX=false as a preview (noindex) build', () => {
    expect(isIndexable({ VITE_INDEX: 'false' })).toBe(false)
  })

  it('should disallow all crawlers on a preview build', () => {
    expect(robotsTxt(false)).toBe(PREVIEW_ROBOTS_TXT)
    expect(robotsTxt(false)).toContain('Disallow: /')
    expect(robotsTxt(false)).not.toContain('Sitemap:')
  })

  it('should keep the prod sitemap advertisement when indexable', () => {
    expect(robotsTxt(true)).toBe(PROD_ROBOTS_TXT)
    expect(robotsTxt(true)).toContain('Sitemap: https://0.vuetifyjs.com/sitemap.xml')
  })
})
