/**
 * Key alias mapping for consistent key normalization across the hotkey system.
 *
 * Maps user-friendly aliases to canonical key names that match
 * KeyboardEvent.key values (in lowercase) where possible.
 */
export const keyAliasMap = {
  // Modifier aliases
  control: 'ctrl',
  command: 'cmd',
  option: 'alt',

  // Arrow key aliases
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',

  // Common key aliases
  esc: 'escape',
  spacebar: ' ',
  space: ' ',
  return: 'enter',
  del: 'delete',

  // Symbol aliases
  minus: '-',
  hyphen: '-',
} as const

/**
 * Normalizes a key string to its canonical form using the alias map.
 *
 * @param key - The key string to normalize
 * @returns The canonical key name in lowercase
 */
export type KeyAlias = keyof typeof keyAliasMap

export function normalizeKey (key: string): string {
  const lowerKey = key.toLowerCase()
  return keyAliasMap[lowerKey as KeyAlias] ?? lowerKey
}
