// Framework
import { createContext } from '@vuetify/v0'

// Types
import type { ShallowRef } from 'vue'

export const [useCodeGroupExpand, provideCodeGroupExpand] = createContext<ShallowRef<boolean> | null>(
  'docs:code-group-expand',
  null,
)
