<script lang="ts">
  export type EmDialogFooterVariant = 'buttons' | 'pagination' | 'one-button'

  export interface EmDialogFooterProps {
    variant?: EmDialogFooterVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogFooter' })

  const { variant = 'buttons' } = defineProps<EmDialogFooterProps>()
</script>

<template>
  <div class="emerald-dialog__footer" :data-variant="variant">
    <slot />
  </div>
</template>

<style>
.emerald-dialog__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--emerald-spacing-s, 12px) var(--emerald-spacing-xs, 8px);
}

.emerald-dialog__footer[data-variant='pagination'] {
  justify-content: center;
}

.emerald-dialog__footer[data-variant='one-button'] {
  flex-direction: column;
  align-items: stretch;
  text-align: center;
}
</style>
