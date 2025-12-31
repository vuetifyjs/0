// Composables
import { useHighlighter } from '@/composables/useHighlighter'

// Utilities
import { ref, shallowReactive, useId } from 'vue'

// Types
import type { ApiMethod, ApiProperty } from '../../build/generate-api'

type ExampleState = { html: string, code: string }

export function useApiHelpers () {
  const { highlighter, getHighlighter } = useHighlighter()
  const uid = useId()
  const expandedExamples = ref<Set<string>>(new Set())
  const highlightedExamples = shallowReactive<Record<string, ExampleState>>({})

  function scrollToAnchor (id: string) {
    const el = document.querySelector(`#${id}`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  function toKebab (str: string): string {
    return str
      .replace(/\./g, '-') // Handle dot notation (Step.Root → Step-Root)
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
  }

  async function toggleExample (key: string, code?: string) {
    const newSet = new Set(expandedExamples.value)
    if (newSet.has(key)) {
      newSet.delete(key)
      expandedExamples.value = newSet
    } else {
      newSet.add(key)
      expandedExamples.value = newSet
      if (code && !highlightedExamples[key]) {
        const hl = highlighter.value ?? await getHighlighter()
        highlightedExamples[key] = {
          code,
          html: hl.codeToHtml(code, {
            lang: 'typescript',
            themes: {
              light: 'github-light-default',
              dark: 'github-dark-default',
            },
            defaultColor: false,
          }),
        }
      }
    }
  }

  function formatSignature (item: ApiMethod | ApiProperty): string {
    const type = item.type
    const arrowMatch = type.match(/^\((.*?)\)\s*=>\s*(.+)$/)
    if (arrowMatch) {
      const [, params, returnType] = arrowMatch
      const simplifiedParams = params
        .split(',')
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => {
          const [name, pType] = p.split(':').map(s => s.trim())
          const simpleType = pType?.replace(/import\([^)]+\)\./g, '') || ''
          return simpleType ? `${name}: ${simpleType}` : name
        })
        .join(', ')
      return `(${simplifiedParams}) => ${returnType.replace(/import\([^)]+\)\./g, '')}`
    }
    return type.replace(/import\([^)]+\)\./g, '')
  }

  return {
    uid,
    expandedExamples,
    highlightedExamples,
    scrollToAnchor,
    toKebab,
    toggleExample,
    formatSignature,
  }
}
