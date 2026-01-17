// Types
import type { SkillCategory, SkillLevel, SkillMeta, SkillRegistry, SkillTrack } from '@/types/skill'

// Skills
import { gettingStarted } from './skills/getting-started'
import { usingTheDocs } from './skills/using-the-docs'

// Skill registry
export const skills: SkillRegistry = {
  'getting-started': gettingStarted,
  'using-the-docs': usingTheDocs,
}

// Get all skills as an array
export function getAllSkills (): SkillMeta[] {
  return Object.values(skills)
}

// Get skill by ID
export function getSkill (id: string): SkillMeta | undefined {
  return skills[id]
}

// Get skills by level
export function getSkillsByLevel (level: SkillLevel): SkillMeta[] {
  return getAllSkills().filter(skill => skill.level === level)
}

// Get skills by track
export function getSkillsByTrack (track: SkillTrack): SkillMeta[] {
  return getAllSkills().filter(skill => skill.track === track)
}

// Get skills by category (any match)
export function getSkillsByCategory (category: SkillCategory): SkillMeta[] {
  return getAllSkills().filter(skill => skill.categories.includes(category))
}

// Get skills by multiple categories (any match - OR logic)
export function getSkillsByCategoriesAny (categories: SkillCategory[]): SkillMeta[] {
  if (categories.length === 0) return getAllSkills()
  return getAllSkills().filter(skill =>
    categories.some(cat => skill.categories.includes(cat)),
  )
}

// Get skills by multiple categories (all match - AND logic)
export function getSkillsByCategoriesAll (categories: SkillCategory[]): SkillMeta[] {
  if (categories.length === 0) return getAllSkills()
  return getAllSkills().filter(skill =>
    categories.every(cat => skill.categories.includes(cat)),
  )
}

// Filter interface for combined filtering
export interface SkillFilters {
  track?: SkillTrack
  level?: SkillLevel
  categories?: SkillCategory[] // OR logic
}

// Combined filter function
export function filterSkills (filters: SkillFilters): SkillMeta[] {
  return getAllSkills().filter(skill => {
    if (filters.track && skill.track !== filters.track) return false
    if (filters.level && skill.level !== filters.level) return false
    if (filters.categories?.length && !filters.categories.some(cat => skill.categories.includes(cat))) return false
    return true
  })
}

// Get skills ordered by track, then level, then order (for display)
export function getSkillsOrdered (): SkillMeta[] {
  const trackOrder: SkillTrack[] = ['fundamentals', 'features', 'integration']
  return getAllSkills().toSorted((a, b) => {
    // First by track
    const trackDiff = trackOrder.indexOf(a.track) - trackOrder.indexOf(b.track)
    if (trackDiff !== 0) return trackDiff
    // Then by level within track
    const levelDiff = a.level - b.level
    if (levelDiff !== 0) return levelDiff
    // Then by order within level
    const orderDiff = a.order - b.order
    if (orderDiff !== 0) return orderDiff
    // Finally by name
    return a.name.localeCompare(b.name)
  })
}

// Get skills for a specific track, ordered by level then order
export function getSkillsForTrack (track: SkillTrack): SkillMeta[] {
  return getSkillsByTrack(track).toSorted((a, b) => {
    const levelDiff = a.level - b.level
    if (levelDiff !== 0) return levelDiff
    return a.order - b.order
  })
}

// Get all unique categories from available skills (with counts)
export function getCategoryCounts (): Map<SkillCategory, number> {
  const counts = new Map<SkillCategory, number>()
  for (const skill of getAllSkills()) {
    for (const category of skill.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1)
    }
  }
  return counts
}

// Check if prerequisites are met
export function arePrerequisitesMet (skillId: string, completedSkills: string[]): boolean {
  const skill = getSkill(skillId)
  if (!skill) return false
  return skill.prerequisites.every(prereq => completedSkills.includes(prereq))
}

// Get available skills (prerequisites met)
export function getAvailableSkills (completedSkills: string[]): SkillMeta[] {
  return getAllSkills().filter(skill =>
    arePrerequisitesMet(skill.id, completedSkills) && !completedSkills.includes(skill.id),
  )
}
