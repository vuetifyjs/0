// Framework
import { Pagination } from '@vuetify/v0'

// Utilities
import { ref } from 'vue'

// Types
import type { Meta, StoryObj } from '@storybook/vue3-vite'

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
      <Root v-model="page" :size="100" v-slot="{ items }">
        <nav class="flex items-center gap-1" aria-label="Pagination">
          <First renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="size-9 flex items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </First>

          <Prev renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="size-9 flex items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </button>
          </Prev>

          <template v-for="item in items" :key="item.key">
            <Item v-if="item.type === 'page'" renderless :value="item.value" v-slot="{ isSelected, attrs }">
              <button
                v-bind="attrs"
                class="size-9 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                :class="isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-zinc-600 hover:bg-zinc-100'"
              >
                {{ item.value }}
              </button>
            </Item>
            <Ellipsis v-else class="size-9 flex items-center justify-center text-zinc-400">
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm7 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </Ellipsis>
          </template>

          <Next renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="size-9 flex items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>
          </Next>

          <Last renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="size-9 flex items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.21 5.23a.75.75 0 011.06-.02l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.04-1.08L8.168 10 4.23 6.29a.75.75 0 01-.02-1.06zm6 0a.75.75 0 011.06-.02l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.04-1.08L14.168 10 10.23 6.29a.75.75 0 01-.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </Last>
        </nav>
      </Root>
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
    },
    setup () {
      const page = ref(1)
      return { args, page }
    },
    template: `
      <Root v-model="page" :size="200" v-slot="{ pages }">
        <div class="flex items-center gap-4">
          <Prev renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 bg-zinc-100 transition-colors hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              Previous
            </button>
          </Prev>

          <span class="text-sm font-medium text-zinc-600 tabular-nums">
            Page {{ page }} of {{ pages }}
          </span>

          <Next renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 bg-zinc-100 transition-colors hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
      <Root v-model="page" :size="150" v-slot="{ items }">
        <nav class="flex items-center gap-1 p-1.5 bg-white rounded-xl shadow-lg ring-1 ring-zinc-950/5" aria-label="Pagination">
          <First renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="p-2 rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none"
            >
              <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </First>

          <Prev renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="p-2 rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none"
            >
              <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </Prev>

          <template v-for="item in items" :key="item.key">
            <Item v-if="item.type === 'page'" renderless :value="item.value" v-slot="{ isSelected, attrs }">
              <button
                v-bind="attrs"
                class="size-10 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none"
                :class="isSelected
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                  : 'text-zinc-700 hover:bg-zinc-100'"
              >
                {{ item.value }}
              </button>
            </Item>
            <Ellipsis v-else class="size-10 flex items-center justify-center text-zinc-400">
              ...
            </Ellipsis>
          </template>

          <Next renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="p-2 rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none"
            >
              <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Next>

          <Last renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="p-2 rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none"
            >
              <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <Root v-model="page" :size="1000" :total-visible="7" v-slot="{ items }">
        <div class="flex items-center gap-1">
          <Prev renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="px-3 py-1.5 text-sm font-medium rounded-md bg-white ring-1 ring-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              Prev
            </button>
          </Prev>

          <template v-for="item in items" :key="item.key">
            <Item v-if="item.type === 'page'" renderless :value="item.value" v-slot="{ isSelected, attrs }">
              <button
                v-bind="attrs"
                class="size-8 text-sm font-medium rounded-md transition-all duration-150 focus:outline-none"
                :class="isSelected
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'"
              >
                {{ item.value }}
              </button>
            </Item>
            <Ellipsis v-else class="size-8 flex items-center justify-center text-zinc-400">…</Ellipsis>
          </template>

          <Next renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="px-3 py-1.5 text-sm font-medium rounded-md bg-white ring-1 ring-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
      <Root v-model="page" :size="totalItems" :items-per-page="itemsPerPage">
        <div class="bg-white rounded-xl shadow-lg ring-1 ring-zinc-950/5 p-4">
          <div class="flex items-center justify-between gap-6">
            <div class="text-sm text-zinc-500">
              Showing <span class="font-medium text-zinc-900">{{ (page - 1) * itemsPerPage + 1 }}-{{ Math.min(page * itemsPerPage, totalItems) }}</span> of <span class="font-medium text-zinc-900">{{ totalItems }}</span>
            </div>

            <div class="flex items-center gap-2">
              <Prev renderless v-slot="{ attrs }">
                <button
                  v-bind="attrs"
                  class="px-3 py-1.5 text-sm font-medium rounded-lg bg-white ring-1 ring-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  Previous
                </button>
              </Prev>

              <span class="px-3 py-1.5 text-sm font-semibold text-zinc-900 bg-zinc-100 rounded-lg tabular-nums">
                {{ page }}
              </span>

              <Next renderless v-slot="{ attrs }">
                <button
                  v-bind="attrs"
                  class="px-3 py-1.5 text-sm font-medium rounded-lg bg-white ring-1 ring-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  Next
                </button>
              </Next>
            </div>
          </div>

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
      Prev: Pagination.Prev,
      Item: Pagination.Item,
      Next: Pagination.Next,
    },
    setup () {
      const page = ref(3)
      return { args, page }
    },
    template: `
      <Root v-model="page" :size="70" v-slot="{ items }">
        <div class="flex items-center gap-1 p-1.5 bg-zinc-100 rounded-full">
          <Prev renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="size-9 flex items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none focus:outline-none"
            >
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </button>
          </Prev>

          <template v-for="item in items" :key="item.key">
            <Item v-if="item.type === 'page'" renderless :value="item.value" v-slot="{ isSelected, attrs }">
              <button
                v-bind="attrs"
                class="size-9 rounded-full text-sm font-medium transition-all duration-150 focus:outline-none"
                :class="isSelected
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-zinc-600 hover:bg-white/50'"
              >
                {{ item.value }}
              </button>
            </Item>
          </template>

          <Next renderless v-slot="{ attrs }">
            <button
              v-bind="attrs"
              class="size-9 flex items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none focus:outline-none"
            >
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>
          </Next>
        </div>
      </Root>
    `,
  }),
}
