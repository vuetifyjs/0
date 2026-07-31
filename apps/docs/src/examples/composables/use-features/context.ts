export const NAMESPACE = 'demo:features'

export interface FlagMeta {
  id: string
  label: string
  description: string
  enabled: boolean
  variations?: string[]
  variation?: string
}

export type FlagConfig = Record<string, boolean | { $value: boolean, $variation: string }>

export const flags: FlagMeta[] = [
  {
    id: 'new-checkout',
    label: 'Express checkout',
    description: 'Single-page checkout with saved cards',
    enabled: true,
  },
  {
    id: 'dark-mode',
    label: 'Dark storefront',
    description: 'Opt-in dark color scheme',
    enabled: false,
  },
  {
    id: 'beta-banner',
    label: 'Beta banner',
    description: 'Promo ribbon shown to early-access users',
    enabled: false,
  },
  {
    id: 'search-engine',
    label: 'Search engine',
    description: 'Backend that powers product search',
    enabled: true,
    variations: ['classic', 'semantic'],
    variation: 'semantic',
  },
  {
    id: 'product-layout',
    label: 'Product layout',
    description: 'How the catalog grid is presented',
    enabled: true,
    variations: ['list', 'grid'],
    variation: 'grid',
  },
]

export function toConfig (list: FlagMeta[]): FlagConfig {
  const config: FlagConfig = {}

  for (const flag of list) {
    config[flag.id] = flag.variation
      ? { $value: flag.enabled, $variation: flag.variation }
      : flag.enabled
  }

  return config
}
