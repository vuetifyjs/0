<script setup lang="ts">
  import { BNav } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const current = shallowRef('home')

  const links = [
    { id: 'home', label: 'Active' },
    { id: 'link', label: 'Link' },
    { id: 'another', label: 'Link' },
  ]
</script>

<template>
  <div class="d-flex flex-column gap-4">
    <BNav variant="pills">
      <BNav.Item
        v-for="link in links"
        :key="link.id"
      >
        <BNav.Link
          :active="current === link.id"
          href="#"
          @click.prevent="current = link.id"
        >
          {{ link.label }}
        </BNav.Link>
      </BNav.Item>
    </BNav>

    <BNav
      fill
      variant="underline"
    >
      <BNav.Item
        v-for="link in links"
        :key="link.id"
      >
        <BNav.Link
          :active="current === link.id"
          href="#"
          @click.prevent="current = link.id"
        >
          {{ link.label }}
        </BNav.Link>
      </BNav.Item>
    </BNav>
  </div>
</template>
