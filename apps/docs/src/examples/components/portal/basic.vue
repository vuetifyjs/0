<script setup lang="ts">
  import { Portal, useBreakpoints } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const show = shallowRef(false)
  const { smAndDown: mobile } = useBreakpoints()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <button
        class="rounded bg-primary px-4 py-2 text-on-primary"
        @click="show = !show"
      >
        {{ show ? 'Hide' : 'Show' }} Portal
      </button>

      <span class="text-sm text-on-surface-variant">
        {{ mobile ? 'Mobile — renders inline below' : 'Desktop — teleported to body (bottom-right)' }}
      </span>
    </div>

    <Portal v-if="show" :disabled="mobile">
      <template #default="{ zIndex }">
        <div
          class="rounded-lg bg-surface-variant p-4 shadow-lg"
          :class="mobile ? '' : 'fixed bottom-4 right-4'"
          :style="mobile ? {} : { zIndex }"
        >
          <p class="text-sm font-medium">Portal Content</p>
          <p class="mt-1 text-xs text-on-surface-variant">
            z-index: {{ zIndex }} · {{ mobile ? 'inline' : 'teleported to body' }}
          </p>
        </div>
      </template>
    </Portal>
  </div>
</template>
