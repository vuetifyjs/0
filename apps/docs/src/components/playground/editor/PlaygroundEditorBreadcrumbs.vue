<script setup lang="ts">
  // Framework
  import { Breadcrumbs } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { toRef } from 'vue'

  const playground = usePlayground()

  const segments = toRef(() => {
    return playground.store.activeFile?.filename?.split('/') ?? []
  })
</script>

<template>
  <Breadcrumbs.Root
    v-if="playground.isReady.value"
    as="div"
    class="flex items-center min-h-[24px] px-3 border-b border-divider bg-surface text-xs"
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

  <div v-else class="flex items-center min-h-[24px] px-3 border-b border-divider bg-surface">
    <DocsSkeleton :lines="1" height="h-2.5" :widths="['w-24']" />
  </div>
</template>
