<script lang="ts">
  export interface EmDialogDividerProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogDivider' })
</script>

<template>
  <div
    aria-orientation="horizontal"
    class="emerald-dialog__divider"
    role="separator"
  />
</template>

<style>
.emerald-dialog__divider {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 16px;
}

.emerald-dialog__divider::before {
  content: '';
  border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-divider, #ccd6e7);
}
</style>
