import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Pagination } from '@vuetify/v0'
import { ref } from 'vue'

const meta: Meta<typeof Pagination.Root> = {
  title: 'Components/Pagination',
  component: Pagination.Root as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Basic pagination
export const Default: Story = {
  render: args => ({
    components: {
      Root: Pagination.Root,
      First: Pagination.First,
      Prev: Pagination.Prev,
      Item: Pagination.Item,
      Ellipsis: Pagination.Ellipsis,
      Next: Pagination.Next,
      Last: Pagination.Last,
    },
    setup () {
      const page = ref(1)
      return { args, page }
    },
    template: `
      <div class="flex flex-col items-center gap-4">
        <div class="text-sm text-gray-500">Page {{ page }} of 10</div>

        <Root v-model="page" :length="10" v-slot="{ items }">
          <div class="flex items-center gap-1">
            <First v-slot="{ isDisabled }">
              <button
                class="px-3 py-2 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isDisabled"
              >
                ««
              </button>
            </First>

            <Prev v-slot="{ isDisabled }">
              <button
                class="px-3 py-2 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isDisabled"
              >
                ‹
              </button>
            </Prev>

            <template v-for="item in items" :key="item.key">
              <Item v-if="item.type === 'page'" :value="item.value" v-slot="{ isSelected }">
                <button
                  class="w-10 h-10 rounded transition-colors"
                  :class="isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'"
                >
                  {{ item.value }}
                </button>
              </Item>
              <Ellipsis v-else class="px-2 text-gray-400">...</Ellipsis>
            </template>

            <Next v-slot="{ isDisabled }">
              <button
                class="px-3 py-2 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isDisabled"
              >
                ›
              </button>
            </Next>

            <Last v-slot="{ isDisabled }">
              <button
                class="px-3 py-2 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isDisabled"
              >
                »»
              </button>
            </Last>
          </div>
        </Root>
      </div>
    `,
  }),
}

// Simple prev/next only
export const SimplePrevNext: Story = {
  render: args => ({
    components: {
      Root: Pagination.Root,
      Prev: Pagination.Prev,
      Next: Pagination.Next,
      Status: Pagination.Status,
    },
    setup () {
      const page = ref(1)
      return { args, page }
    },
    template: `
      <Root v-model="page" :length="20">
        <div class="flex items-center gap-4">
          <Prev v-slot="{ isDisabled }">
            <button
              class="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :disabled="isDisabled"
            >
              Previous
            </button>
          </Prev>

          <span class="text-gray-600">
            Page {{ page }} of 20
          </span>

          <Next v-slot="{ isDisabled }">
            <button
              class="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :disabled="isDisabled"
            >
              Next
            </button>
          </Next>
        </div>
      </Root>
    `,
  }),
}

// With icons
export const WithIcons: Story = {
  render: args => ({
    components: {
      Root: Pagination.Root,
      First: Pagination.First,
      Prev: Pagination.Prev,
      Item: Pagination.Item,
      Ellipsis: Pagination.Ellipsis,
      Next: Pagination.Next,
      Last: Pagination.Last,
    },
    setup () {
      const page = ref(5)
      return { args, page }
    },
    template: `
      <Root v-model="page" :length="15" v-slot="{ items }">
        <nav class="flex items-center gap-1" aria-label="Pagination">
          <First v-slot="{ isDisabled }">
            <button
              class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="isDisabled"
              aria-label="First page"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </First>

          <Prev v-slot="{ isDisabled }">
            <button
              class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="isDisabled"
              aria-label="Previous page"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </Prev>

          <template v-for="item in items" :key="item.key">
            <Item v-if="item.type === 'page'" :value="item.value" v-slot="{ isSelected }">
              <button
                class="w-10 h-10 rounded-lg font-medium transition-colors"
                :class="isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'"
              >
                {{ item.value }}
              </button>
            </Item>
            <Ellipsis v-else class="w-10 h-10 flex items-center justify-center text-gray-400">
              •••
            </Ellipsis>
          </template>

          <Next v-slot="{ isDisabled }">
            <button
              class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="isDisabled"
              aria-label="Next page"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Next>

          <Last v-slot="{ isDisabled }">
            <button
              class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="isDisabled"
              aria-label="Last page"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </Last>
        </nav>
      </Root>
    `,
  }),
}

// Compact style (many pages)
export const ManyPages: Story = {
  render: args => ({
    components: {
      Root: Pagination.Root,
      Prev: Pagination.Prev,
      Item: Pagination.Item,
      Ellipsis: Pagination.Ellipsis,
      Next: Pagination.Next,
    },
    setup () {
      const page = ref(50)
      return { args, page }
    },
    template: `
      <Root v-model="page" :length="100" :siblings="1" v-slot="{ items }">
        <div class="flex items-center gap-1">
          <Prev v-slot="{ isDisabled }">
            <button
              class="px-2 py-1 text-sm rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              :disabled="isDisabled"
            >
              Prev
            </button>
          </Prev>

          <template v-for="item in items" :key="item.key">
            <Item v-if="item.type === 'page'" :value="item.value" v-slot="{ isSelected }">
              <button
                class="w-8 h-8 text-sm rounded transition-colors"
                :class="isSelected ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'"
              >
                {{ item.value }}
              </button>
            </Item>
            <Ellipsis v-else class="w-8 text-center text-gray-400">…</Ellipsis>
          </template>

          <Next v-slot="{ isDisabled }">
            <button
              class="px-2 py-1 text-sm rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              :disabled="isDisabled"
            >
              Next
            </button>
          </Next>
        </div>
      </Root>
    `,
  }),
}

// With page status
export const WithStatus: Story = {
  render: args => ({
    components: {
      Root: Pagination.Root,
      Prev: Pagination.Prev,
      Next: Pagination.Next,
      Status: Pagination.Status,
    },
    setup () {
      const page = ref(1)
      const itemsPerPage = 10
      const totalItems = 156
      return { args, page, itemsPerPage, totalItems }
    },
    template: `
      <Root v-model="page" :length="Math.ceil(totalItems / itemsPerPage)">
        <div class="flex flex-col items-center gap-3">
          <div class="flex items-center gap-4">
            <Prev v-slot="{ isDisabled }">
              <button
                class="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="isDisabled"
              >
                ← Previous
              </button>
            </Prev>

            <span class="px-4 py-2 bg-gray-100 rounded-lg font-medium">
              Page {{ page }}
            </span>

            <Next v-slot="{ isDisabled }">
              <button
                class="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="isDisabled"
              >
                Next →
              </button>
            </Next>
          </div>

          <div class="text-sm text-gray-500">
            Showing {{ (page - 1) * itemsPerPage + 1 }} - {{ Math.min(page * itemsPerPage, totalItems) }} of {{ totalItems }} items
          </div>

          <!-- Screen reader announcement -->
          <Status class="sr-only" />
        </div>
      </Root>
    `,
  }),
}

// Rounded pill style
export const PillStyle: Story = {
  render: args => ({
    components: {
      Root: Pagination.Root,
      First: Pagination.First,
      Prev: Pagination.Prev,
      Item: Pagination.Item,
      Ellipsis: Pagination.Ellipsis,
      Next: Pagination.Next,
      Last: Pagination.Last,
    },
    setup () {
      const page = ref(3)
      return { args, page }
    },
    template: `
      <Root v-model="page" :length="7" v-slot="{ items }">
        <div class="flex items-center gap-2 p-2 bg-gray-100 rounded-full">
          <Prev v-slot="{ isDisabled }">
            <button
              class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-30"
              :disabled="isDisabled"
            >
              ‹
            </button>
          </Prev>

          <template v-for="item in items" :key="item.key">
            <Item v-if="item.type === 'page'" :value="item.value" v-slot="{ isSelected }">
              <button
                class="w-10 h-10 rounded-full font-medium transition-all"
                :class="isSelected
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'hover:bg-white/50'"
              >
                {{ item.value }}
              </button>
            </Item>
          </template>

          <Next v-slot="{ isDisabled }">
            <button
              class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-30"
              :disabled="isDisabled"
            >
              ›
            </button>
          </Next>
        </div>
      </Root>
    `,
  }),
}
