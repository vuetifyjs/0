<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Composables
  import { useToc } from '#codex/composables/useToc'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { TocHeading } from '#codex/composables/useToc'
  import type { V0PaperProps } from '@vuetify/paper'
  import type { MaybeRefOrGetter } from 'vue'

  export interface CxTocHeading {
    id: string
    text: string
    level: number
  }

  export interface CxTocProps extends V0PaperProps {
    /** Heading items to render (ignored when container is provided) */
    headings?: CxTocHeading[]
    /** Currently active heading id (ignored when container is provided) */
    activeId?: string
    /** Container element — when provided, headings are auto-scanned via useToc */
    container?: MaybeRefOrGetter<Element | undefined>
    /** Heading selector for auto-scan mode */
    selector?: string
  }

  function flatten (headings: TocHeading[]): CxTocHeading[] {
    const result: CxTocHeading[] = []
    for (const heading of headings) {
      result.push({ id: heading.id, text: heading.text, level: heading.level })
      if (heading.children.length > 0) {
        result.push(...flatten(heading.children))
      }
    }
    return result
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxToc' })

  const {
    headings: propHeadings = [],
    activeId: propActiveId,
    container,
    selector = 'h2[id], h3[id], h4[id]',
    ...paperProps
  } = defineProps<CxTocProps>()

  const emit = defineEmits<{
    select: [id: string]
  }>()

  const toc = container
    ? useToc({ container, selector })
    : undefined

  const headings = toc
    ? toRef(() => flatten(toc.headings.value))
    : toRef(() => propHeadings)

  const activeId = toc
    ? toc.activeId
    : toRef(() => propActiveId)

  function onSelect (id: string) {
    toc?.scrollTo(id)
    emit('select', id)
  }
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    aria-label="Table of contents"
    as="nav"
    class="codex-toc"
  >
    <ul class="codex-toc__list">
      <li
        v-for="heading in headings"
        :key="heading.id"
        class="codex-toc__item"
        :data-active="activeId === heading.id || undefined"
        :data-level="heading.level"
      >
        <a
          :aria-current="activeId === heading.id ? 'location' : undefined"
          class="codex-toc__link"
          :data-active="activeId === heading.id || undefined"
          :href="`#${heading.id}`"
          :style="{ paddingInlineStart: `${(heading.level - 2) * 0.75}rem` }"
          @click.prevent="onSelect(heading.id)"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </V0Paper>
</template>

<style scoped>
  .codex-toc__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .codex-toc__link {
    display: block;
    text-decoration: none;
    color: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
