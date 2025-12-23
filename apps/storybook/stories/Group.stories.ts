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
      <div class="flex flex-col gap-4">
        <div class="text-sm text-gray-500">
          Selected: <code class="bg-gray-100 px-1 rounded">{{ selected.length ? selected.join(', ') : 'none' }}</code>
        </div>

        <Root v-model="selected" class="flex gap-2">
          <Item value="apple" v-slot="{ isSelected, toggle }">
            <button
              @click="toggle"
              class="px-4 py-2 rounded border-2 transition-colors"
              :class="isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'"
            >
              Apple
            </button>
          </Item>

          <Item value="banana" v-slot="{ isSelected, toggle }">
            <button
              @click="toggle"
              class="px-4 py-2 rounded border-2 transition-colors"
              :class="isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'"
            >
              Banana
            </button>
          </Item>

          <Item value="cherry" v-slot="{ isSelected, toggle }">
            <button
              @click="toggle"
              class="px-4 py-2 rounded border-2 transition-colors"
              :class="isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'"
            >
              Cherry
            </button>
          </Item>
        </Root>
      </div>
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
      <div class="flex flex-col gap-4">
        <Root v-model="selected" v-slot="{ selectAll, unselectAll, isAllSelected, isNoneSelected, isMixed }">
          <div class="flex gap-2 mb-4">
            <button
              @click="selectAll"
              class="px-3 py-1 text-sm rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': isAllSelected }"
            >
              Select All
            </button>
            <button
              @click="unselectAll"
              class="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': isNoneSelected }"
            >
              Clear All
            </button>
            <span class="text-sm text-gray-500 self-center">
              <template v-if="isAllSelected">All selected</template>
              <template v-else-if="isNoneSelected">None selected</template>
              <template v-else-if="isMixed">Some selected</template>
            </span>
          </div>

          <div class="flex gap-2">
            <Item value="one" v-slot="{ isSelected, toggle }">
              <button
                @click="toggle"
                class="px-4 py-2 rounded border-2 transition-colors"
                :class="isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
              >
                One
              </button>
            </Item>

            <Item value="two" v-slot="{ isSelected, toggle }">
              <button
                @click="toggle"
                class="px-4 py-2 rounded border-2 transition-colors"
                :class="isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
              >
                Two
              </button>
            </Item>

            <Item value="three" v-slot="{ isSelected, toggle }">
              <button
                @click="toggle"
                class="px-4 py-2 rounded border-2 transition-colors"
                :class="isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
              >
                Three
              </button>
            </Item>
          </div>
        </Root>
      </div>
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
        <div class="w-72 border border-gray-200 rounded-lg">
          <!-- Master checkbox header -->
          <label class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              :checked="isAllSelected"
              :indeterminate="isMixed"
              @change="toggleAll"
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span class="font-medium text-gray-700">Notification Settings</span>
          </label>

          <!-- Individual checkboxes -->
          <div class="divide-y divide-gray-100">
            <Item v-for="item in items" :key="item" :value="item" v-slot="{ isSelected, toggle }">
              <label class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  :checked="isSelected"
                  @change="toggle"
                  class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span class="text-gray-600">{{ item }}</span>
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
      <div class="flex flex-col gap-4">
        <p class="text-sm text-gray-500">At least one option must be selected:</p>

        <Root v-model="selected" :mandatory="true" class="flex gap-2">
          <Item value="option-a" v-slot="{ isSelected, toggle }">
            <button
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              Option A
            </button>
          </Item>

          <Item value="option-b" v-slot="{ isSelected, toggle }">
            <button
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              Option B
            </button>
          </Item>

          <Item value="option-c" v-slot="{ isSelected, toggle }">
            <button
              @click="toggle"
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              Option C
            </button>
          </Item>
        </Root>
      </div>
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
        <Item value="enabled-1" v-slot="{ isSelected, toggle }">
          <button
            @click="toggle"
            class="px-4 py-2 rounded border-2 transition-colors"
            :class="isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'"
          >
            Enabled
          </button>
        </Item>

        <Item value="disabled" :disabled="true" v-slot="{ isSelected, isDisabled }">
          <button
            disabled
            class="px-4 py-2 rounded border-2 opacity-50 cursor-not-allowed border-gray-200"
          >
            Disabled
          </button>
        </Item>

        <Item value="enabled-2" v-slot="{ isSelected, toggle }">
          <button
            @click="toggle"
            class="px-4 py-2 rounded border-2 transition-colors"
            :class="isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'"
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
      const tags = ['vue', 'react', 'angular', 'svelte', 'typescript', 'javascript']
      return { args, selected, tags }
    },
    template: `
      <div class="flex flex-col gap-4">
        <p class="text-sm text-gray-500">Select your favorite technologies:</p>

        <Root v-model="selected" class="flex flex-wrap gap-2">
          <Item v-for="tag in tags" :key="tag" :value="tag" v-slot="{ isSelected, toggle }">
            <button
              @click="toggle"
              class="px-3 py-1 rounded-full text-sm transition-all"
              :class="isSelected
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ tag }}
              <span v-if="isSelected" class="ml-1">×</span>
            </button>
          </Item>
        </Root>

        <div class="text-sm text-gray-500">
          Selected: {{ selected.join(', ') || 'none' }}
        </div>
      </div>
    `,
  }),
}
