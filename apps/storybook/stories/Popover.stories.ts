// Framework
import { Popover } from '@vuetify/v0'

// Utilities
import { ref } from 'vue'

// Types
import type { Meta, StoryObj } from '@storybook/vue3-vite'

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
      Activator: Popover.Activator,
      Content: Popover.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <Root v-slot="{ isSelected }">
        <Activator renderless v-slot="{ attrs }">
          <button
            v-bind="attrs"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {{ isSelected ? 'Close' : 'Open' }} Popover
          </button>
        </Activator>

        <Content class="p-4 bg-white rounded-xl shadow-xl ring-1 ring-zinc-950/5 w-64">
          <h3 class="font-semibold text-zinc-900 mb-2">Popover Title</h3>
          <p class="text-sm text-zinc-600">
            This is a simple popover with some content. Click the button again to close.
          </p>
        </Content>
      </Root>
    `,
  }),
}

// With v-model control
export const Controlled: Story = {
  args: {
    modelValue: true,
  },

  render: args => ({
    components: {
      Root: Popover.Root,
      Activator: Popover.Activator,
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
            class="px-3 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-lg ring-1 ring-emerald-200 hover:bg-emerald-100 transition-all duration-150"
          >
            Open
          </button>
          <button
            @click="isOpen = false"
            class="px-3 py-1.5 text-sm font-medium bg-red-50 text-red-700 rounded-lg ring-1 ring-red-200 hover:bg-red-100 transition-all duration-150"
          >
            Close
          </button>
        </div>

        <Root v-model="isOpen">
          <Activator renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg shadow-md shadow-violet-500/25 hover:bg-violet-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              Controlled Popover
            </button>
          </Activator>

          <Content class="p-4 bg-white rounded-xl shadow-xl ring-1 ring-zinc-950/5 w-64">
            <p class="text-sm text-zinc-600">
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
      Activator: Popover.Activator,
      Content: Popover.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <Root v-slot="{ isSelected, toggle }">
        <Activator renderless v-slot="{ attrs }">
          <button
            v-bind="attrs"
            class="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-200 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
          >
            <span>Menu</span>
            <svg
              class="size-4 transition-transform duration-150"
              :class="{ 'rotate-180': isSelected }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </Activator>

        <Content class="py-1.5 bg-white rounded-xl shadow-xl ring-1 ring-zinc-950/5 min-w-44">
          <button
            @click="toggle"
            class="w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
          >
            <svg class="size-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </button>
          <button
            @click="toggle"
            class="w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
          >
            <svg class="size-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </button>
          <button
            @click="toggle"
            class="w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
          >
            <svg class="size-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Help</span>
          </button>
          <div class="my-1.5 border-t border-zinc-100" />
          <button
            @click="toggle"
            class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign out</span>
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
      Activator: Popover.Activator,
      Content: Popover.Content,
    },
    setup () {
      const isHovered = ref(false)
      return { args, isHovered }
    },
    template: `
      <Root v-model="isHovered">
        <Activator renderless v-slot="{ attrs }">
          <button
            v-bind="attrs"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
            class="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
          >
            Hover me
          </button>
        </Activator>

        <Content class="px-3 py-2 bg-zinc-900 text-white text-sm rounded-lg shadow-xl">
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
      Activator: Popover.Activator,
      Content: Popover.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <Root v-slot="{ isSelected }">
        <Activator renderless v-slot="{ attrs }">
          <button
            v-bind="attrs"
            class="size-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2"
          >
            JD
          </button>
        </Activator>

        <Content class="p-4 bg-white rounded-2xl shadow-xl ring-1 ring-zinc-950/5 w-72">
          <div class="flex items-center gap-3 mb-4">
            <div class="size-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold flex items-center justify-center shadow-md shadow-violet-500/25">
              JD
            </div>
            <div>
              <div class="font-semibold text-zinc-900">John Doe</div>
              <div class="text-sm text-zinc-500">john@example.com</div>
            </div>
          </div>

          <div class="border-t border-zinc-100 pt-3 space-y-1">
            <button class="w-full text-left px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors flex items-center gap-3">
              <svg class="size-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </button>
            <button class="w-full text-left px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors flex items-center gap-3">
              <svg class="size-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Account Settings
            </button>
            <button class="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3">
              <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
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
      Activator: Popover.Activator,
      Content: Popover.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <Root v-slot="{ isSelected, toggle }">
        <Activator renderless v-slot="{ attrs }">
          <button
            v-bind="attrs"
            class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg shadow-md shadow-red-500/25 hover:bg-red-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            Delete Item
          </button>
        </Activator>

        <Content class="p-4 bg-white rounded-xl shadow-xl ring-1 ring-zinc-950/5 w-72">
          <div class="flex items-start gap-3 mb-4">
            <div class="size-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-zinc-900">Confirm Delete</h3>
              <p class="text-sm text-zinc-600 mt-1">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
            </div>
          </div>
          <div class="flex gap-2 justify-end">
            <button
              @click="toggle"
              class="px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="toggle"
              class="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors"
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
      Activator: Popover.Activator,
      Content: Popover.Content,
    },
    setup () {
      return { args }
    },
    template: `
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-zinc-700">Password requirements</span>
        <Root v-slot="{ isSelected }">
          <Activator renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="size-5 rounded-full bg-zinc-200 text-zinc-600 text-xs font-bold hover:bg-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
            >
              ?
            </button>
          </Activator>

          <Content class="p-4 bg-zinc-900 text-white rounded-xl shadow-xl w-64">
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2">
                <svg class="size-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                At least 8 characters
              </li>
              <li class="flex items-center gap-2">
                <svg class="size-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                One uppercase letter
              </li>
              <li class="flex items-center gap-2">
                <svg class="size-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                One lowercase letter
              </li>
              <li class="flex items-center gap-2">
                <svg class="size-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                One number
              </li>
              <li class="flex items-center gap-2">
                <svg class="size-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                One special character
              </li>
            </ul>
          </Content>
        </Root>
      </div>
    `,
  }),
}
