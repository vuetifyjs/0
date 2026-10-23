<script setup lang="ts">
  import { QuButton, QuSwitch } from '@paper/quantum'
  import { createReducedMotionContext } from '@vuetify/v0'

  import { onScopeDispose, shallowRef, toRef, watch } from 'vue'

  // The docs install no reduced-motion plugin, so this example provides its own
  // context and writes the adapter's attribute on its wrapper instead of <body>.
  const [, provide, motion] = createReducedMotionContext({ mode: 'always' })

  provide()

  onScopeDispose(() => motion.dispose())

  const reduce = shallowRef(true)
  const open = shallowRef(false)

  watch(reduce, value => motion.select(value ? 'always' : 'system'))

  const preference = toRef(() => motion.isReduced.value ? 'reduce' : 'no-preference')
</script>

<template>
  <div class="quantum-docs-motion-reduced" :data-reduced-motion="preference">
    <div class="quantum-docs-motion-reduced-controls">
      <QuSwitch v-model="reduce" label="Reduce motion" />

      <QuButton variant="raised" @click="open = !open">{{ open ? 'Leave' : 'Enter' }}</QuButton>
    </div>

    <div class="quantum-docs-motion-reduced-stage">
      <p class="quantum-docs-motion-reduced-copy quantum-type-body-1">Press Enter with the switch on, then off.</p>

      <div class="quantum-docs-motion-reduced-sheet" :data-open="open || undefined">
        <span class="quantum-type-subheading">{{ preference === 'reduce' ? 'Placed, not moved' : 'Entering on the deceleration curve' }}</span>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-motion-reduced {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-motion-reduced-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-3, 24px);
  }

  .quantum-docs-motion-reduced-stage {
    position: relative;
    height: 120px;
    overflow: clip;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-motion-reduced-copy {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-motion-reduced-sheet {
    position: absolute;
    inset: auto 0 0;
    padding: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-16, 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12));
    transform: translateY(calc(100% + 48px));
    transition: transform var(--quantum-duration-leave, 195ms) var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1));
  }

  .quantum-docs-motion-reduced-sheet[data-open] {
    transform: none;
    transition: transform var(--quantum-duration-enter, 225ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  /* An app keys this on body[data-reduced-motion]; the example keys it on its own wrapper. */
  .quantum-docs-motion-reduced[data-reduced-motion='reduce'] .quantum-docs-motion-reduced-sheet {
    transition: none;
  }
</style>
