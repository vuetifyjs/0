<script setup lang="ts">
  import { BDrawer, BNavbar } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <BNavbar v-model="open" class="bg-1" expand="sm">
    <div class="container-fluid">
      <BNavbar.Brand href="#">Navbar</BNavbar.Brand>

      <BNavbar.Collapse>
        <BDrawer.Header>
          <BDrawer.Title>Menu</BDrawer.Title>
          <BDrawer.Close />
        </BDrawer.Header>

        <BDrawer.Body class="mb-2 md:mb-0">
          <BNavbar.Nav class="nav me-auto">
            <li class="nav-item">
              <a aria-current="page" class="nav-link active" href="#">Home</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
          </BNavbar.Nav>
        </BDrawer.Body>
      </BNavbar.Collapse>
    </div>
  </BNavbar>
</template>
