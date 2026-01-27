// Transformers
import { createApiTransformer } from '@build/shiki-api-transformer'

// Composables
import { useHighlighter } from '@/composables/useHighlighter'

// Utilities
import { useScrollToAnchor } from '@/utilities/scroll'
import { toKebab } from '@/utilities/strings'
import { ref, type Ref, shallowReactive, useId } from 'vue'

// Types
import type { ApiMethod, ApiProperty } from '@build/generate-api'

// Constants
import { SHIKI_THEMES } from '@/constants/shiki'

type ExampleState = { html: string, code: string }

export interface UseApiHelpersReturn {
  uid: string
  expanded: Ref<Set<string>>
  highlighted: Record<string, ExampleState>
  scrollToAnchor: (id: string, offset?: number) => void
  toKebab: typeof toKebab
  toggle: (key: string, code?: string) => Promise<void>
  formatSignature: (item: ApiMethod | ApiProperty) => string
}

export function useApiHelpers (): UseApiHelpersReturn {
  const { highlighter, getHighlighter } = useHighlighter()
  const { scrollToAnchor } = useScrollToAnchor()
  const uid = useId()
  const expanded = ref<Set<string>>(new Set())
  const highlighted = shallowReactive<Record<string, ExampleState>>({})

  async function toggle (key: string, code?: string) {
    const newSet = new Set(expanded.value)
    if (newSet.has(key)) {
      newSet.delete(key)
      expanded.value = newSet
    } else {
      newSet.add(key)
      expanded.value = newSet
      if (code && !highlighted[key]) {
        const hl = highlighter.value ?? await getHighlighter()
        // Detect language: Vue SFC if it starts with <template> or <script, otherwise TypeScript
        const isVue = /^<(?:template|script)/.test(code.trim())
        highlighted[key] = {
          code,
          html: hl.codeToHtml(code, {
            lang: isVue ? 'vue' : 'typescript',
            themes: SHIKI_THEMES,
            defaultColor: false,
            transformers: [createApiTransformer()],
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
    expanded,
    highlighted,
    scrollToAnchor,
    toKebab,
    toggle,
    formatSignature,
  }
}
