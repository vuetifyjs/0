import { describe, expect, it } from 'vitest'

import { normalizeBlog } from './normalizeBlog'

const FULL = {
  title: 'August 2026 Update',
  image: 'https://cdn.vuetifyjs.com/docs/images/blog/august-2026-update/august-hero.png',
  shortDescription: 'A monthly update.',
  date: 'September 14, 2026',
  author: 'Jacek Czarniecki',
  avatar: 'https://cdn.vuetifyjs.com/docs/images/team/j-sek.png',
  to: '/blog/august-2026-update',
}

describe('normalizeBlog', () => {
  it('should map a full row to excerpt, slug, absolute url, and image', () => {
    expect(normalizeBlog([FULL])).toEqual([{
      title: 'August 2026 Update',
      excerpt: 'A monthly update.',
      date: 'September 14, 2026',
      author: 'Jacek Czarniecki',
      avatar: 'https://cdn.vuetifyjs.com/docs/images/team/j-sek.png',
      image: 'https://cdn.vuetifyjs.com/docs/images/blog/august-2026-update/august-hero.png',
      slug: 'august-2026-update',
      url: 'https://vuetifyjs.com/blog/august-2026-update/',
    }])
  })

  it('should map a missing image to null', () => {
    const { image: _image, ...row } = FULL

    expect(normalizeBlog([row])[0]?.image).toBeNull()
  })

  it('should drop a non-slug path and keep a dotted slug', () => {
    const posts = normalizeBlog([
      { ...FULL, to: '/en/blog/august-2026-update' },
      { ...FULL, title: 'Announcing Vuetify v4.3', to: '/blog/announcing-vuetify-4.3' },
    ])

    expect(posts.map(post => post.slug)).toEqual(['announcing-vuetify-4.3'])
    expect(posts[0]?.url).toBe('https://vuetifyjs.com/blog/announcing-vuetify-4.3/')
  })

  it('should drop a row missing author', () => {
    const { author: _author, ...row } = FULL

    expect(normalizeBlog([row])).toEqual([])
  })

  it('should return an empty list for a non-array', () => {
    expect(normalizeBlog(null)).toEqual([])
    expect(normalizeBlog({ posts: [FULL] })).toEqual([])
    expect(normalizeBlog('nope')).toEqual([])
  })

  it('should keep file order and remove a bad row', () => {
    const posts = normalizeBlog([
      { ...FULL, title: 'First', to: '/blog/first' },
      { ...FULL, author: '' },
      { ...FULL, title: 'Third', to: '/blog/third' },
    ])

    expect(posts.map(post => post.title)).toEqual(['First', 'Third'])
  })
})
