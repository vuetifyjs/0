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
      <Root class="w-80 border border-gray-200 rounded-lg divide-y divide-gray-200">
        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span class="font-medium">Panel 1</span>
              <span class="text-gray-400 transition-transform" :class="{ 'rotate-180': isSelected }">▼</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
            Content for panel 1. Only one panel can be open at a time in accordion mode.
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span class="font-medium">Panel 2</span>
              <span class="text-gray-400 transition-transform" :class="{ 'rotate-180': isSelected }">▼</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
            Content for panel 2. Click on another panel to collapse this one.
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span class="font-medium">Panel 3</span>
              <span class="text-gray-400 transition-transform" :class="{ 'rotate-180': isSelected }">▼</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
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
      <Root :multiple="true" class="w-80 border border-gray-200 rounded-lg divide-y divide-gray-200">
        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span class="font-medium">Section A</span>
              <span class="text-gray-400 transition-transform" :class="{ 'rotate-180': isSelected }">▼</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
            Multiple panels can be open simultaneously.
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span class="font-medium">Section B</span>
              <span class="text-gray-400 transition-transform" :class="{ 'rotate-180': isSelected }">▼</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
            Try opening multiple sections at once!
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span class="font-medium">Section C</span>
              <span class="text-gray-400 transition-transform" :class="{ 'rotate-180': isSelected }">▼</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
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
      <Root :mandatory="'force'" class="w-80 border border-gray-200 rounded-lg divide-y divide-gray-200">
        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span class="font-medium">Required Open</span>
              <span class="text-gray-400 transition-transform" :class="{ 'rotate-180': isSelected }">▼</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
            At least one panel must remain open with mandatory="force".
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors">
              <span class="font-medium">Try Closing All</span>
              <span class="text-gray-400 transition-transform" :class="{ 'rotate-180': isSelected }">▼</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
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
      <div class="flex flex-col gap-4">
        <div class="text-sm text-gray-500">
          Current: <code class="bg-gray-100 px-1 rounded">{{ expanded ?? 'none' }}</code>
        </div>

        <Root v-model="expanded" class="w-80 border border-gray-200 rounded-lg divide-y divide-gray-200">
          <Item value="panel-1" v-slot="{ isSelected }">
            <Header>
              <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50">
                <span class="font-medium">Panel 1</span>
                <span :class="{ 'rotate-180': isSelected }">▼</span>
              </Activator>
            </Header>
            <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
              Panel 1 content
            </Content>
          </Item>

          <Item value="panel-2" v-slot="{ isSelected }">
            <Header>
              <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50">
                <span class="font-medium">Panel 2</span>
                <span :class="{ 'rotate-180': isSelected }">▼</span>
              </Activator>
            </Header>
            <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
              Panel 2 content (default open)
            </Content>
          </Item>

          <Item value="panel-3" v-slot="{ isSelected }">
            <Header>
              <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50">
                <span class="font-medium">Panel 3</span>
                <span :class="{ 'rotate-180': isSelected }">▼</span>
              </Activator>
            </Header>
            <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
              Panel 3 content
            </Content>
          </Item>
        </Root>
      </div>
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
      <Root class="w-80 border border-gray-200 rounded-lg divide-y divide-gray-200">
        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50">
              <span class="font-medium">Enabled Panel</span>
              <span :class="{ 'rotate-180': isSelected }">▼</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
            This panel works normally.
          </Content>
        </Item>

        <Item :disabled="true" v-slot="{ isSelected, isDisabled }">
          <Header>
            <Activator
              class="w-full px-4 py-3 text-left flex justify-between items-center"
              :class="isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'"
            >
              <span class="font-medium">Disabled Panel</span>
              <span :class="{ 'rotate-180': isSelected }">▼</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
            This won't be visible.
          </Content>
        </Item>

        <Item v-slot="{ isSelected }">
          <Header>
            <Activator class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50">
              <span class="font-medium">Another Enabled</span>
              <span :class="{ 'rotate-180': isSelected }">▼</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-600 bg-gray-50">
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
      <Root class="w-96 space-y-2">
        <Item v-for="(faq, i) in faqs" :key="i" v-slot="{ isSelected }">
          <Header>
            <Activator
              class="w-full px-4 py-3 text-left rounded-lg flex justify-between items-center bg-indigo-50 hover:bg-indigo-100 transition-colors"
              :class="{ 'bg-indigo-100': isSelected }"
            >
              <span class="font-medium text-indigo-900">{{ faq.q }}</span>
              <span class="text-indigo-600 transition-transform" :class="{ 'rotate-45': isSelected }">+</span>
            </Activator>
          </Header>
          <Content v-if="isSelected" class="px-4 py-3 text-gray-700">
            {{ faq.a }}
          </Content>
        </Item>
      </Root>
    `,
  }),
}
