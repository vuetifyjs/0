<script setup lang="ts">
  import { computed, toRef, useTemplateRef } from 'vue'
  import { tags } from './context'
  import TagFilter from './TagFilter.vue'

  const filter = useTemplateRef<InstanceType<typeof TagFilter>>('filter')

  const results = computed(() => {
    const group = filter.value?.group
    if (!group || group.isNoneSelected.value) return tags
    return tags.filter(t => group.selected(t.id))
  })

  const label = toRef(() => {
    const group = filter.value?.group
    if (!group || group.isNoneSelected.value) return 'Showing all'
    return `Filtered to ${group.selectedIds.size}`
  })
</script>

<template>
  <div class="space-y-6">
    <TagFilter ref="filter" />

    <!-- Results -->
    <div class="pt-4 border-t border-divider">
      <p class="text-xs text-on-surface-variant mb-2">
        {{ label }}:
      </p>

      <div class="flex flex-wrap gap-1">
        <span
          v-for="tag in results"
          :key="tag.id"
          class="px-2 py-0.5 text-xs rounded bg-surface-variant text-on-surface-variant"
        >
          {{ tag.value }}
        </span>
      </div>
    </div>
  </div>
</template>
