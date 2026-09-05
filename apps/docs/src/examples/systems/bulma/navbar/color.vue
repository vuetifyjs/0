<script setup lang="ts">
  import { BuNavbar, BuNavbarBrand, BuNavbarMenu } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <BuNavbar v-model="open" color="primary">
    <BuNavbarBrand>
      <a class="navbar-item" href="https://bulma.io">
        <strong>Bulma</strong>
      </a>
    </BuNavbarBrand>

    <BuNavbarMenu>
      <div class="navbar-start">
        <a class="navbar-item">Home</a>
        <a class="navbar-item">Documentation</a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-light">
              <strong>Sign up</strong>
            </a>

            <a class="button is-link is-light">Log in</a>
          </div>
        </div>
      </div>
    </BuNavbarMenu>
  </BuNavbar>
</template>
