<script setup lang="ts">
  import { BuDropdown } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const section = shallowRef('grid')

  const sections = [
    { value: 'overview', text: 'Overview' },
    { value: 'modifiers', text: 'Modifiers' },
    { value: 'grid', text: 'Grid' },
  ]
</script>

<template>
  <BuDropdown v-model="open" menu>
    <BuDropdown.Trigger v-slot="{ isOpen, attrs }">
      <button class="button" type="button" v-bind="attrs">
        <span>Documentation</span>

        <span class="icon is-small">
          <i aria-hidden="true" class="fas" :class="isOpen ? 'fa-angle-up' : 'fa-angle-down'" />
        </span>
      </button>
    </BuDropdown.Trigger>

    <BuDropdown.Menu v-slot="{ close, item }">
      <a
        v-for="entry in sections"
        :key="entry.value"
        class="dropdown-item"
        :class="{ 'is-active': entry.value === section }"
        v-bind="item"
        @click="section = entry.value; close()"
      >
        {{ entry.text }}
      </a>

      <hr class="dropdown-divider">

      <a class="dropdown-item" v-bind="item" @click="close">Report an issue</a>
    </BuDropdown.Menu>
  </BuDropdown>
</template>
