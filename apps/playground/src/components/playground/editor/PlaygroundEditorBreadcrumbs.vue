<script setup lang="ts">
  // Framework
  import { Breadcrumbs } from '@vuetify/v0'

  // Composables
  import { formatActiveFile } from '@/composables/formatActiveFile'

  // Utilities
  import { toRef } from 'vue'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  const playground = usePlayground()

  const segments = toRef(() => {
    return playground.store.activeFile?.filename?.split('/') ?? []
  })

  function onFormat () {
    void formatActiveFile()
  }
</script>

<template>
  <div class="flex items-center justify-between gap-1 min-h-[24px] border-b border-divider bg-surface">
    <Breadcrumbs.Root
      v-if="playground.isReady.value"
      as="div"
      class="flex items-center min-h-[24px] px-3 text-xs min-w-0"
      label="File path"
    >
      <Breadcrumbs.List class="flex items-center gap-1.5">
        <template
          v-for="(segment, i) in segments"
          :key="i"
        >
          <Breadcrumbs.Divider
            v-if="i > 0"
            class="text-on-surface-variant opacity-40"
          />

          <Breadcrumbs.Item :text="segment">
            <Breadcrumbs.Page
              v-if="i === segments.length - 1"
              class="text-on-surface-variant"
            >
              {{ segment }}
            </Breadcrumbs.Page>

            <Breadcrumbs.Link
              v-else
              as="span"
              class="text-on-surface-variant cursor-default"
            >
              {{ segment }}
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
        </template>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>

    <div v-else class="flex items-center min-h-[24px] px-3">
      <AppSkeleton height="h-2.5" :lines="1" :widths="['w-24']" />
    </div>

    <AppTooltip
      v-if="playground.isReady.value"
      aria-label="Format file"
      class="pa-1 me-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity opacity-50"
      position-area="bottom"
      text="Format"
      @click="onFormat"
    >
      <AppIcon icon="format" :size="14" />
    </AppTooltip>
  </div>
</template>
