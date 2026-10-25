// Vuetify0
// Framework
import { createStorage, isArray, useLogger } from '@vuetify/v0'

// Composables
import { type BlogPost, normalizeBlog } from '@/composables/normalizeBlog'

// Constants
import { CACHE_TTL } from '@/constants/cache'

// Utilities
import { defineStore } from 'pinia'

interface State {
  posts: BlogPost[]
  isLoading: boolean
  error: string | null
}

const BLOG_URL = 'https://raw.githubusercontent.com/vuetifyjs/vuetify/master/packages/docs/src/data/blog.json'

const storage = createStorage({ prefix: 'v0-blog:', ttl: CACHE_TTL })
const logger = useLogger()

export const useBlogStore = defineStore('blog', {
  state: (): State => ({
    posts: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetch () {
      if (this.isLoading) return
      if (this.posts.length > 0) return

      const cached = storage.get<BlogPost[] | null>('index', null)
      if (isArray(cached.value) && cached.value.length > 0) {
        this.posts = cached.value
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const res = await fetch(BLOG_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const posts = normalizeBlog(await res.json())
        if (posts.length === 0) throw new Error('Empty blog')

        this.posts = posts
        storage.set('index', posts)
      } catch (error: unknown) {
        logger.error('Failed to fetch blog posts', error)
        if (this.posts.length === 0) {
          this.error = 'The Vuetify blog could not be loaded.'
        }
      } finally {
        this.isLoading = false
      }
    },
  },
})
