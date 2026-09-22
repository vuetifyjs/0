// Types
import type { NavItem, NavItemCategory, NavItemLink } from '@/stores/app'

/** A nav entry that carries a name — everything except a divider. */
type Named = NavItemLink | NavItemCategory

/**
 * Filter a nav tree by a leaf predicate, keeping a category only while it still
 * has children and dropping dividers that end up leading, trailing, or doubled.
 *
 * The feature filter and the skill-level filter differ only in `keep` — the
 * structural walk and the divider cleanup are the same for both.
 */
export function filterNav (items: NavItem[], keep: (item: NavItemLink) => boolean): NavItem[] {
  const filtered = items
    .map(item => {
      if ('divider' in item) return item
      if ('children' in item && item.children) {
        const children = filterNav(item.children, keep)
        if (children.length === 0) return null
        return { ...item, children }
      }
      if ('to' in item && !keep(item)) return null
      return item
    })
    .filter((item): item is NavItem => item !== null)

  return filtered.filter((item, index, arr) => {
    if (!('divider' in item)) return true
    const prev = arr[index - 1]
    const next = arr[index + 1]
    if (!prev || !next) return false
    if ('divider' in prev || 'divider' in next) return false
    return true
  })
}

/** Every routable path in a nav subtree, parents before children. */
export function flatten (item: NavItem): string[] {
  const routes: string[] = []

  if ('to' in item && item.to) {
    routes.push(item.to)
  }

  if ('children' in item && item.children) {
    routes.push(...item.children.flatMap(child => flatten(child)))
  }

  return routes
}

/**
 * The trail of nav items leading to `path`, ancestors first and the matching
 * link last, or `null` when the path is not in the tree. Callers wanting only
 * the page itself read the last entry.
 */
export function findNav (items: NavItem[], path: string): Named[] | null {
  for (const item of items) {
    if ('divider' in item) continue

    if ('to' in item && item.to === path) return [item]

    if ('children' in item && item.children) {
      const trail = findNav(item.children, path)
      if (trail) return [item, ...trail]
    }
  }

  return null
}

/** The nav link registered for `path`, or `null` when the tree has no such page. */
export function findLink (items: NavItem[], path: string): NavItemLink | null {
  const found = findNav(items, path)?.at(-1)
  return found && 'to' in found ? found : null
}
