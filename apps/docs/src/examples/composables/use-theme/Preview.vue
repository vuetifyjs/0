<script setup lang="ts">
  import type { Colors } from '@vuetify/v0'

  const { colors } = defineProps<{
    colors: Colors
  }>()
</script>

<template>
  <div
    class="rounded-lg overflow-hidden transition-colors duration-300"
    :style="{ backgroundColor: colors.card, color: colors.text }"
  >
    <div class="pa-4 space-y-3">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="size-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            :style="{ backgroundColor: colors.primary }"
          >
            A
          </div>

          <div>
            <div class="text-sm font-medium">Alex Chen</div>
            <div class="text-xs" :style="{ color: colors.muted }">alex@example.com</div>
          </div>
        </div>

        <div
          class="text-xs font-medium px-2 py-0.5 rounded-full"
          :style="{ backgroundColor: colors.primary + '20', color: colors.primary }"
        >
          Online
        </div>
      </div>

      <!-- Progress -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <div class="text-xs font-medium">Sprint progress</div>
          <div class="text-xs" :style="{ color: colors.muted }">68%</div>
        </div>

        <div class="h-1.5 rounded-full overflow-hidden" :style="{ backgroundColor: colors.muted + '30' }">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: '68%', backgroundColor: colors.primary }"
          />
        </div>
      </div>

      <!-- Tags -->
      <div class="flex gap-1.5">
        <span
          class="text-xs px-2 py-0.5 rounded-md font-medium"
          :style="{ backgroundColor: colors.primary + '15', color: colors.primary }"
        >
          Design
        </span>

        <span
          class="text-xs px-2 py-0.5 rounded-md font-medium"
          :style="{ backgroundColor: colors.accent + '15', color: colors.accent }"
        >
          Frontend
        </span>

        <span
          class="text-xs px-2 py-0.5 rounded-md font-medium"
          :style="{ backgroundColor: colors.muted + '20', color: colors.muted }"
        >
          Q2
        </span>
      </div>
    </div>
  </div>
</template>
