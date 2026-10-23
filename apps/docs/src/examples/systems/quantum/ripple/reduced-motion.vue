<script setup lang="ts">
  import { QuRipple, QuSwitch } from '@paper/quantum'
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
  <div class="quantum-docs-ripple-motion quantum-docs-ripple-stack" :data-reduced-motion="preference">
    <QuSwitch v-model="reduce" label="Reduce motion" />

    <Button.Root class="quantum-docs-ripple-pad quantum-elevation-2">
      <QuRipple />

      <span class="quantum-docs-ripple-label quantum-type-body-1">Press and hold</span>
    </Button.Root>
  </div>
</template>

<style>
  .quantum-docs-ripple-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-1, 8px);
  }

  /* The package keys this rule on body[data-reduced-motion]; the example keys it on its own wrapper. */
  .quantum-docs-ripple-motion[data-reduced-motion='reduce'] .quantum-ripple__ink {
    animation: none;
  }

  .quantum-docs-ripple-pad {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    max-width: 320px;
    height: 120px;
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-docs-ripple-pad:focus-visible {
    outline: 2px solid var(--quantum-accent, #FF4081);
    outline-offset: 2px;
  }

  .quantum-docs-ripple-label {
    position: relative;
  }
</style>
