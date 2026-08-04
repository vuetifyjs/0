<script lang="ts">
  import {
    EmButton,
    EmPopoverContent,
    EmRadio,
    EmRadioGroup,
  } from '@paper/emerald'

  // Framework
  // Globals
  import { IN_BROWSER, Radio } from '@vuetify/v0'

  // Utilities
  import { computed, shallowRef, toRef, watchEffect } from 'vue'

  type Family = 'primary' | 'secondary' | 'info' | 'danger' | 'alert'
  type Scale = 'sm' | 'default' | 'lg'

  type Hue = {
    id: Family
    label: string
    /** Deepest step the family publishes — the semantic families stop at 600. */
    max: number
  }

  const hues: Hue[] = [
    { id: 'primary', label: 'Emerald', max: 1000 },
    { id: 'secondary', label: 'Cyan', max: 1000 },
    { id: 'info', label: 'Blue', max: 600 },
    { id: 'danger', label: 'Rose', max: 600 },
    { id: 'alert', label: 'Amber', max: 600 },
  ]

  const steps = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
  const alphas = ['alpha-10', 'alpha-20', 'alpha-30']

  /** Emerald's radius ramp in px. `none` and `full` sit outside the proportional
      scale — a scaled pill stops being a pill — so neither is rewritten. */
  const ramp: Record<string, number> = {
    '2xs': 2,
    'xs': 4,
    's': 6,
    'm': 8,
    'l': 10,
    'xl': 12,
    '2xl': 16,
  }

  const scales: Record<Scale, number> = { sm: 0.5, default: 1, lg: 1.75 }

  /**
   * Module scope, not component state. Every Emerald page renders its own
   * `EmeraldShell`, so the shell — and this panel with it — unmounts on each
   * navigation; component-owned selections would reset on every link click.
   * `dark` lives here too so the shell's topbar toggle and nav switch read the
   * same surviving ref.
   */
  export const dark = shallowRef(false)

  const hue = shallowRef<Family>('primary')
  const radius = shallowRef<Scale>('default')

  /**
   * Every colour override is a `var()` pointing at a family the active
   * `[data-theme]` block already publishes, so one rule covers both themes and
   * toggling light/dark re-resolves the accent instead of dropping it.
   * `.ed[data-theme]` outranks the adapter's `[data-theme]` colour block and its
   * `:root` foundations without either stylesheet being touched.
   */
  const css = toRef(() => {
    const lines: string[] = []
    const family = hues.find(entry => entry.id === hue.value)

    if (family && family.id !== 'primary') {
      lines.push(
        `--emerald-primary:var(--emerald-${family.id});`,
        `--emerald-primary-channels:var(--emerald-${family.id}-channels);`,
        `--emerald-on-primary:var(--emerald-on-${family.id});`,
        `--emerald-surface-tint:var(--emerald-${family.id}-alpha-10);`,
      )

      for (const step of steps) {
        const to = Math.min(step, family.max)
        lines.push(
          `--emerald-primary-${step}:var(--emerald-${family.id}-${to});`,
          `--emerald-primary-${step}-channels:var(--emerald-${family.id}-${to}-channels);`,
        )
      }

      for (const alpha of alphas) {
        lines.push(`--emerald-primary-${alpha}:var(--emerald-${family.id}-${alpha});`)
      }
    }

    const factor = scales[radius.value]

    if (factor !== 1) {
      for (const [key, px] of Object.entries(ramp)) {
        lines.push(`--emerald-radius-${key}:${Math.round(px * factor)}px;`)
      }
    }

    return lines.length > 0 ? `.ed[data-theme]{${lines.join('')}}` : ''
  })

  // Installed once per page load, never torn down — see the note on `dark`.
  if (IN_BROWSER) {
    const sheet = document.createElement('style')
    sheet.id = 'ed-customizer'
    document.head.append(sheet)

    watchEffect(() => {
      sheet.textContent = css.value
    })
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmeraldCustomizer' })

  const mode = computed<'light' | 'dark'>({
    get: () => (dark.value ? 'dark' : 'light'),
    set: value => {
      dark.value = value === 'dark'
    },
  })

  function onReset () {
    hue.value = 'primary'
    radius.value = 'default'
    dark.value = false
  }
</script>

<template>
  <EmPopoverContent
    class="ed-customizer"
    position-area="block-end span-inline-start"
    position-try="flip-block"
  >
    <div class="ed-customizer__head">
      <span class="ed-customizer__title">Customize</span>

      <EmButton
        class="ed-customizer__reset"
        data-customizer-reset
        size="sm"
        variant="tertiary"
        @click="onReset"
      >
        Reset
      </EmButton>
    </div>

    <section class="ed-customizer__section">
      <span id="ed-customizer-mode" class="ed-customizer__label">Mode</span>

      <EmRadioGroup
        v-model="mode"
        aria-labelledby="ed-customizer-mode"
        class="ed-customizer__options"
        mandatory
      >
        <label
          class="ed-customizer__option"
          data-customizer-mode="light"
          :data-selected="!dark || undefined"
        >
          <EmRadio size="sm" value="light" />
          <span>Light</span>
        </label>

        <label
          class="ed-customizer__option"
          data-customizer-mode="dark"
          :data-selected="dark || undefined"
        >
          <EmRadio size="sm" value="dark" />
          <span>Dark</span>
        </label>
      </EmRadioGroup>
    </section>

    <section class="ed-customizer__section">
      <span id="ed-customizer-hue" class="ed-customizer__label">Primary</span>

      <!-- v0's Radio directly, not EmRadio: a colour chip has no dot, no label
           span and no Emerald counterpart, but it still needs radio semantics. -->
      <Radio.Group
        v-model="hue"
        aria-labelledby="ed-customizer-hue"
        class="ed-customizer__swatches"
        mandatory="force"
      >
        <Radio.Root
          v-for="entry in hues"
          :key="entry.id"
          class="ed-customizer__swatch"
          :data-hue="entry.id"
          :label="`${entry.label} primary`"
          :value="entry.id"
        />
      </Radio.Group>
    </section>

    <section class="ed-customizer__section">
      <span id="ed-customizer-radius" class="ed-customizer__label">Radius</span>

      <EmRadioGroup
        v-model="radius"
        aria-labelledby="ed-customizer-radius"
        class="ed-customizer__options"
        mandatory
      >
        <label
          v-for="entry in (['sm', 'default', 'lg'] as Scale[])"
          :key="entry"
          class="ed-customizer__option"
          :data-customizer-radius="entry"
          :data-selected="radius === entry || undefined"
        >
          <EmRadio size="sm" :value="entry" />
          <span>{{ entry === 'default' ? 'Base' : entry.toUpperCase() }}</span>
        </label>
      </EmRadioGroup>
    </section>
  </EmPopoverContent>
</template>

<style>
  .ed-customizer {
    width: min(272px, calc(100vw - 24px));
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-s, 12px);
    background: var(--emerald-background, #fefefe);
    color: var(--emerald-on-background, #2b2d2e);
  }

  .ed-customizer__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .ed-customizer__title {
    font-size: var(--emerald-text-b2-bold-size, 14px);
    font-weight: var(--emerald-text-b2-bold-weight, 600);
    line-height: var(--emerald-text-b2-bold-height, 21px);
  }

  .ed-customizer__section {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-2xs, 4px);
  }

  .ed-customizer__label {
    font-size: var(--emerald-text-b4-size, 10px);
    font-weight: var(--emerald-text-b4-weight, 600);
    line-height: var(--emerald-text-b4-height, 18px);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  /* EmRadioGroup stacks by default; every group in the panel is a row. */
  .ed-customizer__options {
    flex-direction: row;
    align-items: stretch;
    gap: var(--emerald-spacing-2xs, 4px);
  }

  .ed-customizer__option {
    display: flex;
    flex: 1;
    align-items: center;
    gap: var(--emerald-spacing-3xs, 2px);
    min-width: 0;
    padding: var(--emerald-spacing-2xs, 4px) var(--emerald-spacing-xs, 8px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-divider, #ccd6e7);
    border-radius: var(--emerald-radius-s, 6px);
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
    cursor: pointer;
    transition:
      border-color var(--emerald-motion-duration-fast, 120ms) var(--emerald-motion-ease-standard, ease),
      background var(--emerald-motion-duration-fast, 120ms) var(--emerald-motion-ease-standard, ease);
  }

  .ed-customizer__option[data-selected] {
    border-color: var(--emerald-primary, #26c26d);
    background: var(--emerald-primary-alpha-10, #26c26d1a);
  }

  .ed-customizer__swatches {
    display: flex;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-xs, 8px);
    padding-block: var(--emerald-spacing-3xs, 2px);
  }

  .ed-customizer__swatch {
    display: inline-flex;
    width: 28px;
    height: 28px;
    padding: 2px;
    border: var(--emerald-stroke-m, 2px) solid transparent;
    border-radius: var(--emerald-radius-full, 999px);
    background: none;
    cursor: pointer;
  }

  .ed-customizer__swatch::before {
    content: '';
    flex: 1;
    border-radius: inherit;
    background: var(--ed-swatch, var(--emerald-neutral-400, #aeb6be));
  }

  .ed-customizer__swatch[data-state='checked'] {
    border-color: var(--emerald-on-background, #2b2d2e);
  }

  .ed-customizer__swatch:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary, #26c26d);
    outline-offset: 2px;
  }

  .ed-customizer__swatch[data-hue='secondary'] {
    --ed-swatch: var(--emerald-secondary, #00809d);
  }

  .ed-customizer__swatch[data-hue='info'] {
    --ed-swatch: var(--emerald-info, #3a70e2);
  }

  .ed-customizer__swatch[data-hue='danger'] {
    --ed-swatch: var(--emerald-danger, #fb3748);
  }

  .ed-customizer__swatch[data-hue='alert'] {
    --ed-swatch: var(--emerald-alert, #ffdb43);
  }

  /* The Emerald chip cannot read `--emerald-primary`: that is the token this
     picker rewrites, so the chip would preview whatever is currently selected
     instead of the brand it offers. Both brand DEFAULTs are restated by theme. */
  .ed[data-theme='emerald'] .ed-customizer__swatch[data-hue='primary'] {
    --ed-swatch: #26c26d;
  }

  .ed[data-theme='emerald-dark'] .ed-customizer__swatch[data-hue='primary'] {
    --ed-swatch: #2ecc77;
  }
</style>
