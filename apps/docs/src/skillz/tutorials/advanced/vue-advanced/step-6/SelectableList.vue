<script lang="ts" setup generic="T extends { id: number | string }">
  defineProps<{
    items: T[]
  }>()

  const model = defineModel<T>()

  function isSelected (item: T) {
    return model.value?.id === item.id
  }

  function select (item: T) {
    model.value = item
  }
</script>

<template>
  <ul class="space-y-1">
    <li v-for="item in items" :key="item.id">
      <slot
        :is-selected="isSelected(item)"
        :item="item"
        :select="() => select(item)"
      />
    </li>
  </ul>
</template>
