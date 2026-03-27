export type FeatureType = 'component' | 'composable' | 'plugin' | 'constant' | 'type' | 'util'

export function classify (
  name: string,
  isType: boolean,
  importMapComponents?: Set<string>,
): FeatureType {
  if (isType) return 'type'
  if (importMapComponents?.has(name)) return 'component'
  if (/^use[A-Z]/.test(name)) return 'composable'
  if (/^create.*Plugin$/.test(name)) return 'plugin'
  if (/^[A-Z][A-Z0-9_]*$/.test(name)) return 'constant'
  if (/^[A-Z]/.test(name)) return 'component'
  return 'util'
}
