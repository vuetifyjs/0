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
        @click="show = true"
      >
        Show overlay
      </button>

      <span class="text-sm text-on-surface-variant">
        {{ mobile ? 'Mobile — renders inline below' : 'Desktop — teleported to body' }}
      </span>
    </div>

    <Portal v-if="show" :disabled="mobile" @close="show = false">
      <template #default="{ zIndex, close }">
        <div
          class="rounded-lg bg-surface-variant p-4 shadow-lg"
          :class="mobile ? '' : 'fixed bottom-4 right-4'"
          :style="mobile ? {} : { zIndex }"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium">Portal Content</p>

              <p class="mt-1 text-xs text-on-surface-variant">
                z-index: {{ zIndex }} · {{ mobile ? 'inline' : 'teleported' }}
              </p>
            </div>

            <button
              class="rounded px-2 py-1 text-xs text-on-surface-variant hover:bg-surface hover:text-on-surface"
              @click="close"
            >
              close
            </button>
          </div>
        </div>
      </template>
    </Portal>
  </div>
</template>
