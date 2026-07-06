<script lang="ts">
  export interface EmSelectIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectIcon' })
</script>

<template>
  <span aria-hidden="true" class="emerald-select__icon">
    <slot>
      <svg
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 9L12 15L18 9"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
        />
      </svg>
    </slot>
  </span>
</template>

<style>
.emerald-select__icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: var(--emerald-spacing-xl);
  height: var(--emerald-spacing-xl);
  transition: transform 180ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
</style>
