// Vuetify0
// Framework
import { createStorage, isArray, isNull, useLogger } from '@vuetify/v0'

import { CACHE_TTL } from '@/constants/cache'
import { type ResolvedFeature, auditBuckets, featuresFor } from '@/constants/roadmap-buckets'

// Utilities
import { defineStore } from 'pinia'

// Types
import type { components as octokitComponents } from '@octokit/openapi-types'

type GitHubMilestone = octokitComponents['schemas']['milestone']
type GitHubIssue = octokitComponents['schemas']['issue']

export type TimeHorizon = 'now' | 'next' | 'later' | 'done'

export interface Milestone extends GitHubMilestone {
  horizon: TimeHorizon
  issues?: GitHubIssue[]
  issuesLoading?: boolean
  features?: ResolvedFeature[]
}

interface State {
  milestones: Milestone[]
  isLoading: boolean
  error: string | null
}

const GITHUB_API = 'https://api.github.com'
const REPO = 'vuetifyjs/0'

const storage = createStorage({ prefix: 'v0-roadmap:', ttl: CACHE_TTL })
const logger = useLogger()

const VERSION = /^v?(\d+)\.(\d+)\.(\d+)/

function version (title: string): number | null {
  const match = title.match(VERSION)
  if (isNull(match)) return null
  return Number(match[1]) * 1e6 + Number(match[2]) * 1e3 + Number(match[3])
}

/**
 * Assigns horizons by release order:
 * - 1st = now (actively being worked on)
 * - 2nd-3rd = next
 * - 4th+ = later
 *
 * Release order comes from the version in the milestone title (v1.0.0 ships
 * before v1.1.0), not the due date — due dates get cleared to TBD while a
 * release stabilizes (e.g. during RC), which must not drop the active
 * milestone out of "now". Non-version titles sort after versioned ones,
 * by due date then milestone number.
 */
function assignHorizons (milestones: GitHubMilestone[]): Milestone[] {
  const sorted = milestones.toSorted((a, b) => {
    const av = version(a.title)
    const bv = version(b.title)
    if (!isNull(av) && !isNull(bv)) return av - bv
    if (!isNull(av) || !isNull(bv)) return isNull(av) ? 1 : -1
    const ad = a.due_on ? new Date(a.due_on).getTime() : Number.POSITIVE_INFINITY
    const bd = b.due_on ? new Date(b.due_on).getTime() : Number.POSITIVE_INFINITY
    return (ad - bd) || (a.number - b.number)
  })

  return sorted.map((m, index) => {
    let horizon: TimeHorizon = 'later'
    if (index === 0) horizon = 'now'
    else if (index <= 2) horizon = 'next'
    return { ...m, horizon }
  })
}

function isRateLimited (status: number): boolean {
  return status === 403 || status === 429
}

export const useRoadmapStore = defineStore('roadmap', {
  state: (): State => ({
    milestones: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    byHorizon: state => (horizon: TimeHorizon) =>
      isArray(state.milestones) ? state.milestones.filter(m => m.horizon === horizon) : [],

    now: state => isArray(state.milestones) ? state.milestones.filter(m => m.horizon === 'now') : [],
    next: state => isArray(state.milestones) ? state.milestones.filter(m => m.horizon === 'next') : [],
    later: state => isArray(state.milestones) ? state.milestones.filter(m => m.horizon === 'later') : [],
    done: state => isArray(state.milestones) ? state.milestones.filter(m => m.horizon === 'done') : [],
  },

  actions: {
    async fetch () {
      if (this.milestones.length > 0) return // Already fetched

      const unknown = auditBuckets()
      if (unknown.length > 0) logger.warn('Roadmap bucket references unknown maturity ids', unknown)

      // Check cache first
      const cached = storage.get<Milestone[] | null>('milestones', null)
      if (isArray(cached.value)) {
        // Re-resolve features on read so bucket edits reflect without waiting for cache TTL.
        this.milestones = cached.value.map(m => ({ ...m, features: featuresFor(m.title) }))
        return
      }

      this.isLoading = true
      this.error = null

      try {
        // Fetch both open and closed milestones
        const [openRes, closedRes] = await Promise.all([
          fetch(`${GITHUB_API}/repos/${REPO}/milestones?state=open&sort=due_on&direction=asc`),
          fetch(`${GITHUB_API}/repos/${REPO}/milestones?state=closed&sort=due_on&direction=desc&per_page=5`),
        ])

        if (isRateLimited(openRes.status) || isRateLimited(closedRes.status)) {
          throw new Error('RATE_LIMITED')
        }

        if (!openRes.ok || !closedRes.ok) {
          throw new Error(`HTTP ${openRes.status || closedRes.status}`)
        }

        const [openData, closedData] = await Promise.all([
          openRes.json(),
          closedRes.json(),
        ])

        const openMilestones: GitHubMilestone[] = isArray(openData) ? openData : []
        const closedMilestones: GitHubMilestone[] = isArray(closedData) ? closedData : []

        this.milestones = [
          ...assignHorizons(openMilestones),
          ...closedMilestones.map(m => ({ ...m, horizon: 'done' as TimeHorizon })),
        ].map(m => ({ ...m, features: featuresFor(m.title) }))

        storage.set('milestones', this.milestones)
      } catch (error: unknown) {
        logger.error('Failed to fetch roadmap', error)
        this.error = error instanceof Error && error.message === 'RATE_LIMITED' ? 'GitHub API rate limit reached. Try again in a few minutes.' : 'Failed to load roadmap. Please try again.'
      } finally {
        this.isLoading = false
      }
    },

    async fetchIssues (milestoneNumber: number) {
      const milestone = this.milestones.find(m => m.number === milestoneNumber)
      if (!milestone || milestone.issues) return // Already fetched

      // Check cache
      const cacheKey = `issues-${milestoneNumber}`
      const cached = storage.get<GitHubIssue[] | null>(cacheKey, null)
      if (isArray(cached.value)) {
        milestone.issues = cached.value
        return
      }

      milestone.issuesLoading = true

      try {
        const res = await fetch(
          `${GITHUB_API}/repos/${REPO}/issues?milestone=${milestoneNumber}&state=all&per_page=100`,
        )

        if (isRateLimited(res.status)) {
          milestone.issues = []
          return
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()
        milestone.issues = isArray(data) ? data : []

        storage.set(cacheKey, milestone.issues)
      } catch (error: unknown) {
        logger.error('Failed to fetch issues', error)
        milestone.issues = []
      } finally {
        milestone.issuesLoading = false
      }
    },
  },
})
