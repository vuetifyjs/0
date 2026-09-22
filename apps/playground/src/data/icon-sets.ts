/**
 * Iconify collections surfaced in Play Settings → Icons.
 *
 * Runtime resolution is UnoCSS `preset-icons` + CDN (`UNO_CONFIG_TS`) —
 * any Iconify collection works as `i-{collection}-{name}` without enablement.
 * This list is discoverability for authors (matches docs registry scanners).
 *
 * @see apps/docs/build/registry.ts `ICON_COLLECTIONS`
 */

export interface PlaygroundIconCollection {
  /** Iconify collection id — class prefix `i-{id}-…` */
  id: string
  label: string
  description: string
  /** One ready-to-paste class used in Settings copy helpers */
  example: string
}

/** Same set the registry soft-deps scanner recognizes. MDI first as the familiar default. */
export const ICON_COLLECTIONS: PlaygroundIconCollection[] = [
  {
    id: 'mdi',
    label: 'Material Design Icons',
    description: 'Large catalog; common in Material-adjacent demos.',
    example: 'i-mdi-home',
  },
  {
    id: 'lucide',
    label: 'Lucide',
    description: 'Default in many v0 docs examples.',
    example: 'i-lucide-home',
  },
  {
    id: 'heroicons',
    label: 'Heroicons',
    description: 'Tailwind / Tailwind UI style set.',
    example: 'i-heroicons-home',
  },
  {
    id: 'tabler',
    label: 'Tabler',
    description: 'Consistent stroke icons.',
    example: 'i-tabler-home',
  },
  {
    id: 'ph',
    label: 'Phosphor',
    description: 'Flexible weights via Iconify (e.g. ph-bold).',
    example: 'i-ph-house',
  },
  {
    id: 'carbon',
    label: 'Carbon',
    description: 'IBM Carbon design system icons.',
    example: 'i-carbon-home',
  },
]

/**
 * Iconify SVG URL for a collection example class (`i-mdi-home` → api.iconify.design/mdi/home.svg).
 * Used for Settings previews so host Uno need not safelist/CDN every set.
 */
export function iconifyPreviewUrl (example: string): string {
  const match = /^i-([a-z0-9]+)-(.+)$/i.exec(example)
  if (!match) return ''
  const [, collection, name] = match
  return `https://api.iconify.design/${collection}/${name}.svg?color=%237c9cff`
}
