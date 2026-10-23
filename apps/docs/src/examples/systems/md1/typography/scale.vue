<script setup lang="ts">
  import { md1DesignSystem } from '@paper/md1'

  import type { Md1TypeStyle } from '@paper/md1'

  const { type, typeDesktop, typeInk } = md1DesignSystem

  const NAMES: Record<Md1TypeStyle, string> = {
    'display-4': 'Display 4',
    'display-3': 'Display 3',
    'display-2': 'Display 2',
    'display-1': 'Display 1',
    'headline': 'Headline',
    'title': 'Title',
    'subheading': 'Subheading',
    'subheading-2': 'Subheading 2',
    'body-2': 'Body 2',
    'body-1': 'Body 1',
    'caption': 'Caption',
    'button': 'Button',
    'menu': 'Menu',
  }

  const WEIGHTS: Record<string, string> = {
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    700: 'Bold',
  }

  function sp (size: string): string {
    return size.replace('px', '')
  }

  // One line of metrics per style, read from the token dictionary the
  // md1-type-* classes are generated against.
  const styles = (Object.keys(NAMES) as Md1TypeStyle[]).map(style => {
    const tokens = type[style]
    const desktop = style in typeDesktop ? typeDesktop[style as keyof typeof typeDesktop].size : tokens.size
    const size = desktop === tokens.size ? `${sp(tokens.size)} sp` : `${sp(tokens.size)} / ${sp(desktop)} sp`
    const leading = tokens.leading === '1' ? 'single line' : `${sp(tokens.leading)} dp leading`
    const tracking = Math.round(Number.parseFloat(tokens.tracking) * 1000)
    const ink = typeInk[style] === 'primary' ? '87%' : '54%'
    const caps = tokens.transform === 'uppercase' ? ', all caps' : ''

    return {
      style,
      name: NAMES[style],
      metrics: `${WEIGHTS[tokens.weight]} ${size}, ${leading}, tracking ${tracking}${caps}, ink ${ink}`,
    }
  })
</script>

<template>
  <div class="md1-docs-scale">
    <div v-for="item in styles" :key="item.style" class="md1-docs-scale-row">
      <p class="md1-docs-scale-sample" :class="`md1-type-${item.style}`">{{ item.name }}</p>

      <p class="md1-docs-scale-metrics">
        <code class="md1-docs-scale-class">.md1-type-{{ item.style }}</code>
        {{ item.metrics }}
      </p>
    </div>
  </div>
</template>

<style>
  .md1-docs-scale {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
  }

  /* Single-line styles stay on one line (the typography page); the narrowest screens clip the largest. */
  .md1-docs-scale-sample {
    margin: 0;
    overflow-x: clip;
    overflow-y: visible;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .md1-docs-scale-metrics {
    margin: var(--md1-spacing-1, 8px) 0 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-scale-class {
    margin-inline-end: var(--md1-spacing-1, 8px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
