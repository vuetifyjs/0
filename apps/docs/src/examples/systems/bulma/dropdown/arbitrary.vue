<script setup lang="ts">
  import { BuDropdown } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <BuDropdown v-model="open">
    <BuDropdown.Trigger v-slot="{ attrs }">
      <button class="button" type="button" v-bind="attrs">
        <span>Content</span>

        <span class="icon is-small">
          <i aria-hidden="true" class="fas fa-angle-down" />
        </span>
      </button>
    </BuDropdown.Trigger>

    <BuDropdown.Menu v-slot="{ close }">
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
    </BuDropdown.Menu>
  </BuDropdown>
</template>
