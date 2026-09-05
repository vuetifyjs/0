<script setup lang="ts">
  import { OverlayPanel, Scrim } from '@vuetify/v0'
</script>

<template>
  <div class="flex justify-center">
    <OverlayPanel.Root>
      <OverlayPanel.Activator class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium">
        Open Drawer
      </OverlayPanel.Activator>

      <Scrim />

      <OverlayPanel.Content
        class="fixed top-0 right-0 h-full w-80 bg-surface border-l border-divider shadow-lg transform transition-transform"
        scrim
      >
        <div class="px-4 py-3 border-b border-divider flex items-center justify-between">
          <h3 class="text-lg font-semibold text-on-surface">
            Side Drawer
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
            This drawer slides in from the right side. Position is controlled entirely by CSS — OverlayPanel
            handles the portal, z-index, and dismissal behaviors.
          </p>

          <nav class="space-y-1">
            <a class="block px-3 py-2 text-sm rounded-md hover:bg-surface-tint text-on-surface" href="#">
              Dashboard
            </a>

            <a class="block px-3 py-2 text-sm rounded-md hover:bg-surface-tint text-on-surface" href="#">
              Settings
            </a>

            <a class="block px-3 py-2 text-sm rounded-md hover:bg-surface-tint text-on-surface" href="#">
              Profile
            </a>
          </nav>
        </div>
      </OverlayPanel.Content>
    </OverlayPanel.Root>
  </div>
</template>
