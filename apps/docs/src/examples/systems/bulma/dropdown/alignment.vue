<script setup lang="ts">
  import { BuDropdown } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const up = shallowRef(false)
  const right = shallowRef(false)
</script>

<template>
  <p class="mb-6">
    Bulma positions both menus with plain CSS, against the trigger — there is no
    floating engine to configure, and no measuring at runtime.
  </p>

  <div class="is-flex is-justify-content-space-between">
    <BuDropdown v-model="up" up>
      <BuDropdown.Trigger v-slot="{ attrs }">
        <button class="button" type="button" v-bind="attrs">
          <span>Opens up</span>

          <span class="icon is-small">
            <i aria-hidden="true" class="fas fa-angle-up" />
          </span>
        </button>
      </BuDropdown.Trigger>

      <BuDropdown.Menu v-slot="{ close }">
        <a class="dropdown-item" @click="close">Overview</a>

        <a class="dropdown-item" @click="close">Modifiers</a>
      </BuDropdown.Menu>
    </BuDropdown>

    <BuDropdown v-model="right" right>
      <BuDropdown.Trigger v-slot="{ attrs }">
        <button class="button" type="button" v-bind="attrs">
          <span>Aligns right</span>

          <span class="icon is-small">
            <i aria-hidden="true" class="fas fa-angle-down" />
          </span>
        </button>
      </BuDropdown.Trigger>

      <BuDropdown.Menu v-slot="{ close }">
        <a class="dropdown-item" @click="close">Overview</a>

        <a class="dropdown-item" @click="close">Modifiers</a>
      </BuDropdown.Menu>
    </BuDropdown>
  </div>
</template>
