<script lang="ts">
  // Framework
  import { useLogger } from '@vuetify/v0'
  import { isArray } from '@vuetify/v0/utilities'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { EmIconGlyph, EmIconName } from '../../icons'

  // Icons
  import { useEmIcons } from '../../icons'

  export type EmIconSize = 's' | 'm' | 'l' | 'xl'

  export interface EmIconProps {
    /** Role to draw — resolved through the icon registry, aliases included. */
    name: EmIconName
    /**
     * Accessible name. Set it only when the icon is the whole message; an icon
     * sitting next to its own label, or inside a labelled button, wants the
     * default (hidden from assistive tech) so the name is not announced twice.
     */
    label?: string
    /** Maps to the `--emerald-icon-*` scale. */
    size?: EmIconSize
    /**
     * Registry to resolve against. Only needed when a subtree was given its own
     * set via `provideEmIcons` under a non-default namespace.
     */
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
  /*
   * Size and stroke both route through custom properties rather than being set
   * directly, so a host class can retune a glyph it embeds — the control sizes
   * an icon sits inside do not all land on the token scale.
   */
  .emerald-icon {
    display: inline-block;
    flex-shrink: 0;
    width: var(--emerald-icon-size, var(--emerald-icon-m, 20px));
    height: var(--emerald-icon-size, var(--emerald-icon-m, 20px));
    stroke-width: var(--emerald-icon-stroke, 1.75);
    vertical-align: middle;
  }

  /*
   * Wrapped in :where() to strip these to zero specificity: the `size` prop is
   * the default, and a single-class host rule outranks it without needing
   * !important or a contrived selector.
   */
  :where(.emerald-icon[data-size='s']) {
    --emerald-icon-size: var(--emerald-icon-s, 18px);
  }

  :where(.emerald-icon[data-size='m']) {
    --emerald-icon-size: var(--emerald-icon-m, 20px);
  }

  :where(.emerald-icon[data-size='l']) {
    --emerald-icon-size: var(--emerald-icon-l, 24px);
  }

  :where(.emerald-icon[data-size='xl']) {
    --emerald-icon-size: var(--emerald-icon-xl, 32px);
  }
</style>
