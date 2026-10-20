// Types
import type { PackageManager } from '@/composables/useSettings'

/** Slim registry row the feature-page chip needs. No example file contents. */
export interface RegistryChipItem {
  /** Registry name. The `<name>` in `vuetify add <name>`. */
  name: string
  /** Docs path, no origin, no trailing slash. */
  path: string
  category: string
  exampleIds: string[]
  install?: { factory: string }
}

const COMMAND: Record<PackageManager, (name: string) => string> = {
  pnpm: name => `pnpm dlx @vuetify/cli add ${name}`,
  npm: name => `npx @vuetify/cli add ${name}`,
  yarn: name => `yarn dlx @vuetify/cli add ${name}`,
  bun: name => `bunx @vuetify/cli add ${name}`,
}

/**
 * Command copied by the Vuetify CLI chip, the sentence under that command,
 * and the same two joined for a single string. The "Learn more" link is
 * rendered under the sentence; it is not part of either string.
 */
export function cliChip (
  item: RegistryChipItem,
  manager: PackageManager,
): { command: string, detail: string, tooltip: string } {
  const command = COMMAND[manager](item.name)
  const factory = item.install?.factory
  const detail = factory
    ? (item.exampleIds.length > 0
        ? `Wires ${factory} into your app. The CLI asks before copying a usage example.`
        : `Wires ${factory} into your app.`)
    : (item.exampleIds.length > 1
        ? 'Seeds a working example into your project. The CLI asks which one.'
        : 'Seeds a working example into your project.')

  return { command, detail, tooltip: `${command}. ${detail}` }
}
