<script setup lang="ts">
  // Framework
  import { Breadcrumbs } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { computed } from 'vue'

  const { store } = usePlayground()

  const segments = computed(() => {
    return store.activeFile?.filename?.split('/') ?? []
  })
</script>

<template>
  <Breadcrumbs.Root
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
</template>
