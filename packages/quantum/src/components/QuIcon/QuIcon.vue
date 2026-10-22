<script lang="ts">
  // Framework
  import { isArray, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { QuIconGlyph, QuIconName, QuIconsContext } from '../../icons'

  // Icons
  import { quantumIconMirrors, useQuIcons } from '../../icons'

  /** `m` is the 24 dp system icon; `s` is the 20 dp dense form for mouse and keyboard layouts. */
  export type QuIconSize = 'm' | 's'

  export interface QuIconProps {
    /** Role to draw, resolved through the icon registry, aliases included. */
    name: QuIconName
    /**
     * Accessible name. Set it only when the icon is the whole message; an icon
     * sitting next to its own label, or inside a labelled button, wants the
     * default (hidden from assistive tech) so the name is not announced twice.
     */
    label?: string
    /** The MD1 system icon sizes: 24 dp, or 20 dp dense. */
    size?: QuIconSize
    /**
     * Registry to resolve against. Only needed when a subtree was given its own
     * set under a non-default namespace, via `createQuantumIconsPlugin` or
     * `createQuantumIconsContext`.
     */
    namespace?: string
  }

  type QuIconMirror = true | 'conditional'

  const MIRRORS = new Map<string, QuIconMirror>(Object.entries(quantumIconMirrors))

  /**
   * Follows `{role}` references to the role that owns the artwork, so an alias,
   * built in or consumer registered, inherits that role's mirror ruling.
   */
  function canonical (icons: QuIconsContext, name: string): string {
    const visited = new Set<string>()
    let role = name

    while (!visited.has(role)) {
      visited.add(role)

      const value = icons.get(role)?.value

      if (!icons.isAlias(value)) break

      role = value.slice(1, -1)
    }

    return role
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuIcon' })

  const { name, label, size = 'm', namespace } = defineProps<QuIconProps>()

  const icons = useQuIcons(namespace)
  const logger = useLogger()

  const paths = toRef(() => {
    const glyph = icons.resolve<QuIconGlyph>(name)

    if (!isArray(glyph)) {
      // Rendering nothing is the honest failure: a placeholder box would ship
      // to production looking deliberate.
      if (__DEV__) logger.warn(`[QuIcon] no glyph registered for role "${name}"`)

      return []
    }

    return glyph
  })

  const mirror = toRef(() => MIRRORS.get(canonical(icons, name)))
</script>

<template>
  <svg
    v-if="paths.length > 0"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label || undefined"
    class="quantum-icon"
    :data-mirror="mirror"
    :data-size="size"
    fill="currentColor"
    :role="label ? 'img' : undefined"
    viewBox="0 0 24 24"
  >
    <path v-for="(d, index) in paths" :key="index" :d />
  </svg>
</template>

<style>
  /*
   * Size routes through a custom property rather than being set directly, so a
   * host class can retune a glyph it embeds: the slots an icon sits inside do
   * not all land on the two spec sizes (a FAB keeps 24 dp under dense input).
   * The ink opacity tiers (--quantum-icon-active, -inactive, -focused) are the
   * host's as well: the glyph draws at full currentColor.
   */
  .quantum-icon {
    display: inline-block;
    flex-shrink: 0;
    width: var(--quantum-icon-size, 24px);
    height: var(--quantum-icon-size, 24px);
    vertical-align: middle;
  }

  /*
   * Wrapped in :where() to strip these to zero specificity: the `size` prop is
   * the default, and a single-class host rule outranks it without needing
   * !important or a contrived selector.
   */
  :where(.quantum-icon[data-size='m']) {
    --quantum-icon-size: 24px;
  }

  :where(.quantum-icon[data-size='s']) {
    --quantum-icon-size: 20px;
  }

  /*
   * Bidirectionality: icons that communicate direction flip with the writing
   * direction, the mechanism Google documents for Material Icons on the web.
   * The question mark mirrors in Arabic and Farsi but not in Hebrew.
   */
  [dir='rtl'] .quantum-icon[data-mirror] {
    transform: scaleX(-1);
  }

  [dir='rtl'] .quantum-icon[data-mirror='conditional']:lang(he) {
    transform: none;
  }
</style>
