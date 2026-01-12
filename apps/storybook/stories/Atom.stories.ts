// Framework
import { Atom } from '@vuetify/v0'

// Types
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Atom> = {
  title: 'Components/Atom',
  component: Atom as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Default renders as div
export const Default: Story = {
  render: args => ({
    components: { Atom },
    setup () {
      return { args }
    },
    template: `
      <Atom v-bind="args" class="p-4 bg-zinc-100 rounded-xl text-sm text-zinc-700 ring-1 ring-zinc-950/5">
        I am a div by default
      </Atom>
    `,
  }),
}

// Render as button
export const AsButton: Story = {
  render: args => ({
    components: { Atom },
    setup () {
      return { args }
    },
    template: `
      <Atom as="button" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
        Click me
      </Atom>
    `,
  }),
}

// Render as anchor
export const AsAnchor: Story = {
  render: args => ({
    components: { Atom },
    setup () {
      return { args }
    },
    template: `
      <Atom as="a" href="#" class="text-blue-600 font-medium hover:text-blue-700 underline underline-offset-2 transition-colors">
        I am a link
      </Atom>
    `,
  }),
}

// Render as span
export const AsSpan: Story = {
  render: args => ({
    components: { Atom },
    setup () {
      return { args }
    },
    template: `
      <p class="text-zinc-700">
        This is a paragraph with an
        <Atom as="span" class="font-bold text-violet-600"> inline span </Atom>
        inside it.
      </p>
    `,
  }),
}

// Self-closing tag (img)
export const AsSelfClosingImage: Story = {
  render: args => ({
    components: { Atom },
    setup () {
      return { args }
    },
    template: `
      <Atom
        as="img"
        src="https://picsum.photos/200/200"
        alt="Random image"
        class="rounded-xl shadow-lg ring-1 ring-zinc-950/5"
      />
    `,
  }),
}

// Self-closing tag (input)
export const AsSelfClosingInput: Story = {
  render: args => ({
    components: { Atom },
    setup () {
      return { args }
    },
    template: `
      <Atom
        as="input"
        type="text"
        placeholder="Type here..."
        class="px-4 py-2.5 bg-white text-zinc-900 placeholder:text-zinc-400 rounded-lg ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
      />
    `,
  }),
}

// Renderless mode
export const Renderless: Story = {
  render: args => ({
    components: { Atom },
    setup () {
      return { args }
    },
    template: `
      <Atom :renderless="true" v-slot="slotProps">
        <button
          v-bind="slotProps"
          class="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-md shadow-emerald-500/25 hover:bg-emerald-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          Renderless button (no wrapper)
        </button>
      </Atom>
    `,
  }),
}

// Null mode (equivalent to renderless)
export const NullMode: Story = {
  render: args => ({
    components: { Atom },
    setup () {
      return { args }
    },
    template: `
      <Atom :as="null" v-slot="slotProps">
        <span
          v-bind="slotProps"
          class="text-violet-600 font-semibold"
        >
          as=null is equivalent to renderless
        </span>
      </Atom>
    `,
  }),
}

// Multiple elements showcase
export const ElementShowcase: Story = {
  render: args => ({
    components: { Atom },
    setup () {
      const elements = ['div', 'section', 'article', 'aside', 'main', 'header', 'footer', 'nav']
      return { args, elements }
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <Atom
          v-for="el in elements"
          :key="el"
          :as="el"
          class="px-3 py-1.5 bg-zinc-100 rounded-lg text-sm font-mono text-zinc-600 ring-1 ring-zinc-950/5"
        >
          {{ el }}
        </Atom>
      </div>
    `,
  }),
}

// Button variants
export const ButtonVariants: Story = {
  render: args => ({
    components: { Atom },
    setup () {
      return { args }
    },
    template: `
      <div class="flex flex-wrap gap-3">
        <Atom as="button" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
          Primary
        </Atom>

        <Atom as="button" class="px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg ring-1 ring-zinc-200 hover:bg-zinc-200 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-500/50">
          Secondary
        </Atom>

        <Atom as="button" class="px-4 py-2 bg-white text-zinc-700 text-sm font-medium rounded-lg ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-500/50">
          Outline
        </Atom>

        <Atom as="button" class="px-4 py-2 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
          Ghost
        </Atom>

        <Atom as="button" class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg shadow-md shadow-red-500/25 hover:bg-red-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/50">
          Danger
        </Atom>
      </div>
    `,
  }),
}

// Card example
export const AsCard: Story = {
  render: args => ({
    components: { Atom },
    setup () {
      return { args }
    },
    template: `
      <Atom as="article" class="w-72 p-5 bg-white rounded-2xl shadow-lg ring-1 ring-zinc-950/5">
        <Atom as="img" src="https://picsum.photos/288/160" alt="Card image" class="w-full h-40 object-cover rounded-xl mb-4" />
        <Atom as="h3" class="font-semibold text-zinc-900 mb-2">Card Title</Atom>
        <Atom as="p" class="text-sm text-zinc-600 mb-4">
          This is a card built entirely with Atom components, demonstrating polymorphic element rendering.
        </Atom>
        <Atom as="button" class="w-full px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500/50">
          Learn More
        </Atom>
      </Atom>
    `,
  }),
}
