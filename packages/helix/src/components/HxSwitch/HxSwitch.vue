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

  .helix-switch__track {
    position: relative;
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    width: 2.75rem;
    height: 1.5rem;
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
  }

  .helix-switch__thumb--small {
    width: 0.875rem;
    height: 0.875rem;
  }
</style>
