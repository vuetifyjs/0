import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Selection } from '@vuetify/v0'
import { ref } from 'vue'

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
      <div class="flex flex-col gap-4">
        <div class="text-sm text-gray-500">
          Selected: <code class="bg-gray-100 px-1 rounded">{{ selected ?? 'none' }}</code>
        </div>

        <Root v-model="selected" class="flex gap-2">
          <Item value="option-1" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded border-2 transition-colors"
              :class="isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'"
            >
              Option 1
            </button>
          </Item>

          <Item value="option-2" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded border-2 transition-colors"
              :class="isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'"
            >
              Option 2
            </button>
          </Item>

          <Item value="option-3" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded border-2 transition-colors"
              :class="isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'"
            >
              Option 3
            </button>
          </Item>
        </Root>
      </div>
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
      <div class="flex flex-col gap-4">
        <div class="text-sm text-gray-500">
          Selected: <code class="bg-gray-100 px-1 rounded">{{ selected.length ? selected.join(', ') : 'none' }}</code>
        </div>

        <Root v-model="selected" :multiple="true" class="flex gap-2">
          <Item value="a" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              A
            </button>
          </Item>

          <Item value="b" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              B
            </button>
          </Item>

          <Item value="c" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              C
            </button>
          </Item>
        </Root>
      </div>
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
            class="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors"
            :class="isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <div
              class="size-5 rounded-full border-2 flex items-center justify-center"
              :class="isSelected ? 'border-green-500' : 'border-gray-300'"
            >
              <div v-if="isSelected" class="size-2.5 rounded-full bg-green-500" />
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-900">{{ size.label }}</div>
            </div>
            <div class="text-gray-500">{{ size.price }}</div>
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
      <Root v-model="view" class="inline-flex p-1 bg-gray-100 rounded-lg">
        <Item value="list" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isSelected ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'"
          >
            List
          </button>
        </Item>

        <Item value="grid" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isSelected ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'"
          >
            Grid
          </button>
        </Item>

        <Item value="kanban" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isSelected ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'"
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
            class="p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="isSelected
              ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
              : 'border-gray-200 hover:border-gray-300'"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="font-semibold text-gray-900">{{ plan.name }}</h3>
              <div
                v-if="isSelected"
                class="size-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs"
              >
                ✓
              </div>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-3">{{ plan.price }}<span class="text-sm font-normal text-gray-500">/mo</span></div>
            <ul class="text-sm text-gray-600 space-y-1">
              <li v-for="feature in plan.features" :key="feature">• {{ feature }}</li>
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
            class="px-4 py-2 rounded transition-colors"
            :class="isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
          >
            Available
          </button>
        </Item>

        <Item value="unavailable" :disabled="true" v-slot="{ isDisabled, attrs }">
          <button
            v-bind="attrs"
            disabled
            class="px-4 py-2 rounded bg-gray-100 opacity-50 cursor-not-allowed"
          >
            Unavailable
          </button>
        </Item>

        <Item value="also-available" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded transition-colors"
            :class="isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
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
      <div class="flex flex-col gap-4">
        <p class="text-sm text-gray-500">One option must always be selected:</p>

        <Root v-model="selected" :mandatory="true" class="flex gap-2">
          <Item value="option-1" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-orange-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              Option 1
            </button>
          </Item>

          <Item value="option-2" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-orange-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              Option 2
            </button>
          </Item>

          <Item value="option-3" v-slot="{ isSelected, toggle, attrs }">
            <button
              v-bind="attrs"
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-orange-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              Option 3
            </button>
          </Item>
        </Root>
      </div>
    `,
  }),
}
