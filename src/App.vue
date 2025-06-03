<template>
  <main>
    <h1>Avatars</h1>
    <v0-avatar height="32px" src="https://cdn.vuetifyjs.com/images/john-beard.png" width="32px" />
    <v0-avatar icon="mdi mdi-cog" />

    <h1>Images</h1>

    <v0-img height="64px" src="https://cdn.vuetifyjs.com/images/john-beard.png" width="64px" />

    <h1>Paper</h1>

    <v0-paper
      border-color="#ffc0cb"
      border-radius="0.5em"
      border-style="solid"
      border-width="thin"
      padding="1em"
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto provident esse deserunt adipisci, officiis blanditiis aspernatur eius explicabo vero. Cupiditate numquam quisquam distinctio itaque magni ut eos fugit omnis.
    </v0-paper>

    <h1>Buttons</h1>

    <v0-button
      bg-color="primary"
      border-radius="0.25em"
      font-size="1em"
      font-weight="500"
      padding="0.5em 1em"
      text="Button"
    />

    <br>

    <v0-button
      bg-color="primary"
      border-radius="0.25em"
      disabled
      font-size="1em"
      font-weight="500"
      padding="0.5em 1em"
      text="Disabled"
    />

    <br>

    <v0-button
      bg-color="primary"
      border-radius="0.25em"
      font-size="1em"
      font-weight="500"
      padding="0.5em 1em"
      readonly
      text="Readonly"
    />

    <br>

    <v0-button
      bg-color="primary"
      border-radius="0.25em"
      font-size="1em"
      font-weight="500"
      loading
      padding="0.5em 1em"
      text="Button"
    >
      <template #loading>
        Loading...
      </template>
    </v0-button>

    <br>

    <v0-button
      border-color="primary"
      border-style="solid"
      border-width="thin"
      font-size="1em"
      font-weight="500"
      gap=".5em"
      padding=".5em"
      text="Button"
    >
      <template #prepend>
        <v0-icon color="primary" icon="mdi mdi-cog" />
      </template>

      <template #append>
        <v0-icon icon="mdi mdi-cog" />
      </template>
    </v0-button>

    <br>

    <v0-button
      border-color="primary"
      border-style="solid"
      border-width="thin"
      font-size="1em"
      font-weight="500"
      gap=".5em"
      padding=".5em"
      text="Button"
    >
      <template #prepend>
        <v0-avatar height="16px" src="https://cdn.vuetifyjs.com/images/john-beard.png" width="16px" />
      </template>

      <template #append>
        <v0-icon icon="mdi mdi-cog" />
      </template>
    </v0-button>
  </main>
</template>

<script setup>
  import V0Avatar from '@/components/V0Avatar/V0Avatar.vue'
  import V0Button from '@/components/V0Button/V0Button.vue'
  import V0Paper from '@/components/V0Paper/V0Paper.vue'
  import V0Icon from '@/components/V0Icon/V0Icon.vue'
  import V0Img from '@/components/V0Img/V0Img.vue'
  import { createTheme } from '@/composables/theme'

  createTheme({
    current: 'light',
  })
</script>
