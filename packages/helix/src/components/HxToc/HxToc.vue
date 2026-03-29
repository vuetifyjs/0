<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Composables
  import { useToc } from '#helix/composables/useToc'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { TocHeading } from '#helix/composables/useToc'
  import type { V0PaperProps } from '@vuetify/paper'
  import type { MaybeRefOrGetter } from 'vue'

  export interface HxTocProps extends V0PaperProps {
    /** Pre-built heading tree (ignored when container is provided) */
    headings?: TocHeading[]
    /** Currently active heading id (ignored when container is provided) */
    activeId?: string
    /** Container element — when provided, headings are auto-scanned via useToc */
    container?: MaybeRefOrGetter<Element | undefined>
    /** Heading selector for auto-scan mode */
    selector?: string
    /** Label for the TOC header */
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxToc' })

  const {
    headings: propHeadings = [],
    activeId: propActiveId,
    container,
    selector = 'h2[id], h3[id], h4[id]',
    label = 'On this page',
    ...paperProps
  } = defineProps<HxTocProps>()

  const emit = defineEmits<{
    select: [id: string]
  }>()

  const toc = container
    ? useToc({ container, selector })
    : undefined

  const headings = toc
    ? toc.headings
    : toRef(() => propHeadings)

  const selectedId = toc
    ? toc.activeId
    : toRef(() => propActiveId)

  function onSelect (id: string) {
    toc?.scrollTo(id)
    emit('select', id)
  }

  function isActive (heading: TocHeading): boolean {
    if (selectedId.value === heading.id) return true
    return heading.children.some(child =>
      child.id === selectedId.value || child.children.some(gc => gc.id === selectedId.value),
    )
  }
</script>

<template>
  <V0Paper
    v-if="headings.length > 0"
    v-bind="paperProps"
    as="aside"
    class="helix-toc"
  >
    <slot name="header">
      <span class="helix-toc__label">{{ label }}</span>
    </slot>

    <nav aria-label="Table of contents">
      <!-- h2 level -->
      <ul class="helix-toc__list">
        <li v-for="h2 in headings" :key="h2.id">
          <a
            :aria-current="selectedId === h2.id ? 'location' : undefined"
            class="helix-toc__link"
            :data-active="selectedId === h2.id || undefined"
            :href="`#${h2.id}`"
            @click.prevent="onSelect(h2.id)"
          >
            {{ h2.text }}
          </a>

          <!-- h3 level -->
          <ul
            v-if="h2.children.length > 0"
            class="helix-toc__list helix-toc__list--nested"
            :data-parent-active="isActive(h2) || undefined"
          >
            <li v-for="h3 in h2.children" :key="h3.id">
              <a
                :aria-current="selectedId === h3.id ? 'location' : undefined"
                class="helix-toc__link helix-toc__link--sub"
                :data-active="selectedId === h3.id || undefined"
                :href="`#${h3.id}`"
                @click.prevent="onSelect(h3.id)"
              >
                {{ h3.text }}
              </a>

              <!-- h4 level -->
              <ul v-if="h3.children.length > 0" class="helix-toc__list helix-toc__list--deep">
                <li v-for="h4 in h3.children" :key="h4.id">
                  <a
                    :aria-current="selectedId === h4.id ? 'location' : undefined"
                    class="helix-toc__link helix-toc__link--sub"
                    :data-active="selectedId === h4.id || undefined"
                    :href="`#${h4.id}`"
                    @click.prevent="onSelect(h4.id)"
                  >
                    {{ h4.text }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </V0Paper>
</template>

<style scoped>
  .helix-toc__label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--v0-on-surface);
    margin-bottom: 0.5rem;
  }

  .helix-toc__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .helix-toc__list--nested {
    margin-inline-start: 0.75rem;
    transition: opacity 0.15s;
  }

  .helix-toc__list--nested:not([data-parent-active]) {
    opacity: 0.6;
  }

  .helix-toc__list--deep {
    margin-inline-start: 0.75rem;
  }

  .helix-toc__link {
    display: block;
    padding: 0.125rem 0.25rem;
    text-decoration: none;
    color: var(--v0-on-surface-variant);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 0.25rem;
    transition: color 150ms ease;
  }

  .helix-toc__link:hover {
    color: var(--v0-primary);
  }

  .helix-toc__link:focus-visible {
    outline: 2px solid var(--v0-primary);
    outline-offset: -2px;
  }

  .helix-toc__link[data-active] {
    color: var(--v0-primary);
    font-weight: 600;
  }

  .helix-toc__link--sub {
    font-size: 0.75rem;
  }
</style>
