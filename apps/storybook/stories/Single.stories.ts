import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Single } from '@vuetify/v0'
import { ref } from 'vue'

const meta: Meta<typeof Single.Root> = {
  title: 'Components/Single',
  component: Single.Root as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Basic single selection
export const Default: Story = {
  render: args => ({
    components: { Root: Single.Root, Item: Single.Item },
    setup () {
      const selected = ref<string | undefined>()
      return { args, selected }
    },
    template: `
      <div class="flex flex-col gap-4">
        <div class="text-sm text-gray-500">
          Selected: <code class="bg-gray-100 px-1 rounded">{{ selected ?? 'none' }}</code>
        </div>

        <Root v-model="selected" class="flex gap-2">
          <Item value="red" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-red-500 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'"
            >
              Red
            </button>
          </Item>

          <Item value="green" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-green-500 text-white' : 'bg-green-100 hover:bg-green-200 text-green-700'"
            >
              Green
            </button>
          </Item>

          <Item value="blue" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'"
            >
              Blue
            </button>
          </Item>
        </Root>
      </div>
    `,
  }),
}

// Tab-style navigation
export const TabStyle: Story = {
  render: args => ({
    components: { Root: Single.Root, Item: Single.Item },
    setup () {
      const activeTab = ref('overview')
      const tabs = ['Overview', 'Features', 'Pricing', 'FAQ']
      return { args, activeTab, tabs }
    },
    template: `
      <div class="w-96">
        <Root v-model="activeTab" class="flex border-b border-gray-200">
          <Item v-for="tab in tabs" :key="tab" :value="tab.toLowerCase()" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors"
              :class="isSelected
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab }}
            </button>
          </Item>
        </Root>

        <div class="p-4 text-gray-600">
          Content for <strong class="text-gray-900">{{ activeTab }}</strong> tab
        </div>
      </div>
    `,
  }),
}

// Pill navigation
export const PillStyle: Story = {
  render: args => ({
    components: { Root: Single.Root, Item: Single.Item },
    setup () {
      const selected = ref('all')
      return { args, selected }
    },
    template: `
      <Root v-model="selected" class="flex gap-1 p-1 bg-gray-100 rounded-full">
        <Item value="all" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            :class="isSelected ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'"
          >
            All
          </button>
        </Item>

        <Item value="active" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            :class="isSelected ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'"
          >
            Active
          </button>
        </Item>

        <Item value="completed" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            :class="isSelected ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'"
          >
            Completed
          </button>
        </Item>
      </Root>
    `,
  }),
}

// Icon buttons
export const IconButtons: Story = {
  render: args => ({
    components: { Root: Single.Root, Item: Single.Item },
    setup () {
      const alignment = ref('left')
      return { args, alignment }
    },
    template: `
      <Root v-model="alignment" class="inline-flex border border-gray-200 rounded-lg overflow-hidden">
        <Item value="left" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="p-2 transition-colors"
            :class="isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h6" />
            </svg>
          </button>
        </Item>

        <Item value="center" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="p-2 border-x border-gray-200 transition-colors"
            :class="isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M9 18h6" />
            </svg>
          </button>
        </Item>

        <Item value="right" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="p-2 transition-colors"
            :class="isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M14 18h6" />
            </svg>
          </button>
        </Item>
      </Root>
    `,
  }),
}

// With mandatory (force)
export const MandatoryForce: Story = {
  render: args => ({
    components: { Root: Single.Root, Item: Single.Item },
    setup () {
      const selected = ref<string | undefined>()
      return { args, selected }
    },
    template: `
      <div class="flex flex-col gap-4">
        <p class="text-sm text-gray-500">mandatory="force" auto-selects first item:</p>

        <Root v-model="selected" mandatory="force" class="flex gap-2">
          <Item value="first" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              First
            </button>
          </Item>

          <Item value="second" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              Second
            </button>
          </Item>

          <Item value="third" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              Third
            </button>
          </Item>
        </Root>
      </div>
    `,
  }),
}

// Vertical list selection
export const VerticalList: Story = {
  render: args => ({
    components: { Root: Single.Root, Item: Single.Item },
    setup () {
      const selected = ref('inbox')
      const items = [
        { id: 'inbox', label: 'Inbox', count: 12 },
        { id: 'starred', label: 'Starred', count: 3 },
        { id: 'sent', label: 'Sent', count: 0 },
        { id: 'drafts', label: 'Drafts', count: 2 },
        { id: 'trash', label: 'Trash', count: 0 },
      ]
      return { args, selected, items }
    },
    template: `
      <Root v-model="selected" class="w-48 border border-gray-200 rounded-lg overflow-hidden">
        <Item v-for="item in items" :key="item.id" :value="item.id" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="w-full px-4 py-2 text-left flex justify-between items-center transition-colors"
            :class="isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'"
          >
            <span :class="isSelected ? 'font-medium' : ''">{{ item.label }}</span>
            <span
              v-if="item.count > 0"
              class="text-xs px-1.5 py-0.5 rounded-full"
              :class="isSelected ? 'bg-blue-100' : 'bg-gray-100'"
            >
              {{ item.count }}
            </span>
          </button>
        </Item>
      </Root>
    `,
  }),
}

// Color picker
export const ColorPicker: Story = {
  render: args => ({
    components: { Root: Single.Root, Item: Single.Item },
    setup () {
      const color = ref('blue')
      const colors = [
        { id: 'red', class: 'bg-red-500' },
        { id: 'orange', class: 'bg-orange-500' },
        { id: 'yellow', class: 'bg-yellow-500' },
        { id: 'green', class: 'bg-green-500' },
        { id: 'blue', class: 'bg-blue-500' },
        { id: 'purple', class: 'bg-purple-500' },
        { id: 'pink', class: 'bg-pink-500' },
      ]
      return { args, color, colors }
    },
    template: `
      <div class="flex flex-col gap-4">
        <Root v-model="color" class="flex gap-2">
          <Item v-for="c in colors" :key="c.id" :value="c.id" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="size-8 rounded-full transition-transform"
              :class="[c.class, isSelected ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105']"
            />
          </Item>
        </Root>

        <div class="text-sm text-gray-500">
          Selected: <span class="capitalize font-medium">{{ color }}</span>
        </div>
      </div>
    `,
  }),
}
