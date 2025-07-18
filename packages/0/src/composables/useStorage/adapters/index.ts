export type StorageType = 'localStorage' | 'sessionStorage' | 'memory'

export interface StorageAdapter {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  readonly length?: number
  key?: (index: number) => string | null
}

export * from './adapter'
export * from './memory.ts' // has to have extension for some reason
