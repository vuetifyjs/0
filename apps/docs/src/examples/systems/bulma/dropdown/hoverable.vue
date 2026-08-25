<script setup lang="ts">
  import { BuDropdown, BuDropdownMenu, BuDropdownTrigger } from '@paper/bulma'
</script>

<template>
  <BuDropdown hoverable>
    <BuDropdownTrigger v-slot="{ attrs }">
      <button class="button" type="button" v-bind="attrs">
        <span>Hover me</span>

        <span class="icon is-small">
          <i aria-hidden="true" class="fas fa-angle-down" />
        </span>
      </button>
    </BuDropdownTrigger>

    <BuDropdownMenu>
      <a class="dropdown-item">Overview</a>

      <a class="dropdown-item">Modifiers</a>
    </BuDropdownMenu>
  </BuDropdown>
</template>
