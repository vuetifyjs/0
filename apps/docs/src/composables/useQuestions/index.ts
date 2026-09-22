/**
 * @module useQuestions
 *
 * @remarks
 * Read-only registry of self-check questions loaded from the central bank
 * (`@/skillz/questions/*.json`). Each question declares its correct `answers`
 * and its own pool of `distractors`; the concrete option set is sampled per
 * attempt by the consumer (`DocsQuestion`) so repeated runs aren't identical.
 * Normalizes options and `mode` on load so both `DocsQuestion` and any future
 * exam layer consume uniform data.
 */

// Framework
import { createRegistry, isArray, isString } from '@vuetify/v0'

// Types
import type { RegistryContext, RegistryTicket } from '@vuetify/v0'

/** Minimum number of options a question must be able to present. */
const MIN_OPTIONS = 4

export type QuestionOptionInput = string | { value: string, label?: string }

export interface QuestionOption {
  value: string
  label: string
}

export interface QuestionInput {
  id: string
  stem: string
  answers: QuestionOptionInput[]
  distractors: QuestionOptionInput[]
  feedback?: string
  hint?: string
  mode?: 'single' | 'multiple'
  level?: 1 | 2 | 3
  track?: string
  categories?: string[]
}

export interface Question {
  id: string
  stem: string
  answers: QuestionOption[]
  distractors: QuestionOption[]
  correctAnswers: string[]
  feedback?: string
  hint?: string
  mode: 'single' | 'multiple'
  level?: 1 | 2 | 3
  track?: string
  categories?: string[]
}

type QuestionTicket = RegistryTicket & Question

function normalizeOption (option: QuestionOptionInput): QuestionOption {
  return isString(option) ? { value: option, label: option } : { value: option.value, label: option.label ?? option.value }
}

export function normalizeQuestion (input: QuestionInput): Question {
  const answers = input.answers.map(normalizeOption)
  const distractors = input.distractors.map(normalizeOption)
  const mode = input.mode ?? (answers.length > 1 ? 'multiple' : 'single')
  return {
    id: input.id,
    stem: input.stem,
    answers,
    distractors,
    correctAnswers: answers.map(answer => answer.value),
    feedback: input.feedback,
    hint: input.hint,
    mode,
    level: input.level,
    track: input.track,
    categories: input.categories,
  }
}

/** How many distractors a question needs to reach {@link MIN_OPTIONS} options. */
export function distractorsNeeded (answerCount: number): number {
  return Math.max(MIN_OPTIONS - answerCount, 1)
}

const banks = import.meta.glob<QuestionInput[]>(
  '@/skillz/questions/*.json',
  { eager: true, import: 'default' },
)

let registry: RegistryContext<QuestionTicket> | null = null

function build (): RegistryContext<QuestionTicket> {
  const store = createRegistry<QuestionTicket>()
  const seen = new Set<string>()
  for (const bank of Object.values(banks)) {
    if (!isArray(bank)) continue
    for (const input of bank) {
      if (seen.has(input.id)) {
        console.warn(`[docs:questions] duplicate question id "${input.id}" — ignoring the later one`)
        continue
      }
      seen.add(input.id)

      const question = normalizeQuestion(input)

      if (question.answers.length === 0) {
        console.warn(`[docs:questions] question "${input.id}" has no correct answers`)
      }

      const needed = distractorsNeeded(question.answers.length)
      if (question.distractors.length < needed) {
        console.warn(`[docs:questions] question "${input.id}" has ${question.distractors.length} distractors — needs at least ${needed} to present ${MIN_OPTIONS} options`)
      }

      store.register(question)
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
    byTrack: (track: string): Question[] => store.values().filter(question => question.track === track),
  }
}
