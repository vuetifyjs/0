// apps/builder/src/plugins/stack/defaults.ts

export interface StackConfig {
  baseZIndex: number
  increment: number
}

export const defaultConfig: StackConfig = {
  baseZIndex: 2000,
  increment: 10,
}
