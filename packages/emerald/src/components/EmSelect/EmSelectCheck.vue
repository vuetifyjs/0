<script lang="ts">
  export interface EmSelectCheckProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectCheck' })
</script>

<template>
  <span aria-hidden="true" class="emerald-select__check">
    <slot>
      <svg
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 12.5L10 17.5L19 7.5"
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
.emerald-select__check {
  display: none;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: var(--emerald-spacing-xl);
  height: var(--emerald-spacing-xl);
  margin-left: auto;
}

.emerald-select__item[data-selected] .emerald-select__check {
  display: inline-flex;
}
</style>
