<script setup lang="ts">
  import { createQueue, useProxyRegistry } from '@vuetify/v0'
  import { computed, onScopeDispose, shallowRef, watch } from 'vue'
  import { provideUploads } from './context'
  import type { Upload, UploadInput } from './context'
  import type { ID } from '@vuetify/v0/types'

  // timeout: -1 means items persist until manually removed
  const queue = createQueue<UploadInput, Upload>({ timeout: -1 })

  // Reactive proxy for accessing queue items
  const proxy = useProxyRegistry(queue)

  let interval: ReturnType<typeof setInterval> | null = null

  // Cleanup interval on unmount
  onScopeDispose(() => {
    if (interval) clearInterval(interval)
  })

  // Simulate upload progress with random increments
  function simulate (upload: Upload) {
    interval = setInterval(() => {
      const current = upload.progress.value
      const increment = Math.random() * 12 + 3
      upload.progress.value = Math.min(current + increment, 100)

      // Auto-remove when complete, triggering next in queue
      if (upload.progress.value >= 100) {
        clearInterval(interval!)
        interval = null
        queue.unregister(upload.id)
      }
    }, 150)
  }

  // First item in queue is the active upload
  const first = computed(() => proxy.values[0])

  // Start processing when a new item becomes first
  watch(first, (current, prev) => {
    if (current && current !== prev) {
      simulate(current)
    }
  }, { immediate: true })

  function add (name: string, size: string) {
    queue.register({
      name,
      size,
      progress: shallowRef(0),
    })
  }

  function cancel (id: ID) {
    const upload = queue.get(id)
    // Stop simulation if canceling the first upload
    if (upload === first.value && interval) {
      clearInterval(interval)
      interval = null
    }
    queue.unregister(id)
  }

  // Derived state for consumers
  const items = computed(() => proxy.values)
  const pending = computed(() => proxy.values.slice(1))
  const size = computed(() => proxy.size)

  provideUploads({ first, items, pending, size, add, cancel })
</script>

<template>
  <slot />
</template>
