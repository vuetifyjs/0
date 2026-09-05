<script setup lang="ts">
  import { OverlayPanel } from '@vuetify/v0'
</script>

<template>
  <div class="flex justify-center">
    <OverlayPanel.Root>
      <OverlayPanel.Activator class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium">
        Open Panel
      </OverlayPanel.Activator>

      <OverlayPanel.Content
        aria-label="Overlay panel"
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface border border-divider max-w-md w-full shadow-lg"
      >
        <div class="px-4 py-3 border-b border-divider flex items-center justify-between">
          <h3 class="text-lg font-semibold text-on-surface">
            Panel Title
          </h3>

          <OverlayPanel.Close class="p-1 rounded hover:bg-surface-tint text-on-surface-variant">
            <svg
              fill="none"
              height="20"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </OverlayPanel.Close>
        </div>

        <div class="p-4 space-y-4">
          <p class="text-sm text-on-surface leading-relaxed">
            This is a basic overlay panel. It renders via a portal, coordinates z-index with other overlays,
            and can be closed by clicking outside or pressing Escape.
          </p>

          <p class="text-sm text-on-surface-variant">
            Unlike Dialog, this panel is non-modal — you can still interact with the page behind it.
          </p>
        </div>

        <div class="flex gap-3 justify-end p-4 pt-0">
          <OverlayPanel.Close class="px-4 py-2 text-sm font-medium rounded-md border border-divider hover:bg-surface-tint">
            Close
          </OverlayPanel.Close>
        </div>
      </OverlayPanel.Content>
    </OverlayPanel.Root>
  </div>
</template>
