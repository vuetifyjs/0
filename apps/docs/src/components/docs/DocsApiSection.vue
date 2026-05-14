<script setup lang="ts">
  const props = defineProps<{
    anchorId: string
    title: string
    items?: { name: string }[]
    kind: 'prop' | 'event' | 'slot' | 'function' | 'option' | 'property' | 'method'
    class?: string
  }>()
</script>

<template>
  <template v-if="props.items?.length">
    <DocsHeaderAnchor
      :id="anchorId"
      :class="$props.class"
    >
      {{ title }}
    </DocsHeaderAnchor>

    <div class="space-y-4">
      <DocsApiCard
        v-for="item in props.items"
        :key="item.name"
        :item="(item as never)"
        :kind
      />
    </div>
  </template>
</template>
