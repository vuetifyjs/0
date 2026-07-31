<script setup lang="ts">
  import { Single } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const selected = shallowRef<string>()
</script>

<template>
  <Single.Root v-model="selected">
    <div class="flex flex-col gap-2">
      <Single.Item
        v-for="size in ['small', 'medium', 'large']"
        :key="size"
        v-slot="{ attrs }"
        :value="size"
      >
        <button
          v-bind="attrs"
          class="px-3 py-1.5 border rounded text-left text-sm bg-surface border-divider data-[selected]:bg-surface-tint data-[selected]:border-primary"
        >
          {{ size }}
        </button>
      </Single.Item>
    </div>
  </Single.Root>

  <p class="mt-4">Selected: {{ selected }}</p>
</template>
