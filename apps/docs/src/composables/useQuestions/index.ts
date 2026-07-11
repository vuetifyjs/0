/**
 * @module useQuestions
 *
 * @remarks
 * Read-only registry of self-check questions loaded from the central bank
 * (`@/skillz/questions/*.json`). Normalizes `mode` and `correctAnswers` on
 * load so both `DocsQuestion` and any future exam layer consume uniform data.
 */

// Framework
import { createRegistry, isArray } from '@vuetify/v0'

// Types
import type { RegistryContext, RegistryTicket } from '@vuetify/v0'

export interface QuestionOption {
  value: string
  label: string
  correct?: boolean
}

export interface QuestionInput {
  id: string
  stem: string
  options: QuestionOption[]
  feedback?: string
  mode?: 'single' | 'multiple'
  level?: 1 | 2 | 3
  track?: string
  categories?: string[]
}

export interface Question extends QuestionInput {
  mode: 'single' | 'multiple'
  correctAnswers: string[]
}

type QuestionTicket = RegistryTicket & Question

export function normalizeQuestion (input: QuestionInput): Question {
  const correctAnswers = input.options.filter(o => o.correct).map(o => o.value)
  const mode = input.mode ?? (correctAnswers.length > 1 ? 'multiple' : 'single')
  return { ...input, mode, correctAnswers }
}

const globQuestions = import.meta.glob<QuestionInput[]>(
  '@/skillz/questions/*.json',
  { eager: true, import: 'default' },
)

let registry: RegistryContext<QuestionTicket> | null = null

function build (): RegistryContext<QuestionTicket> {
  const store = createRegistry<QuestionTicket>()
  const seen = new Set<string>()
  for (const bank of Object.values(globQuestions)) {
    if (!isArray(bank)) continue
    for (const input of bank) {
      if (seen.has(input.id)) {
        console.warn(`[docs:questions] duplicate question id "${input.id}" — ignoring the later one`)
        continue
      }
      seen.add(input.id)
      store.register(normalizeQuestion(input))
    }
  }
  return store
}

export function useQuestions () {
  registry ??= build()
  const store = registry
  return {
    get: (id: string): Question | undefined => store.get(id),
    has: (id: string): boolean => store.has(id),
    all: (): readonly Question[] => store.values(),
    byTrack: (track: string): Question[] => store.values().filter(q => q.track === track),
  }
}
