<script setup lang="ts">
  import { BuDropdown, BuDropdownMenu, BuDropdownTrigger } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <BuDropdown v-model="open">
    <BuDropdownTrigger v-slot="{ attrs }">
      <button class="button" type="button" v-bind="attrs">
        <span>Content</span>

        <span class="icon is-small">
          <i aria-hidden="true" class="fas fa-angle-down" />
        </span>
      </button>
    </BuDropdownTrigger>

    <BuDropdownMenu v-slot="{ close }">
      <div class="dropdown-item">
        <p>
          You can insert <strong>any type of content</strong> within the dropdown
          menu — Bulma documents a <code>div</code> for exactly this.
        </p>
      </div>

      <hr class="dropdown-divider">

      <div class="dropdown-item">
        <button class="button is-small is-primary" type="button" @click="close">
          Got it
        </button>
      </div>
    </BuDropdownMenu>
  </BuDropdown>
</template>
