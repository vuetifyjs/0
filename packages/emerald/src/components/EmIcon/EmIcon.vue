<script lang="ts">
  // Framework
  import { useLogger } from '@vuetify/v0'
  import { isArray } from '@vuetify/v0/utilities'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { EmIconGlyph } from '../../icons'

  // Icons
  import { useEmIcons } from '../../icons'

  export type EmIconSize = 's' | 'm' | 'l' | 'xl'

  export interface EmIconProps {
    /** Role to draw — resolved through the icon registry, aliases included. */
    name: string
    /**
     * Accessible name. Set it only when the icon is the whole message; an icon
     * sitting next to its own label, or inside a labelled button, wants the
     * default (hidden from assistive tech) so the name is not announced twice.
     */
    label?: string
    /** Maps to the `--emerald-icon-*` scale. */
    size?: EmIconSize
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmIcon' })

  const { name, label, size = 'm', namespace } = defineProps<EmIconProps>()

  const icons = useEmIcons(namespace)
  const logger = useLogger()

  const paths = toRef(() => {
    const glyph = icons.resolve<EmIconGlyph>(name)

    if (!isArray(glyph)) {
      // Rendering nothing is the honest failure: a placeholder box would ship
      // to production looking deliberate.
      if (__DEV__) logger.warn(`[EmIcon] no glyph registered for role "${name}"`)

      return []
    }

    return glyph
  })
</script>

<template>
  <svg
    v-if="paths.length > 0"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label"
    class="emerald-icon"
    :data-size="size"
    fill="none"
    :role="label ? 'img' : undefined"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
  >
    <path v-for="d in paths" :key="d" :d />
  </svg>
</template>

<style>
  .emerald-icon {
    display: inline-block;
    flex-shrink: 0;
    width: var(--emerald-icon-m, 20px);
    height: var(--emerald-icon-m, 20px);
    /* Set in CSS, not as an attribute, so a host class can restroke a glyph
       without the component growing a prop for it. */
    stroke-width: var(--emerald-icon-stroke, 1.75);
    vertical-align: middle;
  }

  .emerald-icon[data-size='s'] {
    width: var(--emerald-icon-s, 18px);
    height: var(--emerald-icon-s, 18px);
  }

  .emerald-icon[data-size='l'] {
    width: var(--emerald-icon-l, 24px);
    height: var(--emerald-icon-l, 24px);
  }

  .emerald-icon[data-size='xl'] {
    width: var(--emerald-icon-xl, 32px);
    height: var(--emerald-icon-xl, 32px);
  }
</style>
