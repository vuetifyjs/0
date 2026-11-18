<script lang="ts">
  // Framework
  import { isNumber } from '@vuetify/v0'
  import { Step } from '@vuetify/v0/components'

  // Utilities
  import { toRef } from 'vue'

  // Context
  import { STEPPER_NS, useBStepper } from '../BStepper/BStepper.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BStepperItem' })

  defineSlots<{
    default?: () => any
  }>()

  const { claim, current } = useBStepper()
  const index = claim()

  // The pinned list marks every step up through the current one `.active`.
  const reached = toRef(() => isNumber(current.value) && index <= current.value)
  const classes = toRef(() => {
    const list = ['stepper-item']
    if (reached.value) list.push('active')
    return list
  })

  function onClick (select: () => void) {
    select()
  }

  function onKeydown (event: KeyboardEvent, select: () => void) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onClick(select)
  }
</script>

<template>
  <Step.Item v-slot="{ select }" :namespace="STEPPER_NS" :value="index">
    <li
      :aria-current="index === current ? 'step' : undefined"
      :class="classes"
      role="button"
      tabindex="0"
      @click="onClick(select)"
      @keydown="onKeydown($event, select)"
    >
      <slot />
    </li>
  </Step.Item>
</template>
