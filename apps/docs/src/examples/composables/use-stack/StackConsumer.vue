<script setup lang="ts">
  import { useHotkey, useStack } from '@vuetify/v0'
  import { computed, watch } from 'vue'
  import { useOverlays } from './context'

  const { overlays, activeCount, open, close, closeAll } = useOverlays()

  // Color schemes for each overlay
  const colors = [
    { accent: 'text-blue-500', bg: 'bg-blue-500', badge: 'bg-blue-500/10 text-blue-500' },
    { accent: 'text-purple-500', bg: 'bg-purple-500', badge: 'bg-purple-500/10 text-purple-500' },
    { accent: 'text-amber-500', bg: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-500' },
  ]

  const stack = useStack()

  // Register each overlay with the stack and sync selection with isOpen
  const tickets = overlays.map((overlay, index) => {
    const ticket = stack.register({
      id: overlay.id,
      onDismiss: () => close(overlay.id),
      blocking: overlay.blocking,
    })

    // Sync selection state with isOpen
    watch(overlay.isOpen, isOpen => {
      if (isOpen) {
        ticket.select()
      } else {
        ticket.unselect()
      }
    }, { immediate: true })

    return {
      overlay,
      ticket,
      color: colors[index % colors.length]!,
    }
  })

  // Find next closed overlay to open from within an overlay
  const nextClosed = computed(() =>
    overlays.find(o => !o.isOpen.value),
  )

  // Escape key dismisses the topmost non-blocking overlay
  useHotkey('Escape', () => {
    const topTicket = tickets.find(t => t.ticket.globalTop.value)
    if (topTicket && !topTicket.overlay.blocking) {
      close(topTicket.overlay.id)
    }
  })
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Controls -->
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-3 gap-3 max-w-md mx-auto">
        <button
          v-for="({ overlay }, index) in tickets"
          :key="overlay.id"
          class="px-4 py-2 text-sm font-medium rounded-md transition-colors text-center"
          :class="[
            overlay.isOpen.value
              ? `${colors[index]!.bg} text-white border border-transparent`
              : 'border border-divider hover:bg-surface-tint'
          ]"
          @click="overlay.isOpen.value ? close(overlay.id) : open(overlay.id)"
        >
          {{ overlay.title }}
        </button>
      </div>

      <!-- Stack visualization -->
      <div class="flex items-center justify-center gap-2 text-sm h-6">
        <span class="text-on-surface-variant">Stack:</span>
        <div class="flex items-center gap-1">
          <template v-if="activeCount > 0">
            <template v-for="({ overlay, ticket }, index) in tickets" :key="overlay.id">
              <span
                v-if="overlay.isOpen.value"
                class="px-2 py-0.5 rounded text-xs font-mono"
                :class="colors[index]!.badge"
              >
                {{ ticket.zIndex.value }}
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
        <template v-for="({ overlay, ticket, color }, index) in tickets" :key="overlay.id">
          <div
            v-if="overlay.isOpen.value"
            :aria-describedby="`${ticket.id}-desc`"
            :aria-labelledby="`${ticket.id}-title`"
            aria-modal="true"
            class="fixed inset-0 flex items-center justify-center pointer-events-none p-4"
            role="dialog"
            :style="{
              zIndex: ticket.zIndex.value,
              transform: `translate(${index * 16}px, ${index * 16}px)`,
            }"
          >
            <div
              class="m-auto rounded-xl bg-surface border border-divider max-w-md w-full pointer-events-auto transition-all duration-200"
              :class="ticket.globalTop.value ? 'shadow-xl' : 'shadow-lg opacity-95'"
            >
              <!-- Header -->
              <div class="px-4 py-3 border-b border-divider">
                <div class="flex items-center justify-between">
                  <h3 :id="`${ticket.id}-title`" class="text-lg font-semibold text-on-surface">
                    {{ overlay.title }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-xs font-mono" :class="color.badge">
                      z:{{ ticket.zIndex.value }}
                    </span>
                    <span
                      class="px-2 py-0.5 rounded text-xs"
                      :class="ticket.globalTop.value ? 'bg-success/10 text-success' : 'bg-surface-variant text-on-surface-variant'"
                    >
                      {{ ticket.globalTop.value ? 'top' : 'behind' }}
                    </span>
                  </div>
                </div>
                <p class="text-sm text-on-surface-variant mt-1">
                  Overlay {{ index + 1 }} of 3 in the stack
                </p>
              </div>

              <!-- Content -->
              <div class="p-4 space-y-4">
                <p :id="`${ticket.id}-desc`" class="text-sm text-on-surface leading-relaxed">
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
