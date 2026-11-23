<script setup lang="ts">
  import { ScrollArea } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import StyledScrollbar from './StyledScrollbar.vue'

  import type { ScrollAreaVisibility } from '@vuetify/v0'

  const modes: ScrollAreaVisibility[] = ['hover', 'scroll', 'auto', 'always']
  const visibility = shallowRef<ScrollAreaVisibility>('hover')

  const rows = Array.from({ length: 30 }, (_, row) => row + 1)
  const columns = Array.from({ length: 12 }, (_, column) => String.fromCodePoint(65 + column))
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="mode in modes"
        :key="mode"
        class="px-3 py-1 text-sm rounded-md border border-divider data-[active]:bg-primary data-[active]:text-on-primary"
        :data-active="mode === visibility || undefined"
        type="button"
        @click="visibility = mode"
      >
        {{ mode }}
      </button>
    </div>

    <ScrollArea.Root
      class="h-72 w-full max-w-md border border-divider rounded-lg bg-surface"
      :delay="800"
      :visibility
    >
      <ScrollArea.Viewport class="size-full">
        <table class="text-sm text-on-surface-variant">
          <tbody>
            <tr v-for="row in rows" :key="row" class="border-b border-divider">
              <td
                v-for="column in columns"
                :key="column"
                class="px-4 py-2 whitespace-nowrap"
              >
                {{ column }}{{ row }}
              </td>
            </tr>
          </tbody>
        </table>
      </ScrollArea.Viewport>

      <StyledScrollbar orientation="vertical" />

      <StyledScrollbar orientation="horizontal" />

      <ScrollArea.Corner class="bg-surface-variant/40" />
    </ScrollArea.Root>
  </div>
</template>
