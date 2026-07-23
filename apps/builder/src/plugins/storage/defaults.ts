// apps/builder/src/plugins/storage/defaults.ts

export interface StorageConfig {
  prefix: string
  ttl: number | undefined
}

export const defaultConfig: StorageConfig = {
  prefix: 'v0:',
  ttl: undefined,
  // adapter and serializer are NOT defaultable via the form — they're escape hatches
  // that require runtime values (Storage instance, function pair). v1 form exposes
  // only `prefix` + `ttl` + a hint that adapter/serializer can be customized in code.
}
