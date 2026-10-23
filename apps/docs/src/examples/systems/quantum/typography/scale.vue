<script setup lang="ts">
  import { quantumDesignSystem } from '@paper/quantum'

  import type { QuantumTypeStyle } from '@paper/quantum'

  const { type, typeDesktop, typeInk } = quantumDesignSystem

  const NAMES: Record<QuantumTypeStyle, string> = {
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
  // quantum-type-* classes are generated against.
  const styles = (Object.keys(NAMES) as QuantumTypeStyle[]).map(style => {
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
  <div class="quantum-docs-scale">
    <div v-for="item in styles" :key="item.style" class="quantum-docs-scale-row">
      <p class="quantum-docs-scale-sample" :class="`quantum-type-${item.style}`">{{ item.name }}</p>

      <p class="quantum-docs-scale-metrics">
        <code class="quantum-docs-scale-class">.quantum-type-{{ item.style }}</code>
        {{ item.metrics }}
      </p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-scale {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-3, 24px);
  }

  /* Single-line styles stay on one line (the typography page); the narrowest screens clip the largest. */
  .quantum-docs-scale-sample {
    margin: 0;
    overflow-x: clip;
    overflow-y: visible;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .quantum-docs-scale-metrics {
    margin: var(--quantum-spacing-1, 8px) 0 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-scale-class {
    margin-inline-end: var(--quantum-spacing-1, 8px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
