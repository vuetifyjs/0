<script setup lang="ts">
  // Types
  import type { OnButtonVariant } from '@paper/onyx'

  import { icons } from '../icons'

  defineOptions({ name: 'OnyxButtons' })

  const variants: { name: OnButtonVariant, label: string }[] = [
    { name: 'default', label: 'Default' },
    { name: 'secondary', label: 'Secondary' },
    { name: 'outline', label: 'Outline' },
    { name: 'ghost', label: 'Ghost' },
    { name: 'destructive', label: 'Destructive' },
    { name: 'link', label: 'Link' },
  ]

  const sizes: { name: 'sm' | 'md' | 'lg', label: string }[] = [
    { name: 'sm', label: 'Small' },
    { name: 'md', label: 'Medium' },
    { name: 'lg', label: 'Large' },
  ]

  const defaultRefs: Record<string, HTMLElement | null> = {}

  function setDefaultRef (variant: string, el: unknown) {
    defaultRefs[variant] = el as HTMLElement | null
  }

  function onFocusDemo (variant: string) {
    defaultRefs[variant]?.querySelector<HTMLElement>('button, a')?.focus()
  }
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Every state below is the real component, not a mockup — hover and focus are native
    browser behavior, not simulated screenshots.
  </p>

  <h2 class="onyx-buttons__heading mt-8">Variants</h2>

  <div class="onyx-exhibit mt-3">
    <p class="onyx-hallmark onyx-exhibit__caption">Default · state · disabled · loading</p>

    <div v-for="(variant, index) in variants" :key="variant.name" :class="{ 'mt-6': index > 0 }">
      <p class="onyx-hallmark" style="opacity: 0.7;">{{ variant.label }}</p>

      <div class="flex flex-wrap items-center gap-3 mt-2">
        <div :ref="el => setDefaultRef(variant.name, el as HTMLElement | null)" style="display: contents;">
          <OnButton :variant="variant.name">{{ variant.label }}</OnButton>
        </div>

        <OnButton size="sm" variant="outline" @click="onFocusDemo(variant.name)">Focus</OnButton>

        <span style="color: var(--onyx-muted-foreground, #71717a); font-size: 13px;">
          ← Tab to this button and press Enter to focus the one on the left and see its ring
          (a mouse click moves focus too, but per the browser's own convention, mouse-triggered
          focus never shows the ring — that's the policy, not a bug)
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-3 mt-2">
        <OnButton disabled :variant="variant.name">Disabled</OnButton>
        <OnButton loading :variant="variant.name">Loading</OnButton>
      </div>
    </div>
  </div>

  <h2 class="onyx-buttons__heading mt-8">Sizes</h2>

  <div class="onyx-exhibit mt-3">
    <p class="onyx-hallmark onyx-exhibit__caption">sm · md · lg · icon</p>

    <div class="flex flex-wrap items-center gap-3">
      <OnButton v-for="size in sizes" :key="size.name" :size="size.name">{{ size.label }}</OnButton>

      <OnButton aria-label="Check" size="icon">
        <svg
          aria-hidden="true"
          fill="none"
          height="16"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path :d="icons.check" />
        </svg>
      </OnButton>
    </div>
  </div>

  <h2 class="onyx-buttons__heading mt-8">Light panel</h2>

  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px', margin: '4px 0 12px' }">
    Re-themed via a single <code>data-theme="onyx-light"</code> attribute on this
    subtree — the adapter emits one CSS block per theme keyed by that attribute, so nesting
    it anywhere re-scopes every token underneath, independent of the page's own theme.
  </p>

  <div class="onyx-exhibit mt-3">
    <p class="onyx-hallmark onyx-exhibit__caption">data-theme="onyx-light"</p>

    <section class="onyx-buttons__light-panel" data-theme="onyx-light">
      <OnButton v-for="variant in variants" :key="variant.name" :variant="variant.name">{{ variant.label }}</OnButton>
    </section>
  </div>
</template>

<!-- Unscoped: page-local heading + light-panel exhibit, layout scaffolding only. -->
<style>
  .onyx-buttons__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin-bottom: 0;
  }

  .onyx-buttons__light-panel {
    background: var(--onyx-background, #ffffff);
    border-radius: var(--onyx-radius-lg, 0.5rem);
    display: flex;
    flex-wrap: wrap;
    gap: var(--onyx-spacing-sm, 12px);
    padding: var(--onyx-spacing-lg, 24px);
  }
</style>
