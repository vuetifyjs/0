<script setup lang="ts">
  import { Portal } from '@vuetify/v0'
  import { ref } from 'vue'

  const layers = ref<number[]>([])
  let next = 1

  function onAdd () {
    layers.value.push(next++)
  }

  function onClose (index: number) {
    layers.value.splice(index, 1)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <button
        class="rounded bg-primary px-4 py-2 text-sm text-on-primary"
        @click="onAdd"
      >
        Add layer
      </button>

      <span class="text-sm text-on-surface-variant">
        {{ layers.length }} active {{ layers.length === 1 ? 'layer' : 'layers' }}
      </span>
    </div>

    <Portal
      v-for="(id, index) in layers"
      :key="id"
      @close="onClose(index)"
    >
      <template #default="{ zIndex, close }">
        <div
          class="fixed rounded-lg border border-divider bg-surface p-4 shadow-xl"
          :style="{
            zIndex,
            bottom: `${16 + index * 12}px`,
            right: `${16 + index * 12}px`,
            width: '240px',
          }"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium">Layer {{ id }}</p>
              <p class="mt-1 text-xs text-on-surface-variant">z-index: {{ zIndex }}</p>
            </div>

            <button
              class="rounded px-2 py-1 text-xs text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
              @click="close"
            >
              close
            </button>
          </div>

          <button
            class="mt-3 w-full rounded bg-primary/10 px-3 py-1.5 text-xs text-primary hover:bg-primary/20"
            @click="onAdd"
          >
            Add another layer
          </button>
        </div>
      </template>
    </Portal>
  </div>
</template>
