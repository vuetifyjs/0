<template>
  <main>
    <div style="display: flex; gap: 1em;">
      <v0-avatar bg-color="accent" text="JD" />
      <v0-avatar bg-color="warning" icon="mdi mdi-cog" />
      <v0-avatar src="https://cdn.vuetifyjs.com/images/john-beard.png" />

      <v0-avatar>
        <template #fallback>
          <v0-icon color="success" icon="mdi mdi-cog" />
        </template>
      </v0-avatar>
    </div>

    <br>
    <br>
    <br>
    <br>

    <v0-paper elevation="xxl" max-width="300px" padding="1em">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni culpa amet aut velit laudantium? Obcaecati sit doloribus porro provident quisquam illum explicabo, ut nulla commodi sequi cum, unde veritatis adipisci!
    </v0-paper>

    <h1>Avatars</h1>
    <v0-avatar height="32px" src="https://cdn.vuetifyjs.com/images/john-beard.png" width="32px" />
    <!-- <v0-avatar bg-color="primary" font-size="24px" icon="mdi mdi-cog" /> -->

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
  import { createTheme } from '@/composables/theme'

  createTheme({
    current: 'light',
  })

  createElevation({
    levels: {
      sm: 2,
      md: 4,
      xxl: 16,
    },
  })
</script>
