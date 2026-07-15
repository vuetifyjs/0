// Framework
import { createFilter } from '@vuetify/v0'

// Utilities
import { shallowRef, toRef, toValue } from 'vue'

// Types
import type { ComponentApi, ComposableApi } from '@build/generate-api'
import type { MaybeRefOrGetter } from 'vue'

// Shared filter state for the API reference surfaces (inline <DocsApi /> and the
// standalone /api/{name} pages). Owns the search query and derives which items,
// sections, and component groups survive it. DocsApiSection self-filters its own
// items with the same createFilter keys; this composable drives the query and the
// component-group + empty-state visibility around them.
export function useApiFilter (
  componentApis: MaybeRefOrGetter<ComponentApi[]>,
  composableApi: MaybeRefOrGetter<ComposableApi | null>,
) {
  // API item shapes (ApiProp, ApiSlot, …) carry no index signature, so cast to
  // createFilter's structural FilterItem at the boundary. Object identity is
  // preserved, which is what the visibleApis membership check relies on.
  type Item = Record<string, unknown>

  const search = shallowRef('')

  const isComponent = toRef(() => toValue(componentApis).length > 0)

  function group (api: ComponentApi) {
    return [...api.props ?? [], ...api.events ?? [], ...api.slots ?? []] as unknown as Item[]
  }

  const items = toRef(() => {
    if (isComponent.value) {
      return toValue(componentApis).flatMap(group)
    }

    const api = toValue(composableApi)
    if (!api) return [] as Item[]

    return [
      ...api.functions ?? [],
      ...api.options ?? [],
      ...api.properties ?? [],
      ...api.methods ?? [],
    ] as unknown as Item[]
  })

  const filter = createFilter({ keys: ['name', 'description'] })
  const { items: matches } = filter.apply(search, items)

  const matched = toRef(() => new Set(matches.value))

  // Component-name matching. The item filter above only sees the flattened
  // props/events/slots, so a search for a compound name (e.g. "Trigger" in
  // Dialog.Trigger) never surfaces its group. Match the group names too.
  const nameFilter = createFilter({ keys: ['name'] })
  const { items: nameMatches } = nameFilter.apply(search, () => toValue(componentApis) as unknown as Item[])

  const named = toRef(() => new Set(nameMatches.value))

  function matchesName (api: ComponentApi) {
    return named.value.has(api as unknown as Item)
  }

  const visibleApis = toRef(() => {
    if (!search.value) return toValue(componentApis)

    return toValue(componentApis).filter(api => matchesName(api) || group(api).some(item => matched.value.has(item)))
  })

  // A group surfaced by its name shows every item, so its DocsApiSections must
  // not re-filter by the query and empty themselves out.
  function queryFor (api: ComponentApi) {
    return matchesName(api) ? '' : search.value
  }

  const placeholder = toRef(() =>
    isComponent.value
      ? 'Filter props, events, slots…'
      : 'Filter functions, options, methods…',
  )

  const empty = toRef(() => !!search.value && matches.value.length === 0 && nameMatches.value.length === 0)

  return { search, visibleApis, queryFor, placeholder, empty }
}
