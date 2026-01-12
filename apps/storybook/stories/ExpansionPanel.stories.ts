// Framework
import { ExpansionPanel } from '@vuetify/v0'

// Utilities
import { ref } from 'vue'

// Types
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof ExpansionPanel.Root> = {
  title: 'Components/ExpansionPanel',
  component: ExpansionPanel.Root as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Basic accordion (single expand)
export const Default: Story = {
  render: args => ({
    components: {
      Root: ExpansionPanel.Root,
      Item: ExpansionPanel.Item,
      Header: ExpansionPanel.Header,
      Activator: ExpansionPanel.Activator,
      Content: ExpansionPanel.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <Root class="w-80 bg-white rounded-xl shadow-lg ring-1 ring-zinc-950/5 overflow-hidden divide-y divide-zinc-100">
        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Panel 1</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            Content for panel 1. Only one panel can be open at a time in accordion mode.
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Panel 2</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            Content for panel 2. Click on another panel to collapse this one.
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Panel 3</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            Content for panel 3.
          </Content>
        </Item>
      </Root>
    `,
  }),
}

// Multiple expansion mode
export const Multiple: Story = {
  render: args => ({
    components: {
      Root: ExpansionPanel.Root,
      Item: ExpansionPanel.Item,
      Header: ExpansionPanel.Header,
      Activator: ExpansionPanel.Activator,
      Content: ExpansionPanel.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <Root :multiple="true" class="w-80 bg-white rounded-xl shadow-lg ring-1 ring-zinc-950/5 overflow-hidden divide-y divide-zinc-100">
        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Section A</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            Multiple panels can be open simultaneously.
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Section B</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            Try opening multiple sections at once!
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Section C</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            Each section toggles independently.
          </Content>
        </Item>
      </Root>
    `,
  }),
}

// With mandatory (prevent closing last)
export const Mandatory: Story = {
  render: args => ({
    components: {
      Root: ExpansionPanel.Root,
      Item: ExpansionPanel.Item,
      Header: ExpansionPanel.Header,
      Activator: ExpansionPanel.Activator,
      Content: ExpansionPanel.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <Root :mandatory="'force'" class="w-80 bg-white rounded-xl shadow-lg ring-1 ring-zinc-950/5 overflow-hidden divide-y divide-zinc-100">
        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Required Open</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            At least one panel must remain open with mandatory="force".
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Try Closing All</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            You cannot close the last open panel.
          </Content>
        </Item>
      </Root>
    `,
  }),
}

// With v-model
export const WithVModel: Story = {
  render: args => ({
    components: {
      Root: ExpansionPanel.Root,
      Item: ExpansionPanel.Item,
      Header: ExpansionPanel.Header,
      Activator: ExpansionPanel.Activator,
      Content: ExpansionPanel.Content,
    },
    setup () {
      const expanded = ref('panel-2')
      return { args, expanded }
    },
    template: `
      <Root v-model="expanded" class="w-80 bg-white rounded-xl shadow-lg ring-1 ring-zinc-950/5 overflow-hidden divide-y divide-zinc-100">
        <Item value="panel-1" v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Panel 1</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            Panel 1 content
          </Content>
        </Item>

        <Item value="panel-2" v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Panel 2</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            Panel 2 content (default open)
          </Content>
        </Item>

        <Item value="panel-3" v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Panel 3</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            Panel 3 content
          </Content>
        </Item>
      </Root>
    `,
  }),
}

// Disabled item
export const DisabledItem: Story = {
  render: args => ({
    components: {
      Root: ExpansionPanel.Root,
      Item: ExpansionPanel.Item,
      Header: ExpansionPanel.Header,
      Activator: ExpansionPanel.Activator,
      Content: ExpansionPanel.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <Root class="w-80 bg-white rounded-xl shadow-lg ring-1 ring-zinc-950/5 overflow-hidden divide-y divide-zinc-100">
        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Enabled Panel</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            This panel works normally.
          </Content>
        </Item>

        <Item :disabled="true" v-slot="{ isSelected, isDisabled }">
          <Header>
            <Activator
              class="w-full px-4 py-3.5 text-left flex justify-between items-center"
              :class="isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-50'"
            >
              <span class="font-medium text-sm text-zinc-900">Disabled Panel</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            This won't be visible.
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3.5 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50">
              <span class="font-medium text-sm text-zinc-900">Another Enabled</span>
              <svg
                class="size-5 text-zinc-400 transition-transform duration-200"
                :class="{ 'rotate-180': isSelected }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-sm text-zinc-600 bg-zinc-50/50">
            This panel also works.
          </Content>
        </Item>
      </Root>
    `,
  }),
}

// FAQ style
export const FAQStyle: Story = {
  render: args => ({
    components: {
      Root: ExpansionPanel.Root,
      Item: ExpansionPanel.Item,
      Header: ExpansionPanel.Header,
      Activator: ExpansionPanel.Activator,
      Content: ExpansionPanel.Content,
    },
    setup () {
      const faqs = [
        { q: 'What is v0?', a: 'v0 is a headless UI library for Vue 3, providing unstyled, accessible components.' },
        { q: 'How do I install it?', a: 'Run npm install @vuetify/v0 or pnpm add @vuetify/v0 in your project.' },
        { q: 'Is it accessible?', a: 'Yes! All components follow WAI-ARIA guidelines for maximum accessibility.' },
      ]
      return { args, faqs }
    },
    template: `
      <Root class="w-96 space-y-3">
        <Item v-for="(faq, i) in faqs" :key="i" v-slot="{ isSelected }">
          <div class="bg-white rounded-xl shadow-sm ring-1 ring-zinc-950/5 overflow-hidden">
            <Header>
              <Activator
                class="w-full px-5 py-4 text-left flex justify-between items-center transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50"
              >
                <span class="font-semibold text-sm text-zinc-900">{{ faq.q }}</span>
                <div
                  class="size-6 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="isSelected ? 'bg-blue-600 text-white rotate-45' : 'bg-zinc-100 text-zinc-500'"
                >
                  <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                </div>
              </Activator>
            </Header>
            <Content v-if="isSelected" class="px-5 pb-4 text-sm text-zinc-600">
              {{ faq.a }}
            </Content>
          </div>
        </Item>
      </Root>
    `,
  }),
}
