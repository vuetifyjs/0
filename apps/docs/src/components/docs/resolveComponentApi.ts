/**
 * Resolve a hover candidate to a component API entry.
 *
 * Prose names the compound (`Avatar`). The API cache keys each part
 * (`Avatar.Root`, `Avatar.Image`). A bare namespace falls back to `.Root`.
 * An explicit part and a standalone component (`Atom`) match directly.
 */
export function resolveComponentApi<T> (
  name: string,
  components: Record<string, T>,
): T | undefined {
  return components[name] ?? components[`${name}.Root`]
}
