<script lang="ts">
  // Framework
  import { Button, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuToolbar } from './QuToolbar.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ButtonRootProps } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /**
   * `menu` opens a navigation drawer, `up` navigates up the hierarchy (the
   * structure page's two nav icons), `close` dismisses a full-screen dialog.
   */
  export type QuToolbarNavIcon = 'menu' | 'up' | 'close'

  export interface QuToolbarNavProps extends Pick<ButtonRootProps, 'disabled' | 'ariaLabel'> {
    icon?: QuToolbarNavIcon
    /**
     * The drawer this icon controls is open. The `menu` glyph morphs into the
     * back arrow while it is, the creative-customization page's dual-function icon.
     */
    open?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuToolbarNav' })

  const { icon = 'menu', open = false, disabled = false, ariaLabel } = defineProps<QuToolbarNavProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const context = useQuToolbar()

  orphan('QuToolbarNav', context)

  const locale = useLocale()

  const glyph = toRef(() => {
    if (icon === 'close') return 'close'

    return icon === 'up' || open ? 'arrow-back' : 'menu'
  })

  const label = toRef(() => {
    if (ariaLabel) return ariaLabel
    if (glyph.value === 'menu') return locale.ti('Quantum.menu') ?? 'Menu'
    if (glyph.value === 'close') return locale.ti('Quantum.close') ?? 'Close'

    return locale.ti('Quantum.back') ?? 'Back'
  })

  function onClick (event: MouseEvent) {
    emit('click', event)
  }
</script>

<template>
  <Button.Root
    :aria-expanded="icon === 'menu' ? open : undefined"
    :aria-label="label"
    class="quantum-toolbar__nav"
    :data-icon="glyph"
    :disabled
    @click="onClick"
  >
    <QuRipple />

    <span class="quantum-toolbar__glyph">
      <template v-if="icon === 'menu'">
        <span class="quantum-toolbar__morph" data-glyph="menu">
          <QuIcon name="menu" />
        </span>

        <span class="quantum-toolbar__morph" data-glyph="arrow-back">
          <QuIcon name="arrow-back" />
        </span>
      </template>

      <QuIcon v-else :name="glyph" />
    </span>
  </Button.Root>
</template>

<style>
  /* A 48 dp target around the 24 dp glyph, which lands on the 16 / 24 dp keyline. */
  .quantum-toolbar__nav {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--quantum-touch-target, 48px);
    height: var(--quantum-touch-target, 48px);
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-toolbar[data-variant='primary'] .quantum-toolbar__nav:not([data-disabled]),
  .quantum-toolbar[data-image] .quantum-toolbar__nav:not([data-disabled]) {
    color: var(--quantum-on-primary, #FFFFFF);
  }

  /* The 12% focus overlay of the icon's own colour (buttons page, icon toggles). */
  .quantum-toolbar__nav:focus-visible {
    outline: 2px solid transparent;
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  /* Inactive: 38% black on a light bar, 50% white on a dark one (colour page, app bar icons). */
  .quantum-toolbar__nav[data-disabled] {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
    pointer-events: none;
  }

  /* Inactive on a coloured bar or over an image: 50% white (icons page, dark backgrounds). */
  .quantum-toolbar[data-variant='primary'] .quantum-toolbar__nav[data-disabled],
  .quantum-toolbar[data-image] .quantum-toolbar__nav[data-disabled] {
    color: color-mix(in srgb, var(--quantum-on-primary, #FFFFFF) 50%, transparent);
  }

  .quantum-toolbar[data-dense] .quantum-toolbar__nav {
    width: 40px;
    height: 40px;
  }

  .quantum-toolbar__glyph {
    position: relative;
    display: inline-flex;
    width: var(--quantum-icon-size, 24px);
    height: var(--quantum-icon-size, 24px);
  }

  /*
   * The menu-to-back-arrow morph: the two glyphs turn half a revolution
   * together while they cross-fade, over the standard duration and curve.
   * Each glyph sits in its own wrapper so the turn never fights QuIcon's RTL mirror.
   */
  .quantum-toolbar__morph {
    position: absolute;
    inset: 0;
    display: inline-flex;
    transition:
      transform var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      opacity var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-toolbar__nav[data-icon='menu'] .quantum-toolbar__morph[data-glyph='arrow-back'] {
    opacity: 0;
    transform: rotate(-180deg);
  }

  .quantum-toolbar__nav[data-icon='arrow-back'] .quantum-toolbar__morph[data-glyph='menu'] {
    opacity: 0;
    transform: rotate(180deg);
  }

  body[data-reduced-motion='reduce'] .quantum-toolbar__morph {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-toolbar__morph {
      transition: none;
    }
  }
</style>
