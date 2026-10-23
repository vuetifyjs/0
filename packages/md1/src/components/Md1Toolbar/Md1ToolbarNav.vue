<script lang="ts">
  // Framework
  import { Button, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Toolbar } from './Md1Toolbar.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ButtonRootProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /**
   * `menu` opens a navigation drawer, `up` navigates up the hierarchy (the
   * structure page's two nav icons), `close` dismisses a full-screen dialog.
   */
  export type Md1ToolbarNavIcon = 'menu' | 'up' | 'close'

  export interface Md1ToolbarNavProps extends Pick<ButtonRootProps, 'disabled' | 'ariaLabel'> {
    icon?: Md1ToolbarNavIcon
    /**
     * The drawer this icon controls is open. The `menu` glyph morphs into the
     * back arrow while it is, the creative-customization page's dual-function icon.
     */
    open?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ToolbarNav' })

  const { icon = 'menu', open = false, disabled = false, ariaLabel } = defineProps<Md1ToolbarNavProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const context = useMd1Toolbar()

  orphan('Md1ToolbarNav', context)

  const locale = useLocale()

  const glyph = toRef(() => {
    if (icon === 'close') return 'close'

    return icon === 'up' || open ? 'arrow-back' : 'menu'
  })

  const label = toRef(() => {
    if (ariaLabel) return ariaLabel
    if (glyph.value === 'menu') return locale.ti('Md1.menu') ?? 'Menu'
    if (glyph.value === 'close') return locale.ti('Md1.close') ?? 'Close'

    return locale.ti('Md1.back') ?? 'Back'
  })

  function onClick (event: MouseEvent) {
    emit('click', event)
  }
</script>

<template>
  <Button.Root
    :aria-expanded="icon === 'menu' ? open : undefined"
    :aria-label="label"
    class="md1-toolbar__nav"
    :data-icon="glyph"
    :disabled
    @click="onClick"
  >
    <Md1Ripple />

    <span class="md1-toolbar__glyph">
      <template v-if="icon === 'menu'">
        <span class="md1-toolbar__morph" data-glyph="menu">
          <Md1Icon name="menu" />
        </span>

        <span class="md1-toolbar__morph" data-glyph="arrow-back">
          <Md1Icon name="arrow-back" />
        </span>
      </template>

      <Md1Icon v-else :name="glyph" />
    </span>
  </Button.Root>
</template>

<style>
  /* A 48 dp target around the 24 dp glyph, which lands on the 16 / 24 dp keyline. */
  .md1-toolbar__nav {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--md1-touch-target, 48px);
    height: var(--md1-touch-target, 48px);
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-toolbar[data-variant='primary'] .md1-toolbar__nav:not([data-disabled]),
  .md1-toolbar[data-image] .md1-toolbar__nav:not([data-disabled]) {
    color: var(--md1-on-primary, #FFFFFF);
  }

  /* The 12% focus overlay of the icon's own colour (buttons page, icon toggles). */
  .md1-toolbar__nav:focus-visible {
    outline: 2px solid transparent;
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  /* Inactive: 38% black on a light bar, 50% white on a dark one (colour page, app bar icons). */
  .md1-toolbar__nav[data-disabled] {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
    pointer-events: none;
  }

  /* Inactive on a coloured bar or over an image: 50% white (icons page, dark backgrounds). */
  .md1-toolbar[data-variant='primary'] .md1-toolbar__nav[data-disabled],
  .md1-toolbar[data-image] .md1-toolbar__nav[data-disabled] {
    color: color-mix(in srgb, var(--md1-on-primary, #FFFFFF) 50%, transparent);
  }

  .md1-toolbar[data-dense] .md1-toolbar__nav {
    width: 40px;
    height: 40px;
  }

  .md1-toolbar__glyph {
    position: relative;
    display: inline-flex;
    width: var(--md1-icon-size, 24px);
    height: var(--md1-icon-size, 24px);
  }

  /*
   * The menu-to-back-arrow morph: the two glyphs turn half a revolution
   * together while they cross-fade, over the standard duration and curve.
   * Each glyph sits in its own wrapper so the turn never fights Md1Icon's RTL mirror.
   */
  .md1-toolbar__morph {
    position: absolute;
    inset: 0;
    display: inline-flex;
    transition:
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-toolbar__nav[data-icon='menu'] .md1-toolbar__morph[data-glyph='arrow-back'] {
    opacity: 0;
    transform: rotate(-180deg);
  }

  .md1-toolbar__nav[data-icon='arrow-back'] .md1-toolbar__morph[data-glyph='menu'] {
    opacity: 0;
    transform: rotate(180deg);
  }

  body[data-reduced-motion='reduce'] .md1-toolbar__morph {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-toolbar__morph {
      transition: none;
    }
  }
</style>
