<script lang="ts">
  // Framework
  import { Switch } from '@vuetify/v0'

  export interface HxSwitchProps {
    label?: string
    small?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxSwitch' })

  const { label, small } = defineProps<HxSwitchProps>()

  const model = defineModel<boolean>({ required: true })
</script>

<template>
  <Switch.Root
    v-model="model"
    class="helix-switch"
    :label
  >
    <Switch.Track
      :class="['helix-switch__track', small && 'helix-switch__track--small']"
    >
      <Switch.Thumb
        :class="['helix-switch__thumb', small && 'helix-switch__thumb--small']"
      />
    </Switch.Track>
  </Switch.Root>
</template>

<style scoped>
  .helix-switch {
    display: inline-flex;
    align-items: center;
    border: none;
    background: transparent;
    padding: 0;
    outline: none;
    cursor: pointer;
  }

  .helix-switch:focus-visible .helix-switch__track {
    outline: 2px solid var(--v0-primary);
    outline-offset: 2px;
  }

  .helix-switch__track {
    position: relative;
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    width: 2.75rem;
    height: 1.5rem;
    background-color: var(--v0-surface-variant);
    transition: background-color 0.15s;
  }

  .helix-switch__track[data-state='checked'] {
    background-color: var(--v0-primary);
  }

  .helix-switch__track--small {
    width: 2rem;
    height: 1.125rem;
  }

  .helix-switch__thumb {
    display: block;
    border-radius: 9999px;
    width: 1rem;
    height: 1rem;
    background-color: white;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
    transition: transform 0.15s;
    transform: translateX(0.25rem);
  }

  .helix-switch__thumb[data-state='checked'] {
    transform: translateX(1.5rem);
  }

  .helix-switch__thumb--small {
    width: 0.875rem;
    height: 0.875rem;
    transform: translateX(0.125rem);
  }

  .helix-switch__thumb--small[data-state='checked'] {
    transform: translateX(0.9375rem);
  }
</style>
