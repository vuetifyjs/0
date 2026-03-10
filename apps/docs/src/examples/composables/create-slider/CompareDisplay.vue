<script setup lang="ts">
  const { split, onPointerdown } = defineProps<{
    split: number
    onPointerdown: (e: PointerEvent) => void
  }>()
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-lg">
    <!-- Light layer (bottom) -->
    <div class="pa-5 bg-background text-on-background" data-theme="light">
      <div class="flex flex-col gap-3">
        <div class="text-lg font-semibold">Theme Preview</div>

        <div class="flex gap-2">
          <div class="rounded-md bg-primary text-on-primary px-3 py-1.5 text-sm font-medium">Primary</div>
          <div class="rounded-md bg-secondary text-on-secondary px-3 py-1.5 text-sm font-medium">Secondary</div>
          <div class="rounded-md bg-error text-on-error px-3 py-1.5 text-sm font-medium">Error</div>
        </div>

        <input
          class="rounded-md bg-surface border border-divider px-3 py-2 text-sm text-on-surface placeholder-on-surface-variant w-full outline-none focus:border-primary"
          placeholder="Search..."
        >

        <div class="rounded-md bg-surface border border-divider pa-3 flex items-center gap-3">
          <div class="size-8 rounded-full bg-primary op-20 flex items-center justify-center text-xs font-semibold text-primary">JD</div>
          <div class="flex-1">
            <div class="text-sm font-medium">Jane Doe</div>
            <div class="text-xs text-on-surface-variant">jane@example.com</div>
          </div>
          <div class="rounded-full bg-success/15 text-success text-xs px-2 py-0.5 font-medium">Active</div>
        </div>

        <div class="flex gap-2">
          <div class="flex-1 rounded-md bg-surface-variant pa-3">
            <div class="text-xs text-on-surface-variant mb-1">Progress</div>
            <div class="h-2 rounded-full bg-surface overflow-hidden">
              <div class="h-full w-2/3 rounded-full bg-primary" />
            </div>
          </div>
          <div class="flex-1 rounded-md bg-surface-variant pa-3">
            <div class="text-xs text-on-surface-variant mb-1">Storage</div>
            <div class="h-2 rounded-full bg-surface overflow-hidden">
              <div class="h-full w-1/3 rounded-full bg-warning" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dark layer (top, clipped) -->
    <div
      class="absolute inset-0 pointer-events-none bg-background text-on-background"
      data-theme="dark"
      :style="{ clipPath: `inset(-1px -1px -1px ${split}%)` }"
    >
      <div class="pa-5 h-full">
        <div class="flex flex-col gap-3">
          <div class="text-lg font-semibold">Theme Preview</div>

          <div class="flex gap-2">
            <div class="rounded-md bg-primary text-on-primary px-3 py-1.5 text-sm font-medium">Primary</div>
            <div class="rounded-md bg-secondary text-on-secondary px-3 py-1.5 text-sm font-medium">Secondary</div>
            <div class="rounded-md bg-error text-on-error px-3 py-1.5 text-sm font-medium">Error</div>
          </div>

          <input
            class="rounded-md bg-surface border border-divider px-3 py-2 text-sm text-on-surface placeholder-on-surface-variant w-full outline-none focus:border-primary"
            placeholder="Search..."
            tabindex="-1"
          >

          <div class="rounded-md bg-surface border border-divider pa-3 flex items-center gap-3">
            <div class="size-8 rounded-full bg-primary op-20 flex items-center justify-center text-xs font-semibold text-primary">JD</div>
            <div class="flex-1">
              <div class="text-sm font-medium">Jane Doe</div>
              <div class="text-xs text-on-surface-variant">jane@example.com</div>
            </div>
            <div class="rounded-full bg-success/15 text-success text-xs px-2 py-0.5 font-medium">Active</div>
          </div>

          <div class="flex gap-2">
            <div class="flex-1 rounded-md bg-surface-variant pa-3">
              <div class="text-xs text-on-surface-variant mb-1">Progress</div>
              <div class="h-2 rounded-full bg-surface overflow-hidden">
                <div class="h-full w-2/3 rounded-full bg-primary" />
              </div>
            </div>
            <div class="flex-1 rounded-md bg-surface-variant pa-3">
              <div class="text-xs text-on-surface-variant mb-1">Storage</div>
              <div class="h-2 rounded-full bg-surface overflow-hidden">
                <div class="h-full w-1/3 rounded-full bg-warning" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Divider handle -->
    <div
      class="absolute inset-y-0 z-10 flex items-center -translate-x-1/2 cursor-col-resize"
      :style="{ left: `${split}%` }"
      @pointerdown="onPointerdown"
    >
      <div class="absolute inset-y-0 left-1/2 w-0.5 bg-white/80 -translate-x-1/2" />
      <div class="relative size-8 rounded-full bg-white shadow-md flex items-center justify-center">
        <span class="text-xs text-neutral-500 select-none">⇔</span>
      </div>
    </div>
  </div>
</template>
