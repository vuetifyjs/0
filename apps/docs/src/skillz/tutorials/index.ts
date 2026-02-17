// Types
import type { SkillMeta } from '@/types/skill'

export interface TutorialMeta {
  title: string
  description: string
  level: 1 | 2 | 3
  track: string
  categories: string[]
  order: number
  minutes: number
  prerequisites?: string[]
  steps?: string[]
}

export interface StepOptions {
  hideFiles?: boolean
  hideTabs?: boolean
  hideBreadcrumbs?: boolean
}

export interface TutorialStep {
  markdown: () => Promise<string>
  files: Record<string, () => Promise<string>>
}

export interface Tutorial {
  id: string
  meta: TutorialMeta
  steps: TutorialStep[]
}

// Discover all tutorials via import.meta.glob
const metas = import.meta.glob<TutorialMeta>('./*/meta.json', { eager: true, import: 'default' })
const markdowns = import.meta.glob<string>('./**/step-*/README.md', { query: '?raw', import: 'default' })
const codeFiles = import.meta.glob<string>('./**/step-*/**/*.{vue,ts,js}', { query: '?raw', import: 'default' })

function parseTutorialId (path: string): string {
  // './vue-basics/meta.json' → 'vue-basics'
  return path.split('/')[1]
}

function parseStepNumber (path: string): number {
  // './vue-basics/step-1/README.md' → 1
  const match = path.match(/step-(\d+)/)
  return match ? Number(match[1]) : 0
}

function getTutorials (): Tutorial[] {
  const tutorials: Tutorial[] = []

  for (const [metaPath, meta] of Object.entries(metas)) {
    const id = parseTutorialId(metaPath)
    const stepsMap = new Map<number, TutorialStep>()

    // Collect markdown files for this tutorial
    for (const [mdPath, loader] of Object.entries(markdowns)) {
      if (!mdPath.startsWith(`./${id}/`)) continue
      const stepNum = parseStepNumber(mdPath)
      if (stepsMap.has(stepNum)) {
        stepsMap.get(stepNum)!.markdown = loader
      } else {
        stepsMap.set(stepNum, { markdown: loader, files: {} })
      }
    }

    // Collect code files for this tutorial
    for (const [codePath, loader] of Object.entries(codeFiles)) {
      if (!codePath.startsWith(`./${id}/`)) continue
      const stepNum = parseStepNumber(codePath)
      // Extract the file path relative to the step directory
      // './vue-basics/step-1/App.vue' → 'src/App.vue'
      const fileName = codePath.replace(new RegExp(String.raw`^\./${id}/step-${stepNum}/`), '')
      const replPath = `src/${fileName}`

      if (!stepsMap.has(stepNum)) {
        stepsMap.set(stepNum, { markdown: () => Promise.resolve(''), files: {} })
      }
      stepsMap.get(stepNum)!.files[replPath] = loader
    }

    // Sort steps by number
    const steps = [...stepsMap.entries()]
      .toSorted(([a], [b]) => a - b)
      .map(([, step]) => step)

    tutorials.push({ id, meta, steps })
  }

  return tutorials
}

export function parseStepOptions (raw: string): { body: string, options: StepOptions } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { body: raw, options: {} }

  const options: StepOptions = {}
  for (const line of match[1].split('\n')) {
    const [key, val] = line.split(':').map(s => s.trim())
    if (key === 'hideFiles' || key === 'hideTabs' || key === 'hideBreadcrumbs') {
      options[key] = val === 'true'
    }
  }
  return { body: match[2], options }
}

export function getTutorial (id: string): Tutorial | undefined {
  return getTutorials().find(t => t.id === id)
}

export function getTutorialSkills (): SkillMeta[] {
  return getTutorials().map(t => ({
    mode: 'tutorial' as const,
    id: t.id,
    name: t.meta.title,
    level: t.meta.level,
    track: t.meta.track,
    categories: t.meta.categories,
    order: t.meta.order,
    prerequisites: t.meta.prerequisites ?? [],
    description: t.meta.description,
    minutes: t.meta.minutes,
    startRoute: `/skillz/${t.id}`,
    tutorialRoute: `/skillz/tutorial/${t.id}`,
    steps: t.steps.map((_, i) => ({
      id: `step-${i + 1}`,
      title: `Step ${i + 1}`,
      task: '',
      hint: '',
      learn: t.meta.steps?.[i] ?? `Step ${i + 1}`,
    })),
  }))
}
