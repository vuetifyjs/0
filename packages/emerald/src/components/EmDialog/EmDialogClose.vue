<script lang="ts">
  // Framework
  import { DialogClose } from '@vuetify/v0'

  export interface EmDialogCloseProps {
    renderless?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogClose' })

  const { renderless = false } = defineProps<EmDialogCloseProps>()
</script>

<template>
  <DialogClose class="emerald-dialog__close" :renderless>
    <template #default="slotProps">
      <slot v-bind="slotProps">
        <svg
          aria-hidden="true"
          fill="none"
          height="18"
          viewBox="0 0 18 18"
          width="18"
        >
          <path
            d="M4.5 4.5l9 9m0-9l-9 9"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.5"
          />
        </svg>
      </slot>
    </template>
  </DialogClose>
</template>

<style>
.emerald-dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: var(--emerald-icon-xl, 32px);
  height: var(--emerald-icon-xl, 32px);
  padding: var(--emerald-spacing-2xs, 4px);
  border: none;
  border-radius: var(--emerald-radius-xs, 4px);
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.emerald-dialog__close:focus-visible {
  outline: none;
  box-shadow: var(--emerald-shadow-focus, 0px 0px 0px 5px rgba(38, 194, 109, 0.2));
}
</style>
