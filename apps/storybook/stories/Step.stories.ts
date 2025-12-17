import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Step } from '@vuetify/v0'
import { ref } from 'vue'

const meta: Meta<typeof Step.Root> = {
  title: 'Components/Step',
  component: Step.Root as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Basic stepper
export const Default: Story = {
  render: args => ({
    components: { Root: Step.Root, Item: Step.Item },
    setup () {
      const current = ref('step-1')
      return { args, current }
    },
    template: `
      <div class="w-96">
        <Root v-model="current" v-slot="{ first, prev, next, last }">
          <div class="flex items-center justify-between mb-6">
            <Item value="step-1" v-slot="{ isSelected }">
              <button
                class="flex items-center gap-2"
                :class="isSelected ? 'text-blue-600' : 'text-gray-400'"
              >
                <span
                  class="size-8 rounded-full flex items-center justify-center text-sm font-medium"
                  :class="isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200'"
                >
                  1
                </span>
                <span class="text-sm font-medium" :class="isSelected ? 'text-gray-900' : 'text-gray-500'">
                  Account
                </span>
              </button>
            </Item>

            <div class="flex-1 h-px bg-gray-200 mx-4" />

            <Item value="step-2" v-slot="{ isSelected }">
              <button
                class="flex items-center gap-2"
                :class="isSelected ? 'text-blue-600' : 'text-gray-400'"
              >
                <span
                  class="size-8 rounded-full flex items-center justify-center text-sm font-medium"
                  :class="isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200'"
                >
                  2
                </span>
                <span class="text-sm font-medium" :class="isSelected ? 'text-gray-900' : 'text-gray-500'">
                  Profile
                </span>
              </button>
            </Item>

            <div class="flex-1 h-px bg-gray-200 mx-4" />

            <Item value="step-3" v-slot="{ isSelected }">
              <button
                class="flex items-center gap-2"
                :class="isSelected ? 'text-blue-600' : 'text-gray-400'"
              >
                <span
                  class="size-8 rounded-full flex items-center justify-center text-sm font-medium"
                  :class="isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200'"
                >
                  3
                </span>
                <span class="text-sm font-medium" :class="isSelected ? 'text-gray-900' : 'text-gray-500'">
                  Review
                </span>
              </button>
            </Item>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg mb-4 text-center text-gray-600">
            Content for current step
          </div>

          <div class="flex justify-between">
            <button
              @click="prev"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Previous
            </button>
            <button
              @click="next"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        </Root>
      </div>
    `,
  }),
}

// Vertical stepper
export const Vertical: Story = {
  render: args => ({
    components: { Root: Step.Root, Item: Step.Item },
    setup () {
      const current = ref('shipping')
      const steps = [
        { id: 'cart', label: 'Cart', description: 'Review your items' },
        { id: 'shipping', label: 'Shipping', description: 'Enter delivery address' },
        { id: 'payment', label: 'Payment', description: 'Select payment method' },
        { id: 'confirm', label: 'Confirm', description: 'Review and place order' },
      ]
      return { args, current, steps }
    },
    template: `
      <Root v-model="current" v-slot="{ prev, next }">
        <div class="flex gap-8">
          <div class="flex flex-col">
            <Item v-for="(step, i) in steps" :key="step.id" :value="step.id" v-slot="{ isSelected }">
              <div class="flex gap-3">
                <div class="flex flex-col items-center">
                  <div
                    class="size-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                    :class="isSelected
                      ? 'bg-indigo-600 text-white'
                      : i < steps.findIndex(s => s.id === current)
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-400'"
                  >
                    <template v-if="i < steps.findIndex(s => s.id === current)">✓</template>
                    <template v-else>{{ i + 1 }}</template>
                  </div>
                  <div v-if="i < steps.length - 1" class="w-0.5 h-12 bg-gray-200 my-2" />
                </div>
                <div class="pt-1">
                  <div
                    class="font-medium"
                    :class="isSelected ? 'text-indigo-600' : 'text-gray-700'"
                  >
                    {{ step.label }}
                  </div>
                  <div class="text-sm text-gray-500">{{ step.description }}</div>
                </div>
              </div>
            </Item>
          </div>

          <div class="flex-1 p-6 bg-gray-50 rounded-lg">
            <h2 class="text-lg font-semibold mb-4">{{ steps.find(s => s.id === current)?.label }}</h2>
            <p class="text-gray-600 mb-6">Step content goes here...</p>
            <div class="flex gap-2">
              <button
                @click="prev"
                class="px-4 py-2 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
              <button
                @click="next"
                class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </Root>
    `,
  }),
}

// Progress bar style
export const ProgressStyle: Story = {
  render: args => ({
    components: { Root: Step.Root, Item: Step.Item },
    setup () {
      const current = ref('step-2')
      return { args, current }
    },
    template: `
      <Root v-model="current" v-slot="{ prev, next, first, last }">
        <div class="w-80">
          <div class="flex justify-between mb-2">
            <Item value="step-1" v-slot="{ isSelected }">
              <div
                class="size-3 rounded-full transition-colors"
                :class="isSelected || current === 'step-2' || current === 'step-3' || current === 'step-4' ? 'bg-green-500' : 'bg-gray-300'"
              />
            </Item>
            <Item value="step-2" v-slot="{ isSelected }">
              <div
                class="size-3 rounded-full transition-colors"
                :class="isSelected || current === 'step-3' || current === 'step-4' ? 'bg-green-500' : 'bg-gray-300'"
              />
            </Item>
            <Item value="step-3" v-slot="{ isSelected }">
              <div
                class="size-3 rounded-full transition-colors"
                :class="isSelected || current === 'step-4' ? 'bg-green-500' : 'bg-gray-300'"
              />
            </Item>
            <Item value="step-4" v-slot="{ isSelected }">
              <div
                class="size-3 rounded-full transition-colors"
                :class="isSelected ? 'bg-green-500' : 'bg-gray-300'"
              />
            </Item>
          </div>

          <div class="h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              class="h-full bg-green-500 transition-all duration-300"
              :style="{ width: current === 'step-1' ? '12.5%' : current === 'step-2' ? '37.5%' : current === 'step-3' ? '62.5%' : '87.5%' }"
            />
          </div>

          <div class="flex justify-between">
            <button
              @click="prev"
              class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              ← Back
            </button>
            <button
              @click="next"
              class="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              Next →
            </button>
          </div>
        </div>
      </Root>
    `,
  }),
}

// With disabled steps
export const DisabledSteps: Story = {
  render: args => ({
    components: { Root: Step.Root, Item: Step.Item },
    setup () {
      const current = ref('step-1')
      return { args, current }
    },
    template: `
      <Root v-model="current" v-slot="{ next, prev }">
        <div class="flex gap-4 mb-6">
          <Item value="step-1" v-slot="{ isSelected }">
            <button
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              Step 1
            </button>
          </Item>

          <Item value="step-2" v-slot="{ isSelected }">
            <button
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              Step 2
            </button>
          </Item>

          <Item value="step-3" :disabled="true" v-slot="{ isDisabled }">
            <button
              disabled
              class="px-4 py-2 rounded bg-gray-100 opacity-50 cursor-not-allowed"
            >
              Step 3 (Locked)
            </button>
          </Item>

          <Item value="step-4" v-slot="{ isSelected }">
            <button
              class="px-4 py-2 rounded transition-colors"
              :class="isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              Step 4
            </button>
          </Item>
        </div>

        <p class="text-sm text-gray-500 mb-4">
          Step 3 is disabled. Navigation will skip it automatically.
        </p>

        <div class="flex gap-2">
          <button @click="prev" class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
            Prev
          </button>
          <button @click="next" class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
            Next
          </button>
        </div>
      </Root>
    `,
  }),
}

// Navigation controls
export const NavigationControls: Story = {
  render: args => ({
    components: { Root: Step.Root, Item: Step.Item },
    setup () {
      const current = ref('b')
      return { args, current }
    },
    template: `
      <Root v-model="current" v-slot="{ first, last, prev, next }">
        <div class="flex flex-col items-center gap-4">
          <div class="flex gap-1">
            <Item v-for="letter in ['a', 'b', 'c', 'd', 'e']" :key="letter" :value="letter" v-slot="{ isSelected }">
              <button
                class="size-10 rounded font-mono uppercase transition-colors"
                :class="isSelected ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'"
              >
                {{ letter }}
              </button>
            </Item>
          </div>

          <div class="flex gap-2">
            <button
              @click="first"
              class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              First
            </button>
            <button
              @click="prev"
              class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              ← Prev
            </button>
            <button
              @click="next"
              class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              Next →
            </button>
            <button
              @click="last"
              class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              Last
            </button>
          </div>

          <div class="text-sm text-gray-500">
            Current: {{ current }}
          </div>
        </div>
      </Root>
    `,
  }),
}

// Wizard form
export const WizardForm: Story = {
  render: args => ({
    components: { Root: Step.Root, Item: Step.Item },
    setup () {
      const current = ref('personal')
      const steps = ['personal', 'contact', 'preferences']
      return { args, current, steps }
    },
    template: `
      <Root v-model="current" v-slot="{ prev, next }">
        <div class="w-96 border border-gray-200 rounded-xl overflow-hidden">
          <!-- Header -->
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div class="flex gap-2">
              <Item v-for="(step, i) in steps" :key="step" :value="step" v-slot="{ isSelected }">
                <div class="flex items-center">
                  <div
                    class="size-6 rounded-full text-xs flex items-center justify-center font-medium"
                    :class="isSelected
                      ? 'bg-blue-500 text-white'
                      : i < steps.findIndex(s => s === current)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'"
                  >
                    <template v-if="i < steps.findIndex(s => s === current)">✓</template>
                    <template v-else>{{ i + 1 }}</template>
                  </div>
                  <div v-if="i < steps.length - 1" class="w-8 h-0.5 mx-1" :class="i < steps.findIndex(s => s === current) ? 'bg-green-500' : 'bg-gray-200'" />
                </div>
              </Item>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <template v-if="current === 'personal'">
              <h3 class="font-semibold mb-4">Personal Information</h3>
              <div class="space-y-3">
                <input type="text" placeholder="First name" class="w-full px-3 py-2 border border-gray-200 rounded" />
                <input type="text" placeholder="Last name" class="w-full px-3 py-2 border border-gray-200 rounded" />
              </div>
            </template>

            <template v-else-if="current === 'contact'">
              <h3 class="font-semibold mb-4">Contact Details</h3>
              <div class="space-y-3">
                <input type="email" placeholder="Email" class="w-full px-3 py-2 border border-gray-200 rounded" />
                <input type="tel" placeholder="Phone" class="w-full px-3 py-2 border border-gray-200 rounded" />
              </div>
            </template>

            <template v-else>
              <h3 class="font-semibold mb-4">Preferences</h3>
              <div class="space-y-2">
                <label class="flex items-center gap-2">
                  <input type="checkbox" class="rounded" />
                  <span class="text-sm">Receive newsletter</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" class="rounded" />
                  <span class="text-sm">Enable notifications</span>
                </label>
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              @click="prev"
              class="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
              :class="{ 'invisible': current === steps[0] }"
            >
              Back
            </button>
            <button
              @click="next"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {{ current === steps[steps.length - 1] ? 'Submit' : 'Continue' }}
            </button>
          </div>
        </div>
      </Root>
    `,
  }),
}
