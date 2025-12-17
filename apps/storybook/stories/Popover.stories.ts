import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Popover } from '@vuetify/v0'
import { ref } from 'vue'

const meta: Meta<typeof Popover.Root> = {
  title: 'Components/Popover',
  component: Popover.Root as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Basic popover
export const Default: Story = {
  render: args => ({
    components: {
      Root: Popover.Root,
      Anchor: Popover.Anchor,
      Content: Popover.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <Root v-slot="{ isSelected }">
        <Anchor>
          <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            {{ isSelected ? 'Close' : 'Open' }} Popover
          </button>
        </Anchor>

        <Content v-if="isSelected" class="mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-64">
          <h3 class="font-medium text-gray-900 mb-2">Popover Title</h3>
          <p class="text-sm text-gray-600">
            This is a simple popover with some content. Click the button again to close.
          </p>
        </Content>
      </Root>
    `,
  }),
}

// With v-model control
export const Controlled: Story = {
  render: args => ({
    components: {
      Root: Popover.Root,
      Anchor: Popover.Anchor,
      Content: Popover.Content,
    },
    setup () {
      const isOpen = ref(false)
      return { args, isOpen }
    },
    template: `
      <div class="flex flex-col items-center gap-4">
        <div class="flex gap-2">
          <button
            @click="isOpen = true"
            class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Open
          </button>
          <button
            @click="isOpen = false"
            class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Close
          </button>
        </div>

        <Root v-model="isOpen">
          <Anchor>
            <button class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors">
              Controlled Popover
            </button>
          </Anchor>

          <Content v-if="isOpen" class="mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-64">
            <p class="text-sm text-gray-600">
              This popover is controlled externally via v-model.
            </p>
          </Content>
        </Root>
      </div>
    `,
  }),
}

// Dropdown menu style
export const DropdownMenu: Story = {
  render: args => ({
    components: {
      Root: Popover.Root,
      Anchor: Popover.Anchor,
      Content: Popover.Content,
    },
    setup () {
      const menuItems = [
        { label: 'Profile', icon: '👤' },
        { label: 'Settings', icon: '⚙️' },
        { label: 'Help', icon: '❓' },
        { label: 'Sign out', icon: '🚪' },
      ]
      return { args, menuItems }
    },
    template: `
      <Root v-slot="{ isSelected, toggle }">
        <Anchor>
          <button class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <span>Menu</span>
            <span class="transition-transform" :class="{ 'rotate-180': isSelected }">▼</span>
          </button>
        </Anchor>

        <Content v-if="isSelected" class="mt-1 py-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-40">
          <button
            v-for="item in menuItems"
            :key="item.label"
            @click="toggle"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </button>
        </Content>
      </Root>
    `,
  }),
}

// Tooltip style
export const TooltipStyle: Story = {
  render: args => ({
    components: {
      Root: Popover.Root,
      Anchor: Popover.Anchor,
      Content: Popover.Content,
    },
    setup () {
      const isHovered = ref(false)
      return { args, isHovered }
    },
    template: `
      <Root v-model="isHovered">
        <Anchor>
          <button
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
            class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Hover me
          </button>
        </Anchor>

        <Content
          v-if="isHovered"
          class="mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg"
        >
          This is a tooltip-style popover
        </Content>
      </Root>
    `,
  }),
}

// User profile card
export const ProfileCard: Story = {
  render: args => ({
    components: {
      Root: Popover.Root,
      Anchor: Popover.Anchor,
      Content: Popover.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <Root v-slot="{ isSelected }">
        <Anchor>
          <button class="size-10 rounded-full bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors">
            JD
          </button>
        </Anchor>

        <Content v-if="isSelected" class="mt-2 p-4 bg-white rounded-xl shadow-xl border border-gray-200 w-72">
          <div class="flex items-center gap-3 mb-3">
            <div class="size-12 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center">
              JD
            </div>
            <div>
              <div class="font-semibold text-gray-900">John Doe</div>
              <div class="text-sm text-gray-500">john@example.com</div>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-3 space-y-2">
            <button class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              View Profile
            </button>
            <button class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              Account Settings
            </button>
            <button class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
              Sign Out
            </button>
          </div>
        </Content>
      </Root>
    `,
  }),
}

// Confirmation dialog
export const ConfirmationDialog: Story = {
  render: args => ({
    components: {
      Root: Popover.Root,
      Anchor: Popover.Anchor,
      Content: Popover.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <Root v-slot="{ isSelected, toggle }">
        <Anchor>
          <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            Delete Item
          </button>
        </Anchor>

        <Content v-if="isSelected" class="mt-2 p-4 bg-white rounded-lg shadow-xl border border-gray-200 w-72">
          <h3 class="font-semibold text-gray-900 mb-2">Confirm Delete</h3>
          <p class="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
          <div class="flex gap-2 justify-end">
            <button
              @click="toggle"
              class="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              @click="toggle"
              class="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </Content>
      </Root>
    `,
  }),
}

// Info popover
export const InfoPopover: Story = {
  render: args => ({
    components: {
      Root: Popover.Root,
      Anchor: Popover.Anchor,
      Content: Popover.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <div class="flex items-center gap-2">
        <span class="text-gray-700">Password requirements</span>
        <Root v-slot="{ isSelected }">
          <Anchor>
            <button class="size-5 rounded-full bg-gray-200 text-gray-600 text-xs hover:bg-gray-300 transition-colors">
              ?
            </button>
          </Anchor>

          <Content v-if="isSelected" class="mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg w-64">
            <ul class="space-y-1 text-gray-200">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
              <li>• One special character</li>
            </ul>
          </Content>
        </Root>
      </div>
    `,
  }),
}
