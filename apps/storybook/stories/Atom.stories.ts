import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Atom } from '@vuetify/v0'

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
      <Atom v-bind="args" class="p-4 bg-gray-100 rounded">
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
      <Atom as="button" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
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
      <Atom as="a" href="#" class="text-blue-500 underline hover:text-blue-700">
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
      <p class="text-gray-700">
        This is a paragraph with an
        <Atom as="span" class="font-bold text-indigo-600"> inline span </Atom>
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
        class="rounded-lg shadow-md"
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
        class="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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
          class="text-purple-600 font-semibold"
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
          class="px-3 py-1 bg-gray-200 rounded text-sm font-mono"
        >
          {{ el }}
        </Atom>
      </div>
    `,
  }),
}
