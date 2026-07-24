<script setup lang="ts">
  import {
    EmeraldStyleSheetAdapter,
    emeraldColors,
    EmButton,
    EmCheckbox,
    EmDialog,
    EmDialogActivator,
    EmDialogClose,
    EmDialogContent,
    EmDialogDescription,
    EmDialogFooter,
    EmDialogTitle,
    EmSelect,
    EmSelectActivator,
    EmSelectContent,
    EmSelectItem,
    EmSelectPlaceholder,
    EmSelectValue,
    EmSwitch,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  // Utilities
  import { shallowRef } from 'vue'

  // Inject Emerald tokens without fighting the app-wide createThemePlugin.
  if (IN_BROWSER) {
    const adapter = new EmeraldStyleSheetAdapter()
    adapter.upsert(adapter.generate({ emerald: emeraldColors }, false))
    document.documentElement.dataset.theme = 'emerald'
  }

  const dialogOpen = shallowRef(false)
  const loading = shallowRef(false)
  const checked = shallowRef(true)
  const mixed = shallowRef(true)
  const enabled = shallowRef(true)
  const name = shallowRef('Emerald')
  const email = shallowRef('')
  const fruit = shallowRef<string | undefined>()

  function onLoadDemo () {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 1500)
  }
</script>

<template>
  <div class="emerald-sink" data-theme="emerald">
    <header class="sink-header">
      <h1>Emerald Kitchen Sink</h1>
      <p>Wave 1 surface — visual check for #715.</p>
    </header>

    <section>
      <h2>Button</h2>

      <div class="row">
        <EmButton size="sm" variant="primary">Small</EmButton>
        <EmButton size="md" variant="primary">Medium</EmButton>
        <EmButton size="lg" variant="primary">Large</EmButton>
      </div>

      <div class="row">
        <EmButton variant="primary">Primary</EmButton>
        <EmButton variant="secondary">Secondary</EmButton>
        <EmButton variant="tertiary">Tertiary</EmButton>
        <EmButton variant="destructive">Destructive</EmButton>
      </div>

      <div class="row">
        <EmButton disabled>Disabled</EmButton>

        <EmButton :loading @click="onLoadDemo">
          {{ loading ? 'Loading…' : 'Click to load' }}
        </EmButton>
      </div>
    </section>

    <section>
      <h2>TextField</h2>

      <div class="stack narrow">
        <EmTextField v-model="name" label="Name" placeholder="Your name" />

        <EmTextField
          v-model="email"
          label="Email"
          placeholder="you@example.com"
          :rules="[v => !v || /@/.test(String(v)) || 'Must include @']"
          type="email"
          validate-on="blur"
        />
      </div>
    </section>

    <section>
      <h2>Checkbox</h2>

      <div class="stack">
        <EmCheckbox v-model="checked" size="sm">Small checked</EmCheckbox>
        <EmCheckbox v-model="checked" size="md">Medium</EmCheckbox>
        <EmCheckbox v-model="checked" size="lg">Large</EmCheckbox>
        <EmCheckbox v-model="checked" disabled>Disabled</EmCheckbox>
        <EmCheckbox v-model="mixed" indeterminate>Indeterminate (mixed)</EmCheckbox>
      </div>
    </section>

    <section>
      <h2>Switch</h2>

      <div class="stack">
        <EmSwitch v-model="enabled" size="sm">Small</EmSwitch>
        <EmSwitch v-model="enabled" size="md">Medium</EmSwitch>
        <EmSwitch v-model="enabled" size="lg">Large</EmSwitch>
        <EmSwitch v-model="enabled" disabled>Disabled</EmSwitch>
      </div>
    </section>

    <section>
      <h2>Select</h2>

      <div class="stack narrow">
        <EmSelect v-model="fruit">
          <EmSelectActivator>
            <EmSelectValue />
            <EmSelectPlaceholder>Pick a fruit</EmSelectPlaceholder>
          </EmSelectActivator>

          <EmSelectContent>
            <EmSelectItem value="apple">Apple</EmSelectItem>
            <EmSelectItem value="banana">Banana</EmSelectItem>
            <EmSelectItem value="cherry">Cherry</EmSelectItem>
            <EmSelectItem disabled value="durian">Durian (disabled)</EmSelectItem>
          </EmSelectContent>
        </EmSelect>

        <p class="muted">Selected: {{ fruit ?? '—' }}</p>
      </div>
    </section>

    <section>
      <h2>Dialog</h2>

      <div class="row">
        <EmDialog v-model="dialogOpen">
          <EmDialogActivator>
            Open dialog
          </EmDialogActivator>

          <EmDialogContent>
            <div class="dialog-head">
              <EmDialogTitle>Confirm action</EmDialogTitle>
              <EmDialogClose />
            </div>

            <EmDialogDescription>
              Wave 1 dialog shell — Content, Title, Description, Close.
            </EmDialogDescription>

            <EmDialogFooter>
              <EmButton variant="tertiary" @click="dialogOpen = false">Cancel</EmButton>
              <EmButton @click="dialogOpen = false">Confirm</EmButton>
            </EmDialogFooter>
          </EmDialogContent>
        </EmDialog>

        <EmDialog>
          <EmDialogActivator v-slot="{ attrs }" renderless>
            <EmButton v-bind="attrs" variant="secondary">Renderless + EmButton</EmButton>
          </EmDialogActivator>

          <EmDialogContent>
            <EmDialogTitle>Renderless activator</EmDialogTitle>

            <EmDialogDescription>
              No nested button — attrs land on EmButton.
            </EmDialogDescription>

            <EmDialogClose />
          </EmDialogContent>
        </EmDialog>
      </div>
    </section>
  </div>
</template>

<style>
  .emerald-sink {
    min-height: 100vh;
    padding: 2rem clamp(1rem, 4vw, 3rem) 4rem;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    background: var(--emerald-background, #fefefe);
    color: var(--emerald-on-background, #2b2d2e);
  }

  .sink-header {
    margin-bottom: 2rem;
  }

  .sink-header h1 {
    margin: 0 0 0.25rem;
    font-size: 1.75rem;
  }

  .sink-header p {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  section {
    margin-bottom: 2.5rem;
  }

  section h2 {
    margin: 0 0 0.75rem;
    font-size: 1.125rem;
    font-weight: 700;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .stack.narrow {
    max-width: 360px;
  }

  .muted {
    margin: 0;
    font-size: 0.875rem;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .dialog-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .dialog-head .emerald-dialog__title {
    flex: 1;
  }
</style>
