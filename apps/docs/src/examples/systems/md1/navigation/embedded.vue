<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
  import { Button } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const keys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+']

  const functions: Record<string, (value: number) => number> = {
    'sin': Math.sin,
    'cos': Math.cos,
    'tan': Math.tan,
    'ln': Math.log,
    'log': Math.log10,
    '√': Math.sqrt,
  }

  const display = shallowRef('0')
  const advanced = shallowRef(false)

  let total: number | null = null
  let operator = ''
  let fresh = true

  function apply (left: number, right: number) {
    if (operator === '+') return left + right
    if (operator === '−') return left - right
    if (operator === '×') return left * right
    if (operator === '÷') return left / right

    return right
  }

  function show (value: number) {
    display.value = Number.isFinite(value) ? String(Number(value.toPrecision(10))) : 'Error'
  }

  function onKey (key: string) {
    if (/[\d.]/.test(key)) {
      display.value = fresh || display.value === '0' ? (key === '.' ? '0.' : key) : display.value + key
      fresh = false

      return
    }

    const value = Number(display.value)

    total = total === null ? value : apply(total, value)
    show(total)
    operator = key === '=' ? '' : key
    if (key === '=') total = null
    fresh = true
  }

  function onFunction (name: string) {
    show(functions[name]!(Number(display.value)))
    fresh = true
    advanced.value = false
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-embedded">
    <output aria-live="polite" class="md1-docs-embedded-display">{{ display }}</output>

    <div class="md1-docs-embedded-pad">
      <Button.Root
        v-for="key in keys"
        :key
        class="md1-docs-embedded-key"
        @click="onKey(key)"
      >
        {{ key }}
      </Button.Root>
    </div>

    <div
      :aria-hidden="!advanced || undefined"
      class="md1-docs-embedded-panel"
      :data-open="advanced || undefined"
      :inert="!advanced || undefined"
    >
      <Button.Root
        v-for="(_, name) in functions"
        :key="name"
        class="md1-docs-embedded-key"
        @click="onFunction(name)"
      >
        {{ name }}
      </Button.Root>
    </div>

    <Md1Button
      :aria-expanded="advanced"
      :aria-label="advanced ? 'Hide advanced functions' : 'Show advanced functions'"
      class="md1-docs-embedded-handle"
      :icon="advanced ? 'chevron-right' : 'chevron-left'"
      @click="advanced = !advanced"
    />
  </div>
</template>

<style>
  /*
   * Embedded navigation: no app bar, no drawer, no tabs. The keypad is the
   * strong primary view; the one alternate view, the advanced functions, slides
   * over it from the end edge.
   */
  .md1-docs-screen.md1-docs-embedded {
    display: flex;
    flex-direction: column;
    height: 440px;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-embedded-display {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    min-height: 112px;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px);
    overflow: hidden;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-display-2-size, 45px);
    font-weight: 300;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-embedded-pad {
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: repeat(4, 1fr);
    background: var(--md1-grey-800, #424242);
  }

  .md1-docs-embedded-key {
    min-height: 48px;
    padding: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 24px;
    color: var(--md1-white, #FFFFFF);
    background: none;
    border: 0;
    cursor: pointer;
  }

  .md1-docs-embedded-key:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  .md1-docs-embedded-key:focus-visible {
    outline: 2px solid var(--md1-white, #FFFFFF);
    outline-offset: -2px;
  }

  /* The advanced panel: the accent colour, black ink, entering from the end edge on the standard curve. */
  .md1-docs-embedded-panel {
    position: absolute;
    inset-block: 112px 0;
    inset-inline-end: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 75%;
    background: var(--md1-teal-a400, #1DE9B6);
    box-shadow: var(--md1-elevation-8);
    transform: translateX(100%);
    transition: transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  [dir='rtl'] .md1-docs-embedded-panel {
    transform: translateX(-100%);
  }

  .md1-docs-embedded-panel[data-open] {
    transform: none;
  }

  .md1-docs-embedded-panel .md1-docs-embedded-key {
    color: rgba(0, 0, 0, 0.87);
  }

  .md1-docs-embedded-panel .md1-docs-embedded-key:focus-visible {
    outline-color: rgba(0, 0, 0, 0.87);
  }

  .md1-docs-embedded-handle {
    position: absolute;
    inset-block-start: 64px;
    inset-inline-end: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-embedded-panel {
      transition: none;
    }
  }
</style>
