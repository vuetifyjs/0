<script setup lang="ts">
  import { BuNavbar } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <BuNavbar v-model="open">
    <BuNavbar.Brand>
      <a class="navbar-item" href="https://bulma.io">
        <strong>Bulma</strong>
      </a>
    </BuNavbar.Brand>

    <BuNavbar.Menu>
      <div class="navbar-start">
        <a class="navbar-item">Home</a>

        <a class="navbar-item">Documentation</a>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">More</a>

          <div class="navbar-dropdown">
            <a class="navbar-item">About</a>
            <a class="navbar-item is-selected">Jobs</a>
            <a class="navbar-item">Contact</a>
            <hr class="navbar-divider">
            <a class="navbar-item">Report an issue</a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Sign up</strong>
            </a>

            <a class="button is-light">Log in</a>
          </div>
        </div>
      </div>
    </BuNavbar.Menu>
  </BuNavbar>
</template>
