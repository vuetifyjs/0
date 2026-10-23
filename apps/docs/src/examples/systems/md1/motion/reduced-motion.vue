<script setup lang="ts">
  import { Md1Button, Md1Switch } from '@paper/md1'
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
  <div class="md1-docs-motion-reduced" :data-reduced-motion="preference">
    <div class="md1-docs-motion-reduced-controls">
      <Md1Switch v-model="reduce" label="Reduce motion" />

      <Md1Button variant="raised" @click="open = !open">{{ open ? 'Leave' : 'Enter' }}</Md1Button>
    </div>

    <div class="md1-docs-motion-reduced-stage">
      <p class="md1-docs-motion-reduced-copy md1-type-body-1">Press Enter with the switch on, then off.</p>

      <div class="md1-docs-motion-reduced-sheet" :data-open="open || undefined">
        <span class="md1-type-subheading">{{ preference === 'reduce' ? 'Placed, not moved' : 'Entering on the deceleration curve' }}</span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-motion-reduced {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-motion-reduced-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-motion-reduced-stage {
    position: relative;
    height: 120px;
    overflow: clip;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-motion-reduced-copy {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-motion-reduced-sheet {
    position: absolute;
    inset: auto 0 0;
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-16, 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12));
    transform: translateY(calc(100% + 48px));
    transition: transform var(--md1-duration-leave, 195ms) var(--md1-easing-accelerate, cubic-bezier(0.4, 0, 1, 1));
  }

  .md1-docs-motion-reduced-sheet[data-open] {
    transform: none;
    transition: transform var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  /* An app keys this on body[data-reduced-motion]; the example keys it on its own wrapper. */
  .md1-docs-motion-reduced[data-reduced-motion='reduce'] .md1-docs-motion-reduced-sheet {
    transition: none;
  }
</style>
