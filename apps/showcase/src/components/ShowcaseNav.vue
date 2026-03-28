<script setup lang="ts">
  import CoverageBadge from './CoverageBadge.vue'
  import ShowcaseNavLink from './ShowcaseNavLink.vue'

  // Composables
  import { useShowcase } from '../composables/useShowcase'
  import { createShowcaseNav } from '../composables/useShowcaseNav'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { ShowcaseNavItem } from '../composables/useShowcaseNav'

  const route = useRoute()
  const { designSystems, getCategories, getComposableCategories } = useShowcase()
  const slug = toRef(() => route.params.ds as string)
  const ds = toRef(() => designSystems.value.find(d => d.slug === slug.value))

  const nav = toRef((): ShowcaseNavItem[] => {
    const items: ShowcaseNavItem[] = [
      { name: 'Home', to: '/' },
      { name: 'Getting Started', to: '/getting-started' },
    ]

    const current = ds.value
    if (!current) return items

    items.push({ divider: true }, {
      name: 'Overview',
      children: [
        { name: 'Getting Started', to: `/${current.slug}` },
        { name: 'Design Tokens', to: `/${current.slug}/tokens` },
      ],
    })

    // Components by category
    const componentChildren: ShowcaseNavItem[] = []
    for (const category of getCategories(current.slug)) {
      componentChildren.push({
        name: category,
        children: current.components
          .filter(c => c.category === category)
          .map(c => ({ name: c.name, to: `/${current.slug}/components/${c.name}` })),
      })
    }
    componentChildren.push({ name: 'All Components', to: `/${current.slug}/components` })
    items.push({ name: 'Components', children: componentChildren })

    // Composables by category
    if (current.composables?.length) {
      const composableChildren: ShowcaseNavItem[] = []
      for (const category of getComposableCategories(current.slug)) {
        composableChildren.push({
          name: category,
          children: current.composables!
            .filter(c => c.category === category)
            .map(c => ({ name: c.name, to: `/${current.slug}/composables/${c.name}` })),
        })
      }
      composableChildren.push({ name: 'All Composables', to: `/${current.slug}/composables` })
      items.push({ name: 'Composables', children: composableChildren })
    }

    // Coverage
    items.push({ name: 'Coverage', to: `/${current.slug}/coverage` })

    return items
  })

  const { provide } = createShowcaseNav(nav)
  provide()

</script>

<template>
  <ul class="flex gap-2 flex-col py-2">
    <template v-for="(item, i) in nav" :key="i">
      <li v-if="'divider' in item" class="px-3 my-1">
        <div class="border-t border-divider" />
      </li>

      <ShowcaseNavLink
        v-else-if="'to' in item"
        :id="item.to"
        :name="item.name"
        :to="item.to"
      />

      <ShowcaseNavLink
        v-else
        :id="`category-root-${i}`"
        :name="item.name"
      />
    </template>

    <!-- Coverage badge -->
    <li v-if="ds" class="px-3 flex items-center gap-2">
      <CoverageBadge />
    </li>
  </ul>
</template>
