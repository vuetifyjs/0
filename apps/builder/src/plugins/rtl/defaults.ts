// apps/builder/src/plugins/rtl/defaults.ts

export interface RtlConfig {
  default: boolean
  /** Omitted entirely when blank — never emitted as an explicit `undefined`. */
  target?: string
}

export const defaultConfig: RtlConfig = {
  default: false,
}
