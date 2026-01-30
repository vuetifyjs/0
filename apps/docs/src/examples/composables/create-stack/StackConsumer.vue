<script setup lang="ts">
  import { useStack } from '@vuetify/v0'
  import { computed } from 'vue'
  import { useOverlays } from './context'

  const { overlays, activeCount, open, close, closeAll } = useOverlays()

  // Color schemes for each overlay
  const colors = [
    { accent: 'text-blue-500', bg: 'bg-blue-500', badge: 'bg-blue-500/10 text-blue-500' },
    { accent: 'text-purple-500', bg: 'bg-purple-500', badge: 'bg-purple-500/10 text-purple-500' },
    { accent: 'text-amber-500', bg: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-500' },
  ]

  // Create stack entries for each overlay
  const stacks = overlays.map((overlay, index) => ({
    overlay,
    color: colors[index % colors.length]!,
    ...useStack(overlay.isOpen, {
      onDismiss: () => close(overlay.id),
      blocking: overlay.blocking,
    }),
  }))

  // Find next closed overlay to open from within an overlay
  const nextClosed = computed(() =>
    overlays.find(o => !o.isOpen.value),
  )
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Controls -->
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-3 gap-3 max-w-md mx-auto">
        <button
          v-for="(stack, index) in stacks"
          :key="stack.overlay.id"
          class="px-4 py-2 text-sm font-medium rounded-md transition-colors text-center"
          :class="[
            stack.overlay.isOpen.value
              ? `${colors[index]!.bg} text-white border border-transparent`
              : 'border border-divider hover:bg-surface-tint'
          ]"
          @click="stack.overlay.isOpen.value ? close(stack.overlay.id) : open(stack.overlay.id)"
        >
          {{ stack.overlay.title }}
        </button>
      </div>

      <!-- Stack visualization -->
      <div class="flex items-center justify-center gap-2 text-sm h-6">
        <span class="text-on-surface-variant">Stack:</span>
        <div class="flex items-center gap-1">
          <template v-if="activeCount > 0">
            <template v-for="(stack, index) in stacks" :key="stack.overlay.id">
              <span
                v-if="stack.overlay.isOpen.value"
                class="px-2 py-0.5 rounded text-xs font-mono"
                :class="colors[index]!.badge"
              >
                {{ stack.zIndex.value }}
              </span>
            </template>
          </template>
          <span v-else class="text-on-surface-variant/50 italic">empty</span>
        </div>
      </div>
    </div>

    <!-- Overlays -->
    <Teleport to="body">
      <TransitionGroup name="modal">
        <template v-for="({ overlay, color, styles, globalTop, zIndex }, index) in stacks" :key="overlay.id">
          <div
            v-if="overlay.isOpen.value"
            class="fixed inset-0 flex items-center justify-center pointer-events-none p-4"
            :style="{
              ...styles.value,
              transform: `translate(${index * 16}px, ${index * 16}px)`,
            }"
          >
            <div
              class="m-auto rounded-xl bg-surface border border-divider max-w-md w-full pointer-events-auto transition-all duration-200"
              :class="globalTop ? 'shadow-xl' : 'shadow-lg opacity-95'"
            >
              <!-- Header -->
              <div class="px-4 py-3 border-b border-divider">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-on-surface">
                    {{ overlay.title }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-xs font-mono" :class="color.badge">
                      z:{{ zIndex.value }}
                    </span>
                    <span
                      class="px-2 py-0.5 rounded text-xs"
                      :class="globalTop ? 'bg-success/10 text-success' : 'bg-surface-variant text-on-surface-variant'"
                    >
                      {{ globalTop ? 'top' : 'behind' }}
                    </span>
                  </div>
                </div>
                <p class="text-sm text-on-surface-variant mt-1">
                  Overlay {{ index + 1 }} of 3 in the stack
                </p>
              </div>

              <!-- Content -->
              <div class="p-4 space-y-4">
                <p class="text-sm text-on-surface leading-relaxed">
                  This overlay demonstrates z-index stacking. Open multiple overlays
                  to see how they layer. The topmost overlay receives focus and
                  handles the escape key.
                </p>

                <div
                  v-if="overlay.blocking"
                  class="px-3 py-2 rounded-md bg-warning/10 border border-warning/20 text-warning text-sm"
                >
                  Blocking mode — clicking the scrim won't close this overlay.
                </div>

                <button
                  v-if="nextClosed"
                  class="w-full px-4 py-2 text-sm font-medium rounded-md transition-colors"
                  :class="`${color.bg} text-white hover:opacity-90`"
                  @click="open(nextClosed.id)"
                >
                  Open {{ nextClosed.title }}
                </button>
              </div>

              <!-- Footer -->
              <div class="flex gap-3 justify-end p-4 pt-0">
                <button
                  v-if="activeCount > 1"
                  class="px-4 py-2 text-sm font-medium rounded-md text-error hover:bg-error/10 transition-colors"
                  @click="closeAll"
                >
                  Close All
                </button>
                <button
                  class="px-4 py-2 text-sm font-medium rounded-md border border-divider hover:bg-surface-tint transition-colors"
                  @click="close(overlay.id)"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </template>
      </TransitionGroup>
    </Teleport>
  </div>
</template>

<style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.2s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-from > div,
  .modal-leave-to > div {
    transform: scale(0.95);
  }
</style>
