# v0 Storybook

Component stories for @vuetify/v0. Visual testing and documentation.

## Commands

```bash
pnpm dev       # Start on port 6006
pnpm build     # Build static storybook
pnpm preview   # Build and serve
```

## Stack

- **Storybook**: @storybook/vue3-vite
- **Docgen**: vue-component-meta
- **Styling**: UnoCSS with `presetWind4()` (Tailwind v4 syntax)

## Structure

```
.storybook/
├── main.ts       # Storybook config
└── preview.ts    # Preview decorators (if exists)
stories/
└── {Component}.stories.ts
```

## Story Pattern

Each component has one story file with multiple variants:

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Component } from '@vuetify/v0'

const meta: Meta<typeof Component.Root> = {
  title: 'Components/ComponentName',
  component: Component.Root as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { /* sub-components */ },
    setup() {
      return { args }
    },
    template: `
      <Component.Root v-bind="args">
        <!-- content -->
      </Component.Root>
    `,
  }),
}
```

## Conventions

- One story file per component
- Use UnoCSS utilities for styling in templates
- Export variants: `Default`, `WithFallback`, `Small`, `Large`, etc.
- Include `tags: ['autodocs']` for auto-generated docs
- Register all sub-components in `components` object
