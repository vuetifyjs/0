// Utilities
import { defineStore } from 'pinia'

// Types
import type { NavItem } from '../../build/generate-nav'

export type { NavItem, NavItemCategory, NavItemDivider, NavItemLink } from '../../build/generate-nav'

// Minimal type for commit data we actually use
interface Commit {
  sha: string
  html_url: string
}

function flattenRoutes (nav: NavItem): string[] {
  const routes: string[] = []

  if ('to' in nav && nav.to) {
    routes.push(nav.to)
  }

  if ('children' in nav && nav.children) {
    routes.push(...nav.children.flatMap(child => flattenRoutes(child)))
  }

  return routes
}

export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: false,
    nav: [] as NavItem[],
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

        pages.push(...flattenRoutes(nav as NavItem))
      }

      return pages
    },
  },
  actions: {
    async loadNav () {
      if (this.nav.length > 0) return

      try {
        const response = await fetch('/nav.json')
        if (response.ok) {
          this.nav = await response.json()
        }
      } catch {
        console.error('[app] Failed to load nav')
      }
    },
  },
})
