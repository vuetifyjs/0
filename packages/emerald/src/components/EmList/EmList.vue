<script lang="ts">
  // Framework
  import { Single } from '@vuetify/v0'

  export interface EmListProps {
    id?: string
    namespace?: string
    disabled?: boolean
    /** Forwarded to Single.Root — master-detail lists want `'force'`. */
    mandatory?: boolean | 'force'
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'EmList' })

  const {
    id,
    namespace,
    disabled = false,
    mandatory = false,
  } = defineProps<EmListProps>()

  const model = defineModel<T>()
</script>

<template>
  <!-- Single.Root is renderless — the <ul> is the real host so <li> stays a valid child -->
  <Single.Root
    v-model="model"
    :disabled
    :mandatory
    :namespace
  >
    <ul
      :id
      class="emerald-list"
      :data-disabled="disabled || undefined"
    >
      <slot />
    </ul>
  </Single.Root>
</template>

<style>
  .emerald-list {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-2xs, 4px);
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
  }

  .emerald-list[data-disabled] {
    opacity: 0.5;
  }
</style>
