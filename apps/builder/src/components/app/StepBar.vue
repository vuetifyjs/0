<script setup lang="ts">
  // Framework
  import { isUndefined, Progress } from '@vuetify/v0'

  const { progress, progressLabel } = defineProps<{
    /** Wizard completion, 0-100. Omit to render the bar with no progress hairline. */
    progress?: number
    /** Accessible name conveying position in the wizard, e.g. "Step 2 of 5". */
    progressLabel?: string
  }>()
</script>

<template>
  <!-- Step navigation is app chrome, not page content: it is pinned to the viewport and
       spans the full width — including over the preview aside — so it mirrors the header
       at the other end of the screen. AppShell shortens the aside's scroll area to match,
       so nothing ends up underneath it. -->
  <div class="fixed inset-x-0 bottom-0 z-30 border-t border-divider bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
    <!-- Overlays the border above rather than adding to the bar's height, so AppShell's
         aside-height accounting (which only knows about the 1px border) stays correct. -->
    <Progress.Root
      v-if="!isUndefined(progress)"
      :aria-label="progressLabel"
      class="absolute inset-x-0 -top-px"
      :model-value="progress"
    >
      <Progress.Track class="block h-[3px] w-full overflow-hidden bg-divider/60">
        <Progress.Fill class="h-full bg-primary transition-[width] duration-200" />
      </Progress.Track>
    </Progress.Root>

    <!-- min-h-16 sets the row at 4rem; py-2.5 leaves the 40px buttons room to spare inside
         it. Total bar height is therefore 4rem + the 1px border above — which is what
         AppShell subtracts from the aside. -->
    <div class="px-4 sm:px-6 min-h-16 py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <slot />
    </div>
  </div>
</template>
