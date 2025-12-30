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

const url = import.meta.env.VITE_API_SERVER_URL

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

      for (const release of data) {
        this.releases.push(this.format(release))
      }

      this.isLoading = false
      this.page++
    },
    async find (tag: string): Promise<Release | undefined> {
      if (!tag.startsWith('v')) tag = `v${tag}`

      const found = this.releases.find(release => release.tag_name === tag)

      if (found) return found

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
          this.isLoading = false
          return
        }
      }

      this.isLoading = false

      if (data) {
        const formatted = this.format(data)
        this.releases.push(formatted)
        return formatted
      }
    },
  },
})
