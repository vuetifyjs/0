<script lang="ts" setup generic="T extends { id: number | string }">
  defineProps<{
    items: T[]
    label?: (item: T) => string
  }>()

  const model = defineModel<T>()
</script>

<template>
  <ul class="space-y-1">
    <li v-for="item in items" :key="item.id">
      <button
        class="w-full text-left px-3 py-2 rounded transition-colors"
        :class="model?.id === item.id
          ? 'bg-primary text-on-primary'
          : 'bg-surface text-on-surface hover:bg-surface-tint'"
        @click="model = item"
      >
        {{ label ? label(item) : item.id }}
      </button>
    </li>
  </ul>
</template>
