<template>
  <main style="background-color: var(--v0-background)">
    <h1>Paper</h1>

    <v0-paper padding="1em" border-color="#eaeaea" border-width="thin" border-style="solid" border-radius="0.5em">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto provident esse deserunt adipisci, officiis blanditiis aspernatur eius explicabo vero. Cupiditate numquam quisquam distinctio itaque magni ut eos fugit omnis.
    </v0-paper>

    <h1>Buttons</h1>

    <v0-button
      padding="0.5em 1em"
      text="Button"
      font-size="1em"
      font-weight="500"
      border-radius="0.25em"
      bg-color="primary"
    ></v0-button>

    <br>

    <v0-button
      padding="0.5em 1em"
      text="Disabled"
      font-size="1em"
      font-weight="500"
      border-radius="0.25em"
      bg-color="primary"
      disabled
    ></v0-button>

    <br>

    <v0-button
      padding="0.5em 1em"
      text="Readonly"
      font-size="1em"
      font-weight="500"
      border-radius="0.25em"
      bg-color="primary"
      readonly
    ></v0-button>

    <br>

    <v0-button
      padding="0.5em 1em"
      text="Button"
      font-size="1em"
      font-weight="500"
      border-radius="0.25em"
      bg-color="primary"
      loading
    >
      <template #loading>
        Loading...
      </template>
    </v0-button>

    <br>

    <v0-button
      padding=".5em"
      gap=".5em"
      text="Button"
      font-size="1em"
      font-weight="500"
      border-style="solid"
      border-width="thin"
      border-color="primary"
    >
      <template #prepend>
        <v0-icon icon="mdi mdi-cog" color="primary"></v0-icon>
      </template>

      <template #append>
        <v0-icon icon="mdi mdi-cog"></v0-icon>
      </template>
    </v0-button>
  </main>
</template>

<script setup>
  import V0Button from '@/components/V0Button/V0Button.vue'
  import V0Paper from '@/components/V0Paper/V0Paper.vue'
  import V0Icon from '@/components/V0Icon/V0Icon.vue'
  import { createTheme } from '@/composables/theme'

  const { theme, get } = createTheme({
    current: 'light',
  })
</script>
