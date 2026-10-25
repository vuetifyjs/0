<script setup lang="ts">
  import { Md1Button, Md1Checkbox, Md1Toolbar } from '@paper/md1'
  import { onMounted, ref, shallowRef, useTemplateRef } from 'vue'

  const wifi = shallowRef(true)

  const gallery = useTemplateRef<HTMLElement>('gallery')
  const spoken = ref<string[]>([])

  // Read each control's accessible name back from the DOM: what a screen reader announces.
  onMounted(() => {
    spoken.value = [...(gallery.value?.querySelectorAll<HTMLElement>('[data-spoken] :is(button, input, a)') ?? [])].map(control => {
      const label = control.getAttribute('aria-label')

      if (label) return label

      const id = control.getAttribute('aria-labelledby')
      const text = id ? document.querySelector(`#${CSS.escape(id)}`)?.textContent : control.closest('label')?.textContent

      return (text ?? control.textContent ?? '').trim()
    })
  })
</script>

<template>
  <div ref="gallery" class="md1-docs-a11y-labels">
    <figure class="md1-docs-a11y-label" data-spoken>
      <Md1Button aria-label="Switch to heyfromjonathan@gmail.com" icon="account-circle" />

      <figcaption class="md1-docs-a11y-label-caption">"{{ spoken[0] }}": the action and its target, without the control's type</figcaption>
    </figure>

    <figure class="md1-docs-a11y-label" data-spoken>
      <Md1Button aria-label="Search" icon="search" />

      <figcaption class="md1-docs-a11y-label-caption">"{{ spoken[1] }}": the role is announced already, so no "field" or "button"</figcaption>
    </figure>

    <figure class="md1-docs-a11y-label" data-spoken>
      <Md1Checkbox v-model="wifi" label="Download over Wi-Fi only" />

      <figcaption class="md1-docs-a11y-label-caption">"{{ spoken[2] }}": the state is announced by the checkbox, not repeated in the label</figcaption>
    </figure>

    <figure class="md1-docs-a11y-label" data-spoken>
      <Md1Button aria-label="Edit" icon="edit" />

      <figcaption class="md1-docs-a11y-label-caption">"{{ spoken[3] }}": what the icon does, not what it looks like</figcaption>
    </figure>

    <figure class="md1-docs-a11y-label" data-spoken>
      <Md1Toolbar class="md1-docs-a11y-label-bar" variant="primary">
        <Md1Toolbar.Nav aria-label="Show/hide navigation menu" />
      </Md1Toolbar>

      <figcaption class="md1-docs-a11y-label-caption">"{{ spoken[4] }}": the action, not the component's name</figcaption>
    </figure>

    <figure class="md1-docs-a11y-label" data-spoken>
      <Md1Button aria-label="Voice search" icon="mic" />

      <figcaption class="md1-docs-a11y-label-caption">"{{ spoken[5] }}": the task paired with the input method, never "Tap"</figcaption>
    </figure>

  </div>
</template>

<style>
  .md1-docs-a11y-labels {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
    max-width: 720px;
  }

  .md1-docs-a11y-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-1);
  }

  .md1-docs-a11y-label .md1-icon {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-a11y-label-bar {
    width: 72px;
  }

  .md1-docs-a11y-label-caption {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-align: center;
  }
</style>
