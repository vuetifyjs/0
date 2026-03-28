// Framework
import { createContext, createNested, isString } from '@vuetify/v0'

// Utilities
import { nextTick, onMounted, shallowRef, toValue, watch } from 'vue'
import { useRoute } from 'vue-router'

// Types
import type { NestedContext, NestedRegistration, NestedTicketInput } from '@vuetify/v0'
import type { ID } from '@vuetify/v0/types'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

// =============================================================================
// Nav item types
// =============================================================================

export interface ShowcaseNavLink {
  name: string
  to: string
  children?: ShowcaseNavItem[]
}

export interface ShowcaseNavCategory {
  name: string
  children: ShowcaseNavItem[]
}

export interface ShowcaseNavDivider {
  divider: true
}

export type ShowcaseNavItem = ShowcaseNavLink | ShowcaseNavCategory | ShowcaseNavDivider

export type ShowcaseNavValue = ShowcaseNavLink | ShowcaseNavCategory

export function isNavLink (item: ShowcaseNavItem): item is ShowcaseNavLink {
  return 'to' in item && isString(item.to)
}

// =============================================================================
// Transform to nested registrations
// =============================================================================

export function navToNested (
  items: ShowcaseNavItem[],
  parentId?: ID,
): NestedRegistration<NestedTicketInput<ShowcaseNavValue>>[] {
  const result: NestedRegistration<NestedTicketInput<ShowcaseNavValue>>[] = []
  let index = 0

  for (const item of items) {
    if ('divider' in item) continue

    const id: ID = isNavLink(item)
      ? item.to
      : `category-${parentId ?? 'root'}-${index++}`

    const children = 'children' in item && item.children
      ? navToNested(item.children, id)
      : undefined

    result.push({
      id,
      value: item as ShowcaseNavValue,
      parentId,
      children,
    })
  }

  return result
}

// =============================================================================
// Context
// =============================================================================

export interface ShowcaseNavContext {
  nested: NestedContext<NestedTicketInput<ShowcaseNavValue>>
  isRestoring: Readonly<ShallowRef<boolean>>
}

const [useShowcaseNavContext, provideShowcaseNavContext] = createContext<ShowcaseNavContext>('showcase:nav')

export { useShowcaseNavContext }

export function createShowcaseNav (nav: MaybeRefOrGetter<ShowcaseNavItem[]>) {
  const route = useRoute()
  const nested = createNested<NestedTicketInput<ShowcaseNavValue>>({ open: 'multiple' })
  const isRestoring = shallowRef(true)

  watch(() => toValue(nav), items => {
    const saved = [...nested.openedIds]
    nested.clear()
    nested.onboard(navToNested(items))
    if (saved.length > 0) {
      nested.open(saved.filter(id => nested.has(id)))
    }
  }, { immediate: true })

  onMounted(async () => {
    watch(() => route.path, path => {
      nested.reveal(path)
      if (nested.children.has(path)) {
        nested.open([path])
      }
    }, { immediate: true })

    await nextTick()
    isRestoring.value = false
  })

  const context: ShowcaseNavContext = { nested, isRestoring }

  return {
    ...context,
    provide: () => provideShowcaseNavContext(context),
  }
}
