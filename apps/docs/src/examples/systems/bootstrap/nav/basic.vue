<script setup lang="ts">
  import { BNav } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const current = shallowRef('home')

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'profile', label: 'Profile' },
    { id: 'contact', label: 'Contact' },
  ]
</script>

<template>
  <div class="d-flex flex-column gap-4">
    <BNav>
      <BNav.Item
        v-for="link in links"
        :key="link.id"
      >
        <BNav.Link
          :active="current === link.id"
          :href="`#${link.id}`"
          @click.prevent="current = link.id"
        >
          {{ link.label }}
        </BNav.Link>
      </BNav.Item>

      <BNav.Item>
        <BNav.Link disabled>Disabled</BNav.Link>
      </BNav.Item>
    </BNav>

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
