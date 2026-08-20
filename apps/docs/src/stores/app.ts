import navData from 'virtual:nav'

// Framework
import { createStorage, useLogger } from '@vuetify/v0'

import { CACHE_TTL } from '@/constants/cache'

// Utilities
import { flatten } from '@/utilities/nav'
import { defineStore } from 'pinia'

// Types
import type { NavItem } from '@build/generate-nav'

export type { NavItem, NavItemCategory, NavItemDivider, NavItemLink } from '@build/generate-nav'

// Minimal type for commit data we actually use
interface Commit {
  sha: string
  html_url: string
  commit: {
    author: {
      date: string
    }
  }
}

const storage = createStorage({ prefix: 'v0-commit:', ttl: CACHE_TTL })

export const useAppStore = defineStore('app', {
  state: () => ({
    nav: navData as NavItem[],
    stats: {
      commit: null as Commit | null,
      tag: null,
    },
  }),
  getters: {
    routes: (state): string[] => {
      const pages: string[] = []

      for (const nav of state.nav) {
        if (!('children' in nav) && !('to' in nav)) continue

        pages.push(...flatten(nav as NavItem))
      }

      return pages
    },
  },
  actions: {
    /**
     * Latest commit on master, cached for `CACHE_TTL`. Every caller shares the
     * cache — the footer used to re-hit the API on each intersection.
     */
    async fetchCommit () {
      if (this.stats.commit) return

      const cached = storage.get<Commit | null>('latest', null)
      if (cached.value) {
        this.stats.commit = cached.value
        return
      }

      try {
        const octokit = await import('@/plugins/octokit').then(m => m.default)
        const { data = [] } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
          owner: 'vuetifyjs',
          repo: '0',
          per_page: 1,
        })

        if (data.length === 0) return

        this.stats.commit = data[0] as Commit
        storage.set('latest', this.stats.commit)
      } catch (error) {
        useLogger().warn('Failed to fetch commit info', error)
      }
    },
  },
})
