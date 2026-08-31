<script setup lang="ts">
  import { BuDropdown } from '@paper/bulma'
</script>

<template>
  <BuDropdown hoverable>
    <BuDropdown.Trigger v-slot="{ attrs }">
      <button class="button" type="button" v-bind="attrs">
        <span>Hover me</span>

        <span class="icon is-small">
          <i aria-hidden="true" class="fas fa-angle-down" />
        </span>
      </button>
    </BuDropdown.Trigger>

    <BuDropdown.Menu>
      <a class="dropdown-item">Overview</a>

      <a class="dropdown-item">Modifiers</a>
    </BuDropdown.Menu>
  </BuDropdown>
</template>
