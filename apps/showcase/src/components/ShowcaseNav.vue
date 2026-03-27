<script setup lang="ts">
  import { CxDropdown, CxDropdownContent, CxDropdownTrigger, CxNavGroup, CxNavLink } from '@paper/codex'

  import CoverageBadge from './CoverageBadge.vue'

  // Composables
  import { useShowcase } from '../composables/useShowcase'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { designSystems, getCategories, getComposableCategories } = useShowcase()
  const slug = toRef(() => route.params.ds as string)
  const ds = toRef(() => designSystems.value.find(d => d.slug === slug.value))
  const categories = toRef(() => ds.value ? getCategories(slug.value) : [])
  const composableCategories = toRef(() => ds.value ? getComposableCategories(slug.value) : [])
</script>

<template>
  <ul class="list-none p-0 m-0">
    <!-- DS selector -->
    <li v-if="designSystems.length > 1" class="mb-2">
      <CxDropdown>
        <CxDropdownTrigger class="w-full">
          {{ ds?.name ?? 'Select design system' }}
        </CxDropdownTrigger>
        <CxDropdownContent>
          <ul class="list-none p-0 m-0">
            <li v-for="d in designSystems" :key="d.slug">
              <router-link
                class="block px-3 py-1.5 hover:bg-surface-variant rounded text-sm"
                :class="{ 'font-semibold': d.slug === slug }"
                :to="`/${d.slug}`"
              >
                {{ d.name }}
              </router-link>
            </li>
          </ul>
        </CxDropdownContent>
      </CxDropdown>
    </li>

    <!-- Top-level links -->
    <CxNavLink label="Home" to="/" />
    <CxNavLink label="Getting Started" to="/getting-started" />

    <template v-if="ds">
      <!-- Overview -->
      <CxNavGroup label="Overview">
        <CxNavLink label="Getting Started" :to="`/${ds.slug}`" />
        <CxNavLink label="Design Tokens" :to="`/${ds.slug}/tokens`" />
      </CxNavGroup>

      <!-- Components -->
      <CxNavGroup label="Components">
        <CxNavGroup v-for="category in categories" :key="category" :label="category">
          <CxNavLink
            v-for="component in ds.components.filter(c => c.category === category)"
            :key="component.name"
            :label="component.name"
            :to="`/${ds.slug}/components/${component.name}`"
          />
        </CxNavGroup>
        <CxNavLink label="All Components" :to="`/${ds.slug}/components`" />
      </CxNavGroup>

      <!-- Composables -->
      <CxNavGroup v-if="ds.composables?.length" label="Composables">
        <CxNavGroup v-for="category in composableCategories" :key="category" :label="category">
          <CxNavLink
            v-for="composable in ds.composables!.filter(c => c.category === category)"
            :key="composable.name"
            :label="composable.name"
            :to="`/${ds.slug}/composables/${composable.name}`"
          />
        </CxNavGroup>
        <CxNavLink label="All Composables" :to="`/${ds.slug}/composables`" />
      </CxNavGroup>

      <!-- Coverage -->
      <li class="flex items-center gap-2 mt-2">
        <CxNavLink class="flex-1" label="Coverage" :to="`/${ds.slug}/coverage`" />
        <CoverageBadge />
      </li>
    </template>
  </ul>
</template>
