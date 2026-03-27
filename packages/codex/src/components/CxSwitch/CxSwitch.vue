<script lang="ts">
  // Framework
  import { Switch } from '@vuetify/v0'

  export interface CxSwitchProps {
    label?: string
    small?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxSwitch' })

  const { label, small } = defineProps<CxSwitchProps>()

  const model = defineModel<boolean>({ required: true })
</script>

<template>
  <Switch.Root
    v-model="model"
    class="codex-switch"
    :label
  >
    <Switch.Track
      :class="['codex-switch__track', small && 'codex-switch__track--small']"
    >
      <Switch.Thumb
        :class="['codex-switch__thumb', small && 'codex-switch__thumb--small']"
      />
    </Switch.Track>
  </Switch.Root>
</template>

<style scoped>
  .codex-switch {
    display: inline-flex;
    align-items: center;
    border: none;
    background: transparent;
    padding: 0;
    outline: none;
    cursor: pointer;
  }

  .codex-switch__track {
    position: relative;
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    width: 2.75rem;
    height: 1.5rem;
  }

  .codex-switch__track--small {
    width: 2rem;
    height: 1.125rem;
  }

  .codex-switch__thumb {
    display: block;
    border-radius: 9999px;
    width: 1rem;
    height: 1rem;
  }

  .codex-switch__thumb--small {
    width: 0.875rem;
    height: 0.875rem;
  }
</style>
