// Framework
import { Selection } from '@vuetify/v0'

// Utilities
import { ref } from 'vue'

// Types
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Selection.Root> = {
  title: 'Components/Selection',
  component: Selection.Root as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Single selection (default)
export const SingleSelection: Story = {
  render: args => ({
    components: { Root: Selection.Root, Item: Selection.Item },
    setup () {
      const selected = ref<string | undefined>()
      return { args, selected }
    },
    template: `
      <Root v-model="selected" class="flex gap-2">
        <Item value="option-1" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Option 1
          </button>
        </Item>

        <Item value="option-2" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Option 2
          </button>
        </Item>

        <Item value="option-3" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Option 3
          </button>
        </Item>
      </Root>
    `,
  }),
}

// Multiple selection
export const MultipleSelection: Story = {
  render: args => ({
    components: { Root: Selection.Root, Item: Selection.Item },
    setup () {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <Root v-model="selected" :multiple="true" class="flex gap-2">
        <Item value="a" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            :class="isSelected
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            A
          </button>
        </Item>

        <Item value="b" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            :class="isSelected
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            B
          </button>
        </Item>

        <Item value="c" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            :class="isSelected
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            C
          </button>
        </Item>
      </Root>
    `,
  }),
}

// Radio button style
export const RadioStyle: Story = {
  render: args => ({
    components: { Root: Selection.Root, Item: Selection.Item },
    setup () {
      const selected = ref('medium')
      const sizes = [
        { value: 'small', label: 'Small', price: '$9' },
        { value: 'medium', label: 'Medium', price: '$12' },
        { value: 'large', label: 'Large', price: '$15' },
      ]
      return { args, selected, sizes }
    },
    template: `
      <Root v-model="selected" class="flex flex-col gap-2 w-64">
        <Item v-for="size in sizes" :key="size.value" :value="size.value" v-slot="{ isSelected, toggle, attrs }">
          <label
            v-bind="attrs"
            @click="toggle"
            class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 select-none"
            :class="isSelected
              ? 'bg-emerald-50 ring-2 ring-emerald-500'
              : 'bg-white ring-1 ring-zinc-200 hover:ring-zinc-300'"
          >
            <div
              class="size-5 rounded-full border-2 flex items-center justify-center transition-colors"
              :class="isSelected ? 'border-emerald-500' : 'border-zinc-300'"
            >
              <div v-if="isSelected" class="size-2.5 rounded-full bg-emerald-500" />
            </div>
            <div class="flex-1">
              <div class="font-medium text-sm text-zinc-900">{{ size.label }}</div>
            </div>
            <div class="text-sm font-medium text-zinc-500">{{ size.price }}</div>
          </label>
        </Item>
      </Root>
    `,
  }),
}

// Segmented control
export const SegmentedControl: Story = {
  render: args => ({
    components: { Root: Selection.Root, Item: Selection.Item },
    setup () {
      const view = ref('grid')
      return { args, view }
    },
    template: `
      <Root v-model="view" class="inline-flex gap-1 p-1 bg-zinc-100 rounded-lg">
        <Item value="list" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 focus:outline-none"
            :class="isSelected
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'"
          >
            List
          </button>
        </Item>

        <Item value="grid" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 focus:outline-none"
            :class="isSelected
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'"
          >
            Grid
          </button>
        </Item>

        <Item value="kanban" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 focus:outline-none"
            :class="isSelected
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'"
          >
            Kanban
          </button>
        </Item>
      </Root>
    `,
  }),
}

// Card selection
export const CardSelection: Story = {
  render: args => ({
    components: { Root: Selection.Root, Item: Selection.Item },
    setup () {
      const selected = ref<string | undefined>()
      const plans = [
        { id: 'starter', name: 'Starter', price: '$0', features: ['1 user', '10 projects', '2GB storage'] },
        { id: 'pro', name: 'Pro', price: '$29', features: ['5 users', 'Unlimited projects', '50GB storage'] },
        { id: 'enterprise', name: 'Enterprise', price: '$99', features: ['Unlimited users', 'Unlimited projects', '500GB storage'] },
      ]
      return { args, selected, plans }
    },
    template: `
      <Root v-model="selected" class="grid grid-cols-3 gap-4">
        <Item v-for="plan in plans" :key="plan.id" :value="plan.id" v-slot="{ isSelected, toggle, attrs }">
          <div
            v-bind="attrs"
            @click="toggle"
            class="p-5 rounded-xl cursor-pointer transition-all duration-150"
            :class="isSelected
              ? 'bg-violet-50 ring-2 ring-violet-500 shadow-lg shadow-violet-500/10'
              : 'bg-white ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow-md'"
          >
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-semibold text-zinc-900">{{ plan.name }}</h3>
              <div
                v-if="isSelected"
                class="size-5 rounded-full bg-violet-500 text-white flex items-center justify-center"
              >
                <svg class="size-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="text-2xl font-bold text-zinc-900 mb-4">
              {{ plan.price }}
              <span class="text-sm font-normal text-zinc-500">/mo</span>
            </div>
            <ul class="text-sm text-zinc-600 space-y-1.5">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2">
                <svg class="size-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
                {{ feature }}
              </li>
            </ul>
          </div>
        </Item>
      </Root>
    `,
  }),
}

// With disabled items
export const WithDisabledItems: Story = {
  render: args => ({
    components: { Root: Selection.Root, Item: Selection.Item },
    setup () {
      const selected = ref<string | undefined>()
      return { args, selected }
    },
    template: `
      <Root v-model="selected" class="flex gap-2">
        <Item value="available" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Available
          </button>
        </Item>

        <Item value="unavailable" :disabled="true" v-slot="{ attrs }">
          <button
            v-bind="attrs"
            disabled
            class="px-4 py-2 rounded-lg font-medium text-sm bg-zinc-100 text-zinc-400 cursor-not-allowed"
          >
            Unavailable
          </button>
        </Item>

        <Item value="also-available" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Also Available
          </button>
        </Item>
      </Root>
    `,
  }),
}

// Mandatory selection
export const MandatorySelection: Story = {
  render: args => ({
    components: { Root: Selection.Root, Item: Selection.Item },
    setup () {
      const selected = ref('option-1')
      return { args, selected }
    },
    template: `
      <Root v-model="selected" :mandatory="true" class="flex gap-2">
        <Item value="option-1" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            :class="isSelected
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Option 1
          </button>
        </Item>

        <Item value="option-2" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            :class="isSelected
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Option 2
          </button>
        </Item>

        <Item value="option-3" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            :class="isSelected
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Option 3
          </button>
        </Item>
      </Root>
    `,
  }),
}
