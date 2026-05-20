// apps/builder/src/plugins/rtl/defaults.ts

export interface RtlConfig {
  default: boolean
  target: string | undefined
}

export const defaultConfig: RtlConfig = {
  default: false,
  target: undefined,
}
