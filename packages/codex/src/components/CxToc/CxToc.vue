<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxTocHeading {
    id: string
    text: string
    level: number
  }

  export interface CxTocProps extends V0PaperProps {
    /** Heading items to render */
    headings: CxTocHeading[]
    /** Currently active heading id (consumer manages scroll-spy) */
    activeId?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxToc' })

  const {
    headings,
    activeId,
    ...paperProps
  } = defineProps<CxTocProps>()

  const emit = defineEmits<{
    select: [id: string]
  }>()

  function onSelect (id: string) {
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
