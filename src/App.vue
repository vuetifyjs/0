<template>
  <main style="background-color: var(--vl-background)">
    <h1>Paper</h1>

    <vl-paper padding="1em" border-color="#eaeaea" border-width="thin" border-style="solid" border-radius="0.5em">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto provident esse deserunt adipisci, officiis blanditiis aspernatur eius explicabo vero. Cupiditate numquam quisquam distinctio itaque magni ut eos fugit omnis.
    </vl-paper>

    <h1>Buttons</h1>

    <vl-button
      padding="0.5em 1em"
      text="Button"
      font-size="1em"
      font-weight="500"
      border-radius="0.25em"
      bg-color="primary"
    ></vl-button>

    <br>

    <vl-button
      padding="0.5em 1em"
      text="Disabled"
      font-size="1em"
      font-weight="500"
      border-radius="0.25em"
      bg-color="primary"
      disabled
    ></vl-button>

    <br>

    <vl-button
      padding="0.5em 1em"
      text="Readonly"
      font-size="1em"
      font-weight="500"
      border-radius="0.25em"
      bg-color="primary"
      readonly
    ></vl-button>

    <br>

    <vl-button
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
    </vl-button>

    <br>

    <vl-button
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
        <vl-icon icon="mdi mdi-cog" color="primary"></vl-icon>
      </template>

      <template #append>
        <vl-icon icon="mdi mdi-cog"></vl-icon>
      </template>
    </vl-button>
  </main>
</template>

<script setup>
  import VlButton from '@/components/VlButton/VlButton.vue'
  import VlPaper from '@/components/VlPaper/VlPaper.vue'
  import VlIcon from '@/components/VlIcon/VlIcon.vue'
  import { createTheme } from '@/composables/theme'

  const { theme, get } = createTheme({
    current: 'light',
  })
</script>
