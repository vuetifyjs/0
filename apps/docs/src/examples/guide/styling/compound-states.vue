<script setup lang="ts">
  import { Selection } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const selected = shallowRef(['disabled-selected'])
</script>

<template>
  <Selection.Root v-model="selected" multiple>
    <div class="flex flex-wrap gap-2">
      <!-- Normal -->
      <Selection.Item v-slot="{ isSelected, attrs, toggle }" value="normal">
        <button
          v-bind="attrs"
          class="px-3 py-1.5 rounded text-sm border bg-surface border-divider text-on-surface hover:border-primary/50"
          :class="isSelected && 'bg-primary! border-primary! text-on-primary!'"
          @click="toggle"
        >
          Normal
        </button>
      </Selection.Item>

      <!-- Disabled -->
      <Selection.Item v-slot="{ attrs }" disabled value="disabled">
        <button
          v-bind="attrs"
          class="px-3 py-1.5 rounded text-sm border bg-surface border-divider text-on-surface opacity-40 cursor-not-allowed!"
        >
          Disabled
        </button>
      </Selection.Item>

      <!-- Disabled + Selected -->
      <Selection.Item v-slot="{ attrs }" disabled value="disabled-selected">
        <button
          v-bind="attrs"
          class="px-3 py-1.5 rounded text-sm border bg-primary/20 border-primary text-primary cursor-not-allowed! opacity-60"
        >
          Disabled Selected
        </button>
      </Selection.Item>
    </div>
  </Selection.Root>

  <p class="mt-4 text-sm text-on-surface-variant">
    Selected: {{ selected.length > 0 ? selected.join(', ') : 'None' }}
  </p>
</template>
