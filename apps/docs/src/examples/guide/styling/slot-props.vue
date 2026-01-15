<script setup lang="ts">
  import { Selection } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const selected = shallowRef<string[]>(['Banana'])
  const items = ['Apple', 'Banana', 'Cherry']
</script>

<template>
  <Selection.Root v-model="selected" multiple>
    <div class="flex flex-wrap gap-2">
      <Selection.Item
        v-for="item in items"
        :key="item"
        v-slot="{ isSelected, attrs, toggle }"
        :value="item"
      >
        <button
          v-bind="attrs"
          :class="[
            'px-3 py-1.5 border rounded text-sm',
            isSelected
              ? 'bg-primary border-primary text-on-primary'
              : 'bg-surface border-divider text-on-surface hover:border-primary/50'
          ]"
          @click="toggle"
        >
          {{ item }}
          <span v-if="isSelected" class="ml-1">✓</span>
        </button>
      </Selection.Item>
    </div>
  </Selection.Root>

  <p class="mt-4 text-sm text-on-surface-variant">
    Selected: {{ selected.length > 0 ? selected.join(', ') : 'None' }}
  </p>
</template>
