<script setup lang="ts">
  import { CxHeaderAnchor } from '@paper/codex'

  // Composables
  import { useShowcase } from '../../../composables/useShowcase'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getComponent } = useShowcase()

  const component = toRef(() => getComponent(
    route.params.ds as string,
    route.params.component as string,
  ))
</script>

<template>
  <div v-if="component" class="p-8 max-w-3xl">
    <h1 class="text-3xl font-bold font-mono mb-2">{{ component.name }}</h1>
    <p v-if="component.description" class="text-on-surface-variant mb-8">{{ component.description }}</p>

    <template v-if="component.subComponents?.length">
      <CxHeaderAnchor id="sub-components" tag="h2">
        Sub-components
      </CxHeaderAnchor>
      <ul class="list-disc pl-6 mb-8">
        <li
          v-for="sub in component.subComponents"
          :key="sub"
          class="font-mono text-sm mb-1"
        >
          {{ sub }}
        </li>
      </ul>
    </template>

    <template v-if="component.examples?.length">
      <CxHeaderAnchor id="examples" tag="h2">
        Examples
      </CxHeaderAnchor>
      <div v-for="example in component.examples" :key="example.title" class="mb-6">
        <h3 class="text-lg font-semibold mb-2">{{ example.title }}</h3>
        <p v-if="example.description" class="text-on-surface-variant text-sm mb-4">{{ example.description }}</p>
        <component :is="example.component" />
      </div>
    </template>

    <div v-if="!component.examples?.length" class="p-6 rounded-md bg-surface-variant text-on-surface-variant text-sm">
      No examples registered yet.
    </div>
  </div>

  <div v-else class="p-8">
    <p class="text-on-surface-variant">Component not found.</p>
  </div>
</template>
