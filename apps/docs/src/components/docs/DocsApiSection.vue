<script setup lang="ts">
  defineProps<{
    anchorId: string
    title: string
    items?: { name: string }[]
    kind: 'prop' | 'event' | 'slot' | 'function' | 'option' | 'property' | 'method'
    class?: string
  }>()
</script>

<template>
  <template v-if="items?.length">
    <DocsHeaderAnchor
      :id="anchorId"
      :class="$props.class"
    >
      {{ title }}
    </DocsHeaderAnchor>

    <div class="space-y-4">
      <DocsApiCard
        v-for="item in items"
        :key="item.name"
        :item
        :kind
      />
    </div>
  </template>
</template>
