<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
  import { useResizeObserver } from '@vuetify/v0'
  import { nextTick, shallowRef, useTemplateRef, watch } from 'vue'

  // The scale, largest first. Dynamic type picks the largest that fits;
  // below Headline the number wraps rather than shrinking further or
  // truncating.
  const STEPS = [
    { style: 'display-4', name: 'Display 4, 112 sp' },
    { style: 'display-3', name: 'Display 3, 56 sp' },
    { style: 'display-2', name: 'Display 2, 45 sp' },
    { style: 'display-1', name: 'Display 1, 34 sp' },
    { style: 'headline', name: 'Headline, 24 sp' },
  ] as const

  const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '00'] as const

  const value = shallowRef('128')
  const step = shallowRef(0)
  const display = useTemplateRef<HTMLElement>('display')

  // Walk down the scale until the line no longer overflows the display.
  async function fit () {
    step.value = 0
    await nextTick()

    while (display.value && step.value < STEPS.length - 1 && display.value.scrollWidth > display.value.clientWidth) {
      step.value++
      await nextTick()
    }
  }

  function onKey (key: string) {
    if (value.value === '0') value.value = key === '00' ? '0' : key
    else if (value.value.length < 40) value.value += key
  }

  function onDelete () {
    value.value = value.value.length > 1 ? value.value.slice(0, -1) : '0'
  }

  function onClear () {
    value.value = '0'
  }

  watch(value, fit, { flush: 'post' })
  useResizeObserver(display, fit)
</script>

<template>
  <div class="md1-docs-type-dynamic md1-elevation-2">
    <div class="md1-docs-type-dynamic-screen">
      <output
        ref="display"
        aria-live="polite"
        class="md1-docs-type-dynamic-value"
        :class="`md1-type-${STEPS[step].style}`"
        :data-last="step === STEPS.length - 1 || undefined"
      >{{ value }}</output>

      <span class="md1-docs-type-dynamic-style">{{ STEPS[step].name }}</span>
    </div>

    <div class="md1-docs-type-dynamic-keys">
      <Md1Button v-for="key in KEYS" :key @click="onKey(key)">{{ key }}</Md1Button>

      <Md1Button @click="onClear">Clear</Md1Button>

      <Md1Button aria-label="Delete" icon="arrow-back" @click="onDelete" />
    </div>
  </div>
</template>

<style>
  .md1-docs-type-dynamic {
    width: min(100%, 360px);
    overflow: clip;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-type-dynamic-screen {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
    box-sizing: border-box;
    min-height: 200px;
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
    background: var(--md1-background, #FAFAFA);
  }

  /* One line while a step remains; the last step wraps instead of truncating. */
  .md1-docs-type-dynamic-value {
    display: block;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-align: end;
    font-variant-numeric: tabular-nums;
  }

  .md1-docs-type-dynamic-value[data-last] {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .md1-docs-type-dynamic-style {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-type-dynamic-keys {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
  }
</style>
