import { createContext, createNested } from '@vuetify/v0'
import type { ID, NestedContext, NestedRegistration } from '@vuetify/v0'
import type { ComputedRef } from 'vue'

export interface FileMeta {
  label: string
  kind: 'folder' | 'file'
}

export interface FileNode extends FileMeta {
  id: string
  children?: FileNode[]
}

export interface FileTreeContext extends NestedContext {
  meta: (id: ID) => FileMeta | undefined
  stats: ComputedRef<{ total: number, selected: number, opened: number }>
}

export const [useFileTree, provideFileTree] = createContext<FileTreeContext>('v0:file-tree')

export function createFileTree () {
  return createNested({ selection: 'cascade' })
}

export function toRegistration (node: FileNode): NestedRegistration {
  return {
    id: node.id,
    value: { label: node.label, kind: node.kind } satisfies FileMeta,
    children: node.children?.map(toRegistration),
  }
}

export const source: FileNode[] = [
  {
    id: 'src',
    label: 'src',
    kind: 'folder',
    children: [
      {
        id: 'components',
        label: 'components',
        kind: 'folder',
        children: [
          { id: 'app-bar', label: 'AppBar.vue', kind: 'file' },
          { id: 'app-nav', label: 'AppNav.vue', kind: 'file' },
        ],
      },
      {
        id: 'composables',
        label: 'composables',
        kind: 'folder',
        children: [
          { id: 'use-theme', label: 'useTheme.ts', kind: 'file' },
          { id: 'use-nested', label: 'useNested.ts', kind: 'file' },
        ],
      },
      { id: 'main', label: 'main.ts', kind: 'file' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    kind: 'folder',
    children: [
      { id: 'favicon', label: 'favicon.ico', kind: 'file' },
      { id: 'logo', label: 'logo.svg', kind: 'file' },
    ],
  },
  { id: 'package', label: 'package.json', kind: 'file' },
  { id: 'readme', label: 'README.md', kind: 'file' },
]
