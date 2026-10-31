<script setup lang="ts">
  import { BButton, BDrawer, BFormControl, BMenu, BNavbar } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const menu = shallowRef(false)
  const query = shallowRef('')
</script>

<template>
  <BNavbar v-model="open" class="bg-1" expand="md">
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

            <li class="nav-item">
              <BMenu
                v-model="menu"
                label="Menu"
                trigger-class="nav-link"
              >
                <BMenu.Item href="#">Action</BMenu.Item>
                <BMenu.Item href="#">Another action</BMenu.Item>
                <BMenu.Divider />
                <BMenu.Item href="#">Something else here</BMenu.Item>
              </BMenu>
            </li>

            <li class="nav-item">
              <a aria-disabled="true" class="nav-link disabled">Disabled</a>
            </li>
          </BNavbar.Nav>

          <form class="hstack gap-2" role="search" @submit.prevent>
            <BFormControl
              v-model="query"
              aria-label="Search"
              placeholder="Search"
              type="search"
            />

            <BButton
              aria-label="Search"
              icon
              theme="secondary"
              type="submit"
              variant="solid"
            >
              <svg
                class="bi"
                fill="currentColor"
                height="16"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </BButton>
          </form>
        </BDrawer.Body>
      </BNavbar.Collapse>
    </div>
  </BNavbar>
</template>
