// Vuetify0
// Framework
import { createStorage, useLogger } from '@vuetify/v0'

import { CACHE_TTL } from '@/constants/cache'

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

interface State {
  releases: Release[]
  isLoading: boolean
  error: string | null
  page: number
}

const url = import.meta.env.VITE_API_SERVER_URL || 'https://api.vuetifyjs.com'
const storage = createStorage({ prefix: 'v0-releases:', ttl: CACHE_TTL })
const logger = useLogger()

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
        const cached = storage.get<Release[] | null>('page-1', null)
        if (Array.isArray(cached.value) && cached.value.length > 0) {
          this.releases = cached.value
          this.page = 2
          return
        }
      }

      this.isLoading = true
      this.error = null

      try {
        const res = await fetch(`${url}/github/releases?page=${this.page}&repo=v0`, {
          method: 'GET',
          credentials: 'include',
        })
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data: GitHubRelease[] = await res.json()
        const formatted: Release[] = []
        for (const release of data) {
          const r = this.format(release)
          formatted.push(r)
          this.releases.push(r)
        }

        // Cache first page only
        if (this.page === 1) {
          storage.set('page-1', formatted)
        }

        this.page++
      } catch (error: unknown) {
        logger.error('Failed to fetch releases', error)
        this.error = 'Failed to load releases. Please try again.'
        return
      } finally {
        this.isLoading = false
      }
    },
    async find (tag: string): Promise<Release | undefined> {
      if (!tag.startsWith('v')) tag = `v${tag}`

      const found = this.releases.find(release => release.tag_name === tag)

      if (found) return found

      // Check cache for this specific tag
      const cacheKey = `tag-${tag}`
      const cached = storage.get<Release | null>(cacheKey, null)
      if (cached.value) {
        this.releases.push(cached.value)
        return cached.value
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
          logger.error('Failed to find release', error)
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

        storage.set(cacheKey, formatted)

        return formatted
      }
    },
  },
})
