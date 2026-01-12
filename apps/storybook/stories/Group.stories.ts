// Framework
import { Group } from '@vuetify/v0'

// Utilities
import { ref } from 'vue'

// Types
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Group.Root> = {
  title: 'Components/Group',
  component: Group.Root as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Basic multi-selection
export const Default: Story = {
  render: args => ({
    components: { Root: Group.Root, Item: Group.Item },
    setup () {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <Root v-model="selected" class="flex gap-2">
        <Item value="apple" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Apple
          </button>
        </Item>

        <Item value="banana" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Banana
          </button>
        </Item>

        <Item value="cherry" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Cherry
          </button>
        </Item>
      </Root>
    `,
  }),
}

// Select all / Unselect all controls
export const WithBatchControls: Story = {
  render: args => ({
    components: { Root: Group.Root, Item: Group.Item },
    setup () {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <Root v-model="selected" v-slot="{ selectAll, unselectAll, isAllSelected, isNoneSelected }">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <button
              @click="selectAll"
              :disabled="isAllSelected"
              class="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              :class="isAllSelected
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'"
            >
              Select All
            </button>
            <button
              @click="unselectAll"
              :disabled="isNoneSelected"
              class="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              :class="isNoneSelected
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'"
            >
              Clear
            </button>
          </div>

          <div class="flex gap-2">
            <Item value="one" v-slot="{ isSelected, toggle, attrs }">
              <button
                v-bind="attrs"
                @click="toggle"
                class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                :class="isSelected
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                  : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
              >
                One
              </button>
            </Item>

            <Item value="two" v-slot="{ isSelected, toggle, attrs }">
              <button
                v-bind="attrs"
                @click="toggle"
                class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                :class="isSelected
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                  : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
              >
                Two
              </button>
            </Item>

            <Item value="three" v-slot="{ isSelected, toggle, attrs }">
              <button
                v-bind="attrs"
                @click="toggle"
                class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                :class="isSelected
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                  : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
              >
                Three
              </button>
            </Item>
          </div>
        </div>
      </Root>
    `,
  }),
}

// Checkbox-style with master checkbox
export const CheckboxStyle: Story = {
  render: args => ({
    components: { Root: Group.Root, Item: Group.Item },
    setup () {
      const selected = ref<string[]>([])
      const items = ['Email notifications', 'Push notifications', 'SMS alerts', 'Weekly digest']
      return { args, selected, items }
    },
    template: `
      <Root v-model="selected" v-slot="{ toggleAll, isAllSelected, isMixed }">
        <div class="w-80 bg-white rounded-xl shadow-lg ring-1 ring-zinc-950/5 overflow-hidden">
          <label class="flex items-center gap-3 px-4 py-3.5 bg-zinc-50/80 border-b border-zinc-100 cursor-pointer select-none">
            <input
              type="checkbox"
              :checked="isAllSelected"
              :indeterminate="isMixed"
              @change="toggleAll"
              class="size-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500/25 focus:ring-offset-0"
            />
            <span class="font-semibold text-sm text-zinc-800">Notification Settings</span>
          </label>

          <div class="divide-y divide-zinc-100">
            <Item v-for="item in items" :key="item" :value="item" v-slot="{ isSelected, toggle, attrs }">
              <label v-bind="attrs" class="flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-colors hover:bg-zinc-50">
                <input
                  type="checkbox"
                  :checked="isSelected"
                  @change="toggle"
                  class="size-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500/25 focus:ring-offset-0"
                />
                <span class="text-sm text-zinc-600">{{ item }}</span>
              </label>
            </Item>
          </div>
        </div>
      </Root>
    `,
  }),
}

// With mandatory selection
export const Mandatory: Story = {
  render: args => ({
    components: { Root: Group.Root, Item: Group.Item },
    setup () {
      const selected = ref(['option-a'])
      return { args, selected }
    },
    template: `
      <Root v-model="selected" :mandatory="true" class="flex gap-2">
        <Item value="option-a" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
            :class="isSelected
              ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Option A
          </button>
        </Item>

        <Item value="option-b" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
            :class="isSelected
              ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Option B
          </button>
        </Item>

        <Item value="option-c" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
            :class="isSelected
              ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Option C
          </button>
        </Item>
      </Root>
    `,
  }),
}

// Disabled items
export const DisabledItems: Story = {
  render: args => ({
    components: { Root: Group.Root, Item: Group.Item },
    setup () {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <Root v-model="selected" class="flex gap-2">
        <Item value="enabled-1" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            :class="isSelected
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Enabled
          </button>
        </Item>

        <Item value="disabled" :disabled="true" v-slot="{ attrs }">
          <button
            v-bind="attrs"
            disabled
            class="px-4 py-2 rounded-lg font-medium text-sm bg-zinc-100 text-zinc-400 cursor-not-allowed"
          >
            Disabled
          </button>
        </Item>

        <Item value="enabled-2" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            :class="isSelected
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
              : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
          >
            Enabled
          </button>
        </Item>
      </Root>
    `,
  }),
}

// Chip/Tag style
export const ChipStyle: Story = {
  render: args => ({
    components: { Root: Group.Root, Item: Group.Item },
    setup () {
      const selected = ref(['vue', 'typescript'])
      const tags = ['Vue', 'React', 'Angular', 'Svelte', 'TypeScript', 'JavaScript']
      return { args, selected, tags }
    },
    template: `
      <Root v-model="selected" class="flex flex-wrap gap-2 max-w-sm">
        <Item v-for="tag in tags" :key="tag.toLowerCase()" :value="tag.toLowerCase()" v-slot="{ isSelected, toggle, attrs }">
          <button
            v-bind="attrs"
            @click="toggle"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            :class="isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'"
          >
            {{ tag }}
            <svg v-if="isSelected" class="size-3.5 -mr-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </Item>
      </Root>
    `,
  }),
}
