<script lang="ts" setup generic="T extends { id: number | string }">
  defineProps<{
    items: T[]
    modelValue?: T
    label?: (item: T) => string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: T]
  }>()

  function select (item: T) {
    emit('update:modelValue', item)
  }
</script>

<template>
  <ul class="space-y-1">
    <li v-for="item in items" :key="item.id">
      <button
        class="w-full text-left px-3 py-2 rounded transition-colors"
        :class="modelValue?.id === item.id
          ? 'bg-primary text-on-primary'
          : 'bg-surface text-on-surface hover:bg-surface-tint'"
        @click="select(item)"
      >
        {{ label ? label(item) : item.id }}
      </button>
    </li>
  </ul>
</template>
