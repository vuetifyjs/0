// Composables
import { useHighlighter } from '@/composables/useHighlighter'

// Utilities
import { useScrollToAnchor } from '@/utilities/scroll'
import { toKebab } from '@/utilities/strings'
import { ref, type Ref, shallowReactive, useId } from 'vue'

// Types
import type { ApiMethod, ApiProperty } from '../../build/generate-api'

// Constants
import { SHIKI_THEMES } from '@/constants/shiki'

type ExampleState = { html: string, code: string }

export interface UseApiHelpersReturn {
  uid: string
  expandedExamples: Ref<Set<string>>
  highlightedExamples: Record<string, ExampleState>
  scrollToAnchor: (id: string, offset?: number) => void
  toKebab: typeof toKebab
  toggleExample: (key: string, code?: string) => Promise<void>
  formatSignature: (item: ApiMethod | ApiProperty) => string
}

export function useApiHelpers (): UseApiHelpersReturn {
  const { highlighter, getHighlighter } = useHighlighter()
  const { scrollToAnchor } = useScrollToAnchor()
  const uid = useId()
  const expandedExamples = ref<Set<string>>(new Set())
  const highlightedExamples = shallowReactive<Record<string, ExampleState>>({})

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
            themes: SHIKI_THEMES,
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
