<script lang="ts">
  // Framework
  import { Progress, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Stepper } from './Md1Stepper.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ProgressRootSlotProps } from '@vuetify/v0'

  // Components
  import Md1Button from '../Md1Button/Md1Button.vue'
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1StepperBar' })

  const emit = defineEmits<{
    /** BACK was pressed; the stepper has already moved to the previous step. */
    back: []
    /** NEXT was pressed; the stepper has already moved to the next step. */
    next: []
  }>()

  const stepper = useMd1Stepper()
  const locale = useLocale()

  orphan('Md1StepperBar', 'Md1Stepper', !stepper)

  const count = toRef(() => stepper?.step.size ?? 0)
  const position = toRef(() => (stepper?.step.selectedIndex.value ?? 0) + 1)
  const variant = toRef(() => stepper?.mobile.value)

  const copy = toRef(() => ({
    back: locale.ti('Md1.back') ?? 'Back',
    next: locale.ti('Md1.next') ?? 'Next',
    steps: locale.ti('Md1.steps') ?? 'Steps',
    count: locale.ti('Md1.stepCount', position.value, count.value) ?? `Step ${position.value} of ${count.value}`,
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
    <div class="md1-stepper__bar" :data-variant="variant">
      <Md1Button
        :disabled="position <= 1"
        icon="chevron-left"
        @click="onBack"
      >
        {{ copy.back }}
      </Md1Button>

      <!-- Keyed on the count: v0 reads min and max once, when the root sets up. -->
      <Progress.Root
        v-if="variant === 'dots' || variant === 'progress'"
        :key="count"
        v-slot="{ attrs }"
        :aria-label="copy.steps"
        :max="count"
        renderless
      >
        <div v-bind="bind(attrs)" class="md1-stepper__progress">
          <Progress.Fill v-if="variant === 'dots'" renderless :value="position">
            <span
              v-for="n in count"
              :key="n"
              class="md1-stepper__dot"
              :data-active="n === position || undefined"
            />
          </Progress.Fill>

          <Progress.Track v-else class="md1-stepper__track">
            <Progress.Fill class="md1-stepper__fill" :value="position" />
          </Progress.Track>
        </div>
      </Progress.Root>

      <Md1Button :disabled="position >= count" @click="onNext">
        {{ copy.next }}

        <Md1Icon class="md1-stepper__chevron" name="chevron-right" />
      </Md1Button>
    </div>
  </Teleport>
</template>

<!-- Unscoped: the bar is teleported to the root's outlet. -->
<style>
  /*
   * The mobile bottom bar: 56 dp of Grey 200 (#EEEEEE measured) with BACK and
   * NEXT 16 dp from the edges, the buttons' own padding.
   */
  .md1-stepper__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    height: 56px;
    padding: 0;
    border-end-start-radius: var(--md1-radius, 2px);
    border-end-end-radius: var(--md1-radius, 2px);
    background: var(--md1-grey-200, #EEEEEE);
  }

  /* The page has no dark sheet; on the dark theme the bar takes the app bar's grey. */
  [data-theme='md1-dark'] .md1-stepper__bar {
    background: var(--md1-app-bar, #212121);
  }

  .md1-stepper__bar .md1-button {
    min-width: 0;
  }

  .md1-stepper__chevron {
    margin-inline-start: var(--md1-spacing-1, 8px);
  }

  .md1-stepper__progress {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  /* Dots: 8 dp at a 16 dp pitch; the current step's dot in the primary colour, the rest at 38%. */
  .md1-stepper__dot {
    flex: 0 0 auto;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-stepper__dot[data-active] {
    background: var(--md1-primary, #3F51B5);
  }

  /* The progress bar: 3 dp by 112 dp, the primary fill over its 30% tint (the linear indicator's track). */
  .md1-stepper__track {
    position: relative;
    width: 112px;
    height: 3px;
    overflow: hidden;
    background: rgb(var(--md1-primary-channels, 63 81 181) / 0.3);
  }

  .md1-stepper__fill {
    height: 100%;
    background: var(--md1-primary, #3F51B5);
    transition: width var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }
</style>
