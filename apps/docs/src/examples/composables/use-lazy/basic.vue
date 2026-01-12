<script setup lang="ts">
  import { useLazy } from '@vuetify/v0'
  import { shallowRef, watch } from 'vue'

  const isOpen = shallowRef(false)
  const { hasContent, isBooted, onAfterLeave } = useLazy(isOpen)

  // Simulate loading heavy content
  const isLoading = shallowRef(false)
  const items = shallowRef<string[]>([])

  watch(hasContent, value => {
    if (value && items.value.length === 0) {
      isLoading.value = true
      setTimeout(() => {
        items.value = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`)
        isLoading.value = false
      }, 800)
    }
  })

  watch(isBooted, value => {
    if (!value) items.value = []
  })
</script>

<template>
  <div>
    <div class="text-center">
      <button
        class="px-4 py-2 bg-primary text-on-primary rounded"
        @click="isOpen = !isOpen"
      >
        {{ isOpen ? 'Close' : 'Open' }}
      </button>
    </div>

    <Transition
      enter-active-class="transition-opacity"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity"
      leave-to-class="opacity-0"
      @after-leave="onAfterLeave"
    >
      <div
        v-if="isOpen"
        class="mt-4 p-4 bg-surface border border-divider rounded shadow-lg"
      >
        <template v-if="hasContent">
          <div v-if="isLoading" class="py-8 text-center text-on-surface-variant">
            Loading content...
          </div>

          <div v-else class="h-48 overflow-auto">
            <div
              v-for="item in items"
              :key="item"
              class="px-2 py-1 border-b border-divider last:border-b-0"
            >
              {{ item }}
            </div>
          </div>
        </template>
      </div>
    </Transition>

    <p class="mt-4 text-xs text-on-surface-variant text-center">
      isBooted: {{ isBooted }} · hasContent: {{ hasContent }}
    </p>
  </div>
</template>
