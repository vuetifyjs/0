// Framework
import { Single } from '@vuetify/v0'

// Utilities
import { ref } from 'vue'

// Types
import type { Meta, StoryObj } from '@storybook/vue3-vite'

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
      <Root v-model="selected" class="flex gap-2">
        <Item value="red" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            :class="isSelected
              ? 'bg-red-600 text-white shadow-md shadow-red-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Red
          </button>
        </Item>

        <Item value="green" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            :class="isSelected
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Green
          </button>
        </Item>

        <Item value="blue" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Blue
          </button>
        </Item>
      </Root>
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
        <Root v-model="activeTab" class="flex border-b border-zinc-200">
          <Item v-for="tab in tabs" :key="tab" :value="tab.toLowerCase()" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="relative px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:text-blue-600"
              :class="isSelected ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'"
            >
              {{ tab }}
              <span
                v-if="isSelected"
                class="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600 rounded-full"
              />
            </button>
          </Item>
        </Root>

        <div class="p-6 text-sm text-zinc-600">
          Content for <span class="font-semibold text-zinc-900">{{ activeTab }}</span>
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
      <Root v-model="selected" class="inline-flex gap-1 p-1 bg-zinc-100 rounded-full">
        <Item value="all" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 focus:outline-none"
            :class="isSelected
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'"
          >
            All
          </button>
        </Item>

        <Item value="active" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 focus:outline-none"
            :class="isSelected
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'"
          >
            Active
          </button>
        </Item>

        <Item value="completed" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 focus:outline-none"
            :class="isSelected
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'"
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
      <Root v-model="alignment" class="inline-flex p-1 bg-zinc-100 rounded-lg">
        <Item value="left" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="p-2 rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'"
          >
            <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h6" />
            </svg>
          </button>
        </Item>

        <Item value="center" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="p-2 rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'"
          >
            <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M9 18h6" />
            </svg>
          </button>
        </Item>

        <Item value="right" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="p-2 rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'"
          >
            <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <Root v-model="selected" mandatory="force" class="flex gap-2">
        <Item value="first" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            :class="isSelected
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            First
          </button>
        </Item>

        <Item value="second" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            :class="isSelected
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Second
          </button>
        </Item>

        <Item value="third" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            :class="isSelected
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Third
          </button>
        </Item>
      </Root>
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
      <Root v-model="selected" class="w-52 bg-white rounded-xl shadow-lg ring-1 ring-zinc-950/5 overflow-hidden p-1.5">
        <Item v-for="item in items" :key="item.id" :value="item.id" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="w-full px-3 py-2 rounded-lg text-left flex justify-between items-center transition-all duration-150 focus:outline-none"
            :class="isSelected
              ? 'bg-blue-50 text-blue-700'
              : 'text-zinc-600 hover:bg-zinc-50'"
          >
            <span class="text-sm" :class="isSelected ? 'font-semibold' : 'font-medium'">{{ item.label }}</span>
            <span
              v-if="item.count > 0"
              class="text-xs font-medium px-2 py-0.5 rounded-full"
              :class="isSelected ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-500'"
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
        { id: 'red', bg: 'bg-red-500', ring: 'ring-red-500' },
        { id: 'orange', bg: 'bg-orange-500', ring: 'ring-orange-500' },
        { id: 'amber', bg: 'bg-amber-500', ring: 'ring-amber-500' },
        { id: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
        { id: 'blue', bg: 'bg-blue-500', ring: 'ring-blue-500' },
        { id: 'violet', bg: 'bg-violet-500', ring: 'ring-violet-500' },
        { id: 'pink', bg: 'bg-pink-500', ring: 'ring-pink-500' },
      ]
      return { args, color, colors }
    },
    template: `
      <Root v-model="color" class="flex gap-2.5">
        <Item v-for="c in colors" :key="c.id" :value="c.id" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="size-8 rounded-full transition-all duration-150 focus:outline-none"
            :class="[
              c.bg,
              isSelected
                ? ['ring-2 ring-offset-2', c.ring, 'scale-110']
                : 'hover:scale-105 opacity-80 hover:opacity-100'
            ]"
          />
        </Item>
      </Root>
    `,
  }),
}
