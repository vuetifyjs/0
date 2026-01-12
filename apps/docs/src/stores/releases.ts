// Vuetify0
// Framework
import { createStorage } from '@vuetify/v0'

// Utilities
import { defineStore } from 'pinia'

// Types
import type { components as octokitComponents } from '@octokit/openapi-types'

type GitHubRelease = octokitComponents['schemas']['release']

export interface Release extends GitHubRelease {
  props: {
    prependIcon: string
    title: string
  }
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

interface State {
  releases: Release[]
  isLoading: boolean
  error: string | null
  page: number
}

const url = import.meta.env.VITE_API_SERVER_URL
const CACHE_TTL = import.meta.env.DEV ? 30 * 1000 : 5 * 60 * 1000 // 30s dev, 5min prod
const storage = createStorage({ prefix: 'v0-releases:' })

function isCacheValid<T> (entry: CacheEntry<T> | null): entry is CacheEntry<T> {
  if (!entry) return false
  return Date.now() - entry.timestamp < CACHE_TTL
}

export const useReleasesStore = defineStore('releases', {
  state: (): State => ({
    releases: [],
    isLoading: false,
    error: null,
    page: 1,
  }),

  actions: {
    format (release: GitHubRelease): Release {
      return {
        ...release,
        props: {
          prependIcon: `mdi-numeric-${release.tag_name.slice(1, 2)}-box`,
          title: release.tag_name,
        },
      }
    },
    async fetch () {
      if (this.isLoading) return // Prevent concurrent requests

      // Check cache on first page load
      if (this.page === 1 && this.releases.length === 0) {
        const cached = storage.get<CacheEntry<Release[]> | null>('page-1', null)
        if (isCacheValid(cached.value)) {
          this.releases = cached.value.data
          this.page = 2
          return
        }
      }

      this.isLoading = true
      this.error = null

      let data: GitHubRelease[] = []
      try {
        const res = await fetch(`${url}/github/releases?page=${this.page}&repo=v0`, {
          method: 'GET',
          credentials: 'include',
        })
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        data = await res.json()
      } catch (error: unknown) {
        console.error(error)
        this.error = 'Failed to load releases. Please try again.'
        this.isLoading = false
        return
      }

      const formatted: Release[] = []
      for (const release of data) {
        const r = this.format(release)
        formatted.push(r)
        this.releases.push(r)
      }

      // Cache first page only
      if (this.page === 1) {
        storage.set<CacheEntry<Release[]>>('page-1', {
          data: formatted,
          timestamp: Date.now(),
        })
      }

      this.isLoading = false
      this.page++
    },
    async find (tag: string): Promise<Release | undefined> {
      if (!tag.startsWith('v')) tag = `v${tag}`

      const found = this.releases.find(release => release.tag_name === tag)

      if (found) return found

      // Check cache for this specific tag
      const cacheKey = `tag-${tag}`
      const cached = storage.get<CacheEntry<Release> | null>(cacheKey, null)
      if (isCacheValid(cached.value)) {
        this.releases.push(cached.value.data)
        return cached.value.data
      }

      if (this.isLoading) return // Prevent concurrent requests

      this.isLoading = true
      this.error = null

      let data: GitHubRelease | undefined

      if (tag.length >= 6) {
        try {
          const res = await fetch(`${url}/github/releases/find?tag=${tag}&repo=v0`, {
            method: 'GET',
            credentials: 'include',
          })
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
          }
          data = await res.json()
        } catch (error: unknown) {
          console.error(error)
          this.error = 'Failed to find release. Please try again.'
          return
        } finally {
          this.isLoading = false
        }
      } else {
        this.isLoading = false
      }

      if (data) {
        const formatted = this.format(data)
        this.releases.push(formatted)

        // Cache individual tag lookup
        storage.set<CacheEntry<Release>>(cacheKey, {
          data: formatted,
          timestamp: Date.now(),
        })

        return formatted
      }
    },
  },
})
