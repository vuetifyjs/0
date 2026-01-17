// Framework
import { useStorage } from '@vuetify/v0'

// Utilities
import { readonly } from 'vue'

// Types
import type { SkillProgress } from '@/types/skill'

const STORAGE_KEY = 'skillz-progress'

interface ProgressState {
  [skillId: string]: SkillProgress
}

export function useSkillProgress () {
  const storage = useStorage()
  const progress = storage.get<ProgressState>(STORAGE_KEY, {})
  function getSkillProgress (skillId: string): SkillProgress {
    return progress.value[skillId] ?? {
      skillId,
      completedSteps: [],
      completed: false,
    }
  }

  function markStepComplete (skillId: string, stepIndex: number) {
    const current = getSkillProgress(skillId)
    if (!current.completedSteps.includes(stepIndex)) {
      current.completedSteps = [...current.completedSteps, stepIndex].toSorted((a, b) => a - b)
    }
    progress.value = { ...progress.value, [skillId]: current }
  }

  function markSkillComplete (skillId: string) {
    const current = getSkillProgress(skillId)
    current.completed = true
    current.completedAt = new Date().toISOString()
    progress.value = { ...progress.value, [skillId]: current }
  }

  function isStepComplete (skillId: string, stepIndex: number): boolean {
    return getSkillProgress(skillId).completedSteps.includes(stepIndex)
  }

  function isSkillComplete (skillId: string): boolean {
    return getSkillProgress(skillId).completed
  }

  function getCompletedSkillsCount (): number {
    return Object.values(progress.value).filter(p => p.completed).length
  }

  function resetProgress () {
    progress.value = {}
  }

  function resetSkillProgress (skillId: string) {
    const { [skillId]: _, ...rest } = progress.value
    progress.value = rest
  }

  return {
    progress: readonly(progress),
    getSkillProgress,
    markStepComplete,
    markSkillComplete,
    isStepComplete,
    isSkillComplete,
    getCompletedSkillsCount,
    resetProgress,
    resetSkillProgress,
  }
}
