<script setup lang="ts">
  import { Md1Switch } from '@paper/md1'
  import { useResizeObserver } from '@vuetify/v0'
  import { ref, shallowRef, useTemplateRef } from 'vue'

  const grid = shallowRef(true)

  const styles = [
    { name: 'Display 1', type: 'display-1', text: 'Others have failed, I will not.' },
    { name: 'Headline', type: 'headline', text: 'Where others have failed, I will not fail.' },
    { name: 'Title', type: 'title', text: 'Science is made up of mistakes' },
    { name: 'Subheading', type: 'subheading', text: 'but they are mistakes which it is useful to make,' },
    { name: 'Body 1', type: 'body-1', text: 'because they lead little by little to the truth. Every line of this paragraph sits on the 4 dp grid, because its leading is a multiple of 4.' },
    { name: 'Caption', type: 'caption', text: 'Jules Verne, Journey to the Center of the Earth' },
  ]

  const specimen = useTemplateRef<HTMLElement>('specimen')
  const metrics = ref<string[]>([])

  // Read each style's size and leading back from the stylesheet.
  useResizeObserver(specimen, () => {
    const el = specimen.value

    if (!el) return

    metrics.value = [...el.querySelectorAll<HTMLElement>('[data-type]')].map(block => {
      const style = getComputedStyle(block)

      return `${Number.parseFloat(style.fontSize)} sp / ${Number.parseFloat(style.lineHeight)}`
    })
  })
</script>

<template>
  <div class="md1-docs-layout-baseline-stack">
    <Md1Switch v-model="grid" label="4 dp baseline grid" />

    <div ref="specimen" class="md1-docs-layout-baseline-sheet md1-elevation-2" :data-grid="grid || undefined">
      <div v-for="(style, index) in styles" :key="style.type" class="md1-docs-layout-baseline-row">
        <p :class="`md1-type-${style.type}`" :data-type="style.type">{{ style.text }}</p>

        <span class="md1-docs-layout-baseline-label">{{ style.name }} {{ metrics[index] }}</span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-baseline-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  /* Padding, gaps and every leading are multiples of 4, so each line lands on a grid line. */
  .md1-docs-layout-baseline-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 560px;
    padding: var(--md1-spacing-3, 24px);
    border-radius: var(--md1-radius, 2px);
    background-color: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-layout-baseline-sheet[data-grid] {
    background-image: repeating-linear-gradient(to bottom, transparent 0 3px, rgb(233 30 99 / 0.3) 3px 4px);
  }

  .md1-docs-layout-baseline-row + .md1-docs-layout-baseline-row {
    margin-top: var(--md1-spacing-2, 16px);
  }

  .md1-docs-layout-baseline-row > p {
    margin: 0;
  }

  .md1-docs-layout-baseline-label {
    display: block;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 11px;
    line-height: 16px;
    color: #C2185B;
  }

  /* Pink 200 on the dark sheet, where Pink 700 would not read. */
  [data-theme='md1-dark'] .md1-docs-layout-baseline-label {
    color: #F48FB1;
  }
</style>
