<script lang="ts">
  // Framework
  import { Progress, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuStepper } from './QuStepper.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ProgressRootSlotProps } from '@vuetify/v0'

  // Components
  import QuButton from '../QuButton/QuButton.vue'
  import QuIcon from '../QuIcon/QuIcon.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuStepperBar' })

  const emit = defineEmits<{
    /** BACK was pressed; the stepper has already moved to the previous step. */
    back: []
    /** NEXT was pressed; the stepper has already moved to the next step. */
    next: []
  }>()

  const stepper = useQuStepper()
  const locale = useLocale()

  orphan('QuStepperBar', 'QuStepper', !stepper)

  const count = toRef(() => stepper?.step.size ?? 0)
  const position = toRef(() => (stepper?.step.selectedIndex.value ?? 0) + 1)
  const variant = toRef(() => stepper?.mobile.value)

  const copy = toRef(() => ({
    back: locale.ti('Quantum.back') ?? 'Back',
    next: locale.ti('Quantum.next') ?? 'Next',
    steps: locale.ti('Quantum.steps') ?? 'Steps',
    count: locale.ti('Quantum.stepCount', position.value, count.value) ?? `Step ${position.value} of ${count.value}`,
  }))

  // v0 reports the position as a percentage; the page's text alternative is "Step N of M".
  function bind (attrs: ProgressRootSlotProps['attrs']) {
    return { ...attrs, 'aria-valuetext': copy.value.count }
  }

  function onBack () {
    stepper?.step.prev()
    emit('back')
  }

  function onNext () {
    stepper?.step.next()
    emit('next')
  }
</script>

<template>
  <!-- Teleported to the root's outlet: the bar is placed among the steps but paints under the content. -->
  <Teleport v-if="stepper" defer :to="`#${stepper.outlet}`">
    <div class="quantum-stepper__bar" :data-variant="variant">
      <QuButton
        :disabled="position <= 1"
        icon="chevron-left"
        @click="onBack"
      >
        {{ copy.back }}
      </QuButton>

      <!-- Keyed on the count: v0 reads min and max once, when the root sets up. -->
      <Progress.Root
        v-if="variant === 'dots' || variant === 'progress'"
        :key="count"
        v-slot="{ attrs }"
        :aria-label="copy.steps"
        :max="count"
        renderless
      >
        <div v-bind="bind(attrs)" class="quantum-stepper__progress">
          <Progress.Fill v-if="variant === 'dots'" renderless :value="position">
            <span
              v-for="n in count"
              :key="n"
              class="quantum-stepper__dot"
              :data-active="n === position || undefined"
            />
          </Progress.Fill>

          <Progress.Track v-else class="quantum-stepper__track">
            <Progress.Fill class="quantum-stepper__fill" :value="position" />
          </Progress.Track>
        </div>
      </Progress.Root>

      <QuButton :disabled="position >= count" @click="onNext">
        {{ copy.next }}

        <QuIcon class="quantum-stepper__chevron" name="chevron-right" />
      </QuButton>
    </div>
  </Teleport>
</template>

<!-- Unscoped: the bar is teleported to the root's outlet. -->
<style>
  /*
   * The mobile bottom bar: 56 dp of Grey 200 (#EEEEEE measured) with BACK and
   * NEXT 16 dp from the edges, the buttons' own padding.
   */
  .quantum-stepper__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    height: 56px;
    padding: 0;
    border-end-start-radius: var(--quantum-radius, 2px);
    border-end-end-radius: var(--quantum-radius, 2px);
    background: var(--quantum-grey-200, #EEEEEE);
  }

  /* The page has no dark sheet; on the dark theme the bar takes the app bar's grey. */
  [data-theme='quantum-dark'] .quantum-stepper__bar {
    background: var(--quantum-app-bar, #212121);
  }

  .quantum-stepper__bar .quantum-button {
    min-width: 0;
  }

  .quantum-stepper__chevron {
    margin-inline-start: var(--quantum-spacing-1, 8px);
  }

  .quantum-stepper__progress {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  /* Dots: 8 dp at a 16 dp pitch; the current step's dot in the primary colour, the rest at 38%. */
  .quantum-stepper__dot {
    flex: 0 0 auto;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-stepper__dot[data-active] {
    background: var(--quantum-primary, #3F51B5);
  }

  /* The progress bar: 3 dp by 112 dp, the primary fill over its 30% tint (the linear indicator's track). */
  .quantum-stepper__track {
    position: relative;
    width: 112px;
    height: 3px;
    overflow: hidden;
    background: rgb(var(--quantum-primary-channels, 63 81 181) / 0.3);
  }

  .quantum-stepper__fill {
    height: 100%;
    background: var(--quantum-primary, #3F51B5);
    transition: width var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }
</style>
