<template>
  <VAtom
    :aria-busy="isLoading"
    :aria-pressed="isActive"
    :as="as"
    :as-child="asChild"
    :disabled="isDisabled"
    :style="{ position: 'relative' }"
    @click="handleClick"
  >
    <slot />
  </VAtom>
</template>

<script setup lang="ts">
  import type { InjectionKey } from 'vue'
  import type { ButtonContextValue, ButtonState } from './types'
  import { computed, provide, ref } from 'vue'
  import { CONTEXT_KEYS } from '../../constants/contextKeys'
  import { VAtom, type VAtomProps } from '../VAtom/VAtom'

  export interface VButtonRootProps extends VAtomProps {
    state?: ButtonState
    disabled?: boolean
    loading?: boolean
    active?: boolean
  }

  const props = withDefaults(defineProps<VButtonRootProps>(), {
    as: 'button',
    state: 'default',
    disabled: false,
    loading: false,
    active: false,
  })

  const emit = defineEmits<{
    'click': [event: MouseEvent]
    'update:state': [state: ButtonState]
  }>()

  const internalState = ref<ButtonState>(props.state)

  const currentState = computed({
    get: () => props.state ?? internalState.value,
    set: (value: ButtonState) => {
      internalState.value = value
      emit('update:state', value)
    },
  })

  const isLoading = computed(() => props.loading || currentState.value === 'loading')
  const isDisabled = computed(() => props.disabled || currentState.value === 'disabled')
  const isActive = computed(() => props.active || currentState.value === 'active')

  function setState (state: ButtonState) {
    currentState.value = state
  }

  function handleClick (event: MouseEvent) {
    if (isDisabled.value || isLoading.value) {
      event.preventDefault()
      return
    }
    emit('click', event)
  }

  const contextValue: ButtonContextValue = {
    state: currentState,
    setState,
    isLoading,
    isDisabled,
    isActive,
  }

  provide(ButtonContext, contextValue)
</script>

<script lang="ts">
  export const ButtonContext: InjectionKey<ButtonContextValue> = CONTEXT_KEYS.BUTTON
</script>
