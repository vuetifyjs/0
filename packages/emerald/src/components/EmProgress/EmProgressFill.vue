<script lang="ts">
  export interface EmProgressFillProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmProgressFill' })
</script>

<template>
  <div class="emerald-progress__fill">
    <slot />
  </div>
</template>

<style>
.emerald-progress__fill {
  position: absolute;
  top: -0.5px;
  bottom: -0.5px;
  left: -0.5px;
  width: var(--emerald-progress-percent, 0%);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-radius: 999px;
  border: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  background: var(--emerald-secondary-200, #dce4e9);
  box-shadow: 0 1px 2px 0 rgba(5, 0, 18, 0.05);
  transition: width 200ms ease;
}

.emerald-progress[data-size="md"] .emerald-progress__fill {
  top: 1.5px;
  bottom: 1.5px;
  left: 1.5px;
  width: calc(var(--emerald-progress-percent, 0%) - 3px);
  overflow: clip;
  border: none;
  box-shadow: none;
  padding-right: 6px;
}

.emerald-progress[data-indeterminate] .emerald-progress__fill {
  width: 40% !important;
  animation: emerald-progress-indeterminate 1.2s linear infinite;
}

@keyframes emerald-progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}
</style>
