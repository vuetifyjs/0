<script setup lang="ts">
  // Framework
  import { isNullOrUndefined, Popover } from '@vuetify/v0'

  // Composables
  import { usePageMetaOptional, type CoverageConfig } from '@/composables/usePageMeta'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  const props = defineProps<{
    coverage?: CoverageConfig | null
  }>()

  const pageMeta = usePageMetaOptional()
  const open = shallowRef(false)

  const resolved = toRef(() => props.coverage ?? pageMeta?.coverage.value ?? null)
  const interactive = toRef(() => {
    const coverage = resolved.value
    if (!coverage) return false
    return !isNullOrUndefined(coverage.detail) || (coverage.rows?.length ?? 0) > 0
  })

  watch(() => resolved.value?.label, () => {
    open.value = false
  })
</script>

<template>
  <Popover.Root v-if="resolved && interactive" v-model="open">
    <Popover.Activator
      class="docs-meta-item icon-text cursor-pointer appearance-none border-0 bg-transparent p-0 font-inherit text-inherit transition-colors hover:text-on-surface"
    >
      <AppIcon :class="resolved.color" icon="test" size="1em" />
      <span>{{ resolved.label }}</span>
    </Popover.Activator>

    <Popover.Content
      class="max-w-72 whitespace-normal rounded border border-divider bg-surface px-2 py-1 text-xs text-on-surface shadow-lg"
      position-area="bottom span-right"
      position-try="bottom span-right, bottom span-left, top span-right, top span-left"
      :style="{ margin: '6px 0' }"
    >
      <div class="flex flex-col gap-2">
        <span>{{ resolved.label }}</span>
        <span v-if="resolved.detail" class="text-on-surface-variant">{{ resolved.detail }}</span>

        <div
          v-for="row in resolved.rows"
          :key="row.label"
          class="flex gap-2"
        >
          <span class="w-[5.5rem] shrink-0 text-on-surface-variant">{{ row.label }}</span>

          <span class="flex min-w-0 flex-col gap-1">
            <a
              v-for="file in row.files"
              :key="file.href"
              class="text-primary hover:underline"
              :href="file.href"
              rel="noopener noreferrer"
              target="_blank"
            >{{ file.name }}</a>
          </span>
        </div>
      </div>
    </Popover.Content>
  </Popover.Root>

  <DocsMetaItem
    v-else-if="resolved"
    :color="resolved.color"
    icon="test"
    :text="resolved.label"
  />
</template>
