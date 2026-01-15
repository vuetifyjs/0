// Vuetify0
// Framework
import { createStorage, useLogger } from '@vuetify/v0'

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
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

interface State {
  milestones: Milestone[]
  isLoading: boolean
  error: string | null
}

const GITHUB_API = 'https://api.github.com'
const REPO = 'vuetifyjs/0'
const CACHE_TTL = import.meta.env.DEV ? 30 * 1000 : 5 * 60 * 1000 // 30s dev, 5min prod

const storage = createStorage({ prefix: 'v0-roadmap:' })
const logger = useLogger()

function isCacheValid<T> (entry: CacheEntry<T> | null): entry is CacheEntry<T> {
  if (!entry) return false
  return Date.now() - entry.timestamp < CACHE_TTL
}

function getHorizon (milestone: GitHubMilestone): TimeHorizon {
  if (milestone.state === 'closed') return 'done'
  if (!milestone.due_on) return 'later'

  const now = Date.now()
  const due = new Date(milestone.due_on).getTime()
  const daysUntilDue = (due - now) / (1000 * 60 * 60 * 24)

  // Now: due within 30 days or overdue
  if (daysUntilDue <= 30) return 'now'
  // Next: due within 90 days
  if (daysUntilDue <= 90) return 'next'
  // Later: everything else
  return 'later'
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
      state.milestones.filter(m => m.horizon === horizon),

    now: state => state.milestones.filter(m => m.horizon === 'now'),
    next: state => state.milestones.filter(m => m.horizon === 'next'),
    later: state => state.milestones.filter(m => m.horizon === 'later'),
    done: state => state.milestones.filter(m => m.horizon === 'done'),
  },

  actions: {
    async fetch () {
      if (this.milestones.length > 0) return // Already fetched

      // Check cache first
      const cached = storage.get<CacheEntry<Milestone[]> | null>('milestones', null)
      if (isCacheValid(cached.value)) {
        this.milestones = cached.value.data
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

        const [openMilestones, closedMilestones]: [GitHubMilestone[], GitHubMilestone[]] = await Promise.all([
          openRes.json(),
          closedRes.json(),
        ])

        this.milestones = [
          ...openMilestones.map(m => ({ ...m, horizon: getHorizon(m) })),
          ...closedMilestones.map(m => ({ ...m, horizon: 'done' as TimeHorizon })),
        ]

        // Cache the result
        storage.set<CacheEntry<Milestone[]>>('milestones', {
          data: this.milestones,
          timestamp: Date.now(),
        })
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
      const cached = storage.get<CacheEntry<GitHubIssue[]> | null>(cacheKey, null)
      if (isCacheValid(cached.value)) {
        milestone.issues = cached.value.data
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

        milestone.issues = await res.json()

        // Cache the result
        storage.set<CacheEntry<GitHubIssue[]>>(cacheKey, {
          data: milestone.issues,
          timestamp: Date.now(),
        })
      } catch (error: unknown) {
        logger.error('Failed to fetch issues', error)
        milestone.issues = []
      } finally {
        milestone.issuesLoading = false
      }
    },
  },
})
