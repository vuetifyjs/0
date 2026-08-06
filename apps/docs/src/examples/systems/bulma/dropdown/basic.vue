<script setup lang="ts">
  import { BuDropdown, BuDropdownMenu, BuDropdownTrigger } from '@paper/bulma'
</script>

<template>
  <BuDropdown menu>
    <BuDropdownTrigger v-slot="{ isOpen, attrs }">
      <button class="button" type="button" v-bind="attrs">
        <span>Dropdown button</span>

        <span class="icon is-small">
          <i aria-hidden="true" class="fas" :class="isOpen ? 'fa-angle-up' : 'fa-angle-down'" />
        </span>
      </button>
    </BuDropdownTrigger>

    <BuDropdownMenu v-slot="{ close, item }">
      <a class="dropdown-item" v-bind="item" @click="close">Dropdown item</a>

      <a class="dropdown-item" v-bind="item" @click="close">Other dropdown item</a>

      <a class="dropdown-item is-active" v-bind="item" @click="close">Active dropdown item</a>

      <hr class="dropdown-divider">

      <a class="dropdown-item" v-bind="item" @click="close">With a divider</a>
    </BuDropdownMenu>
  </BuDropdown>
</template>
