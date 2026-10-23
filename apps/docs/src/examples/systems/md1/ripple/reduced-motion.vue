<script setup lang="ts">
  import { Md1Ripple, Md1Switch } from '@paper/md1'
  import { Button, createReducedMotionContext } from '@vuetify/v0'
  import { onScopeDispose, shallowRef, toRef, watch } from 'vue'

  // The docs install no reduced-motion plugin, so this example provides its
  // own context to the ripple below it instead of changing the whole page.
  const [, provide, motion] = createReducedMotionContext({ mode: 'always' })

  provide()

  onScopeDispose(() => motion.dispose())

  const reduce = shallowRef(true)

  watch(reduce, value => motion.select(value ? 'always' : 'system'))

  // What the plugin's adapter writes on <body>, scoped to this example.
  const preference = toRef(() => motion.isReduced.value ? 'reduce' : 'no-preference')
</script>

<template>
  <div class="md1-docs-ripple-motion md1-docs-ripple-stack" :data-reduced-motion="preference">
    <Md1Switch v-model="reduce" label="Reduce motion" />

    <Button.Root class="md1-docs-ripple-pad md1-elevation-2">
      <Md1Ripple />

      <span class="md1-docs-ripple-label md1-type-body-1">Press and hold</span>
    </Button.Root>
  </div>
</template>

<style>
  .md1-docs-ripple-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-1, 8px);
  }

  /* The package keys this rule on body[data-reduced-motion]; the example keys it on its own wrapper. */
  .md1-docs-ripple-motion[data-reduced-motion='reduce'] .md1-ripple__ink {
    animation: none;
  }

  .md1-docs-ripple-pad {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    max-width: 320px;
    height: 120px;
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-docs-ripple-pad:focus-visible {
    outline: 2px solid var(--md1-accent, #FF4081);
    outline-offset: 2px;
  }

  .md1-docs-ripple-label {
    position: relative;
  }
</style>
