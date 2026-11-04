<script setup lang="ts">
  // Framework
  import { isNullOrUndefined, Tooltip } from '@vuetify/v0'

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
    const lines = coverage.lines?.length ?? 0
    const rows = coverage.rows?.length ?? 0
    return !isNullOrUndefined(coverage.detail) || lines > 0 || rows > 0
  })

  // A tooltip, not a popover, so this panel shares the docs tooltip region.
  // Once it is open, moving to a neighboring meta tooltip skips that tooltip's
  // open delay. open-delay 0 keeps this panel itself immediate.
  watch(() => resolved.value?.label, () => {
    open.value = false
  })
</script>

<template>
  <Tooltip.Root
    v-if="resolved && interactive"
    v-model="open"
    interactive
    :open-delay="0"
    position-area="top span-right"
    position-try="top span-right, top span-left, bottom span-right, bottom span-left"
  >
    <Tooltip.Activator
      class="docs-meta-item icon-text cursor-pointer appearance-none border-0 bg-transparent p-0 font-inherit text-inherit transition-colors hover:text-on-surface"
    >
      <AppIcon :class="resolved.color" icon="test" size="1em" />
      <span>{{ resolved.label }}</span>
    </Tooltip.Activator>

    <Tooltip.Content
      class="max-w-72 whitespace-normal rounded border border-divider bg-surface px-2 pt-1 pb-2 text-xs text-on-surface shadow-lg"
      :style="{ margin: '6px 0' }"
    >
      <div class="flex flex-col gap-2">
        <span>
          <span :class="resolved.color">{{ resolved.value }}%</span> coverage
        </span>

        <div
          v-if="resolved.detail || resolved.lines?.length"
          class="text-on-surface-variant"
          :class="resolved.rows?.length ? '-mx-2 border-b border-divider px-2 pb-2' : undefined"
        >
          <div v-if="resolved.detail" class="font-bold text-on-surface">{{ resolved.detail }}</div>

          <ul class="m-0 list-none p-0">
            <li v-for="line in resolved.lines" :key="line">{{ line }}</li>
          </ul>
        </div>

        <ul class="m-0 flex list-none flex-col gap-2 p-0">
          <li
            v-for="row in resolved.rows"
            :key="row.label"
            class="flex gap-2"
          >
            <span class="w-[5.5rem] shrink-0 text-on-surface-variant">{{ row.label }}</span>

            <ul class="m-0 min-w-0 list-none p-0">
              <li v-for="file in row.files" :key="file.href">
                <a
                  class="text-primary hover:underline"
                  :href="file.href"
                  rel="noopener noreferrer"
                  target="_blank"
                >{{ file.name }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </Tooltip.Content>
  </Tooltip.Root>

  <DocsMetaItem
    v-else-if="resolved"
    :color="resolved.color"
    icon="test"
    :text="resolved.label"
  />
</template>
