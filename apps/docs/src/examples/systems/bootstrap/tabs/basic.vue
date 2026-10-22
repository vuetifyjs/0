<script setup lang="ts">
  import { BTabs } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const tab = shallowRef('home')
</script>

<template>
  <div>
    <BTabs v-model="tab">
      <BTabs.List>
        <BTabs.Item value="home">Home</BTabs.Item>

        <BTabs.Item value="profile">Profile</BTabs.Item>

        <BTabs.Item
          disabled
          value="contact"
        >
          Contact
        </BTabs.Item>
      </BTabs.List>

      <BTabs.Content>
        <BTabs.Panel value="home">
          <p class="mt-3 mb-0">Home panel. Arrow keys move the tab.</p>
        </BTabs.Panel>

        <BTabs.Panel value="profile">
          <p class="mt-3 mb-0">Profile panel.</p>
        </BTabs.Panel>

        <BTabs.Panel value="contact">
          <p class="mt-3 mb-0">Contact panel.</p>
        </BTabs.Panel>
      </BTabs.Content>
    </BTabs>

    <BTabs
      v-model="tab"
      class="mt-4"
      variant="pills"
      vertical
    >
      <div class="d-flex align-items-start gap-4">
        <BTabs.List>
          <BTabs.Item value="home">Home</BTabs.Item>

          <BTabs.Item value="profile">Profile</BTabs.Item>
        </BTabs.List>

        <BTabs.Content>
          <BTabs.Panel value="home">
            <p class="mb-0">Vertical pills share the same model.</p>
          </BTabs.Panel>

          <BTabs.Panel value="profile">
            <p class="mb-0">Profile, from the vertical list.</p>
          </BTabs.Panel>
        </BTabs.Content>
      </div>
    </BTabs>
  </div>
</template>
