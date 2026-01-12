// Framework
import { Step } from '@vuetify/v0'

// Utilities
import { ref } from 'vue'

// Types
import type { Meta, StoryObj } from '@storybook/vue3-vite'

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
      <Root v-model="current" v-slot="{ prev, next }">
        <div class="w-[420px] bg-white rounded-2xl shadow-xl ring-1 ring-zinc-950/5 overflow-hidden">
          <div class="px-6 py-5 border-b border-zinc-100">
            <div class="flex items-center">
              <Item value="step-1" v-slot="{ isSelected, attrs }">
                <button v-bind="attrs" class="flex items-center gap-3 focus:outline-none">
                  <span
                    class="size-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                    :class="isSelected
                      ? 'bg-blue-600 text-white'
                      : current === 'step-2' || current === 'step-3'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-zinc-100 text-zinc-500'"
                  >
                    <svg v-if="current !== 'step-1'" class="size-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                    <span v-else>1</span>
                  </span>
                  <span class="text-sm font-medium" :class="isSelected ? 'text-zinc-900' : 'text-zinc-500'">Account</span>
                </button>
              </Item>

              <div class="flex-1 h-px mx-4" :class="current !== 'step-1' ? 'bg-blue-200' : 'bg-zinc-200'" />

              <Item value="step-2" v-slot="{ isSelected, attrs }">
                <button v-bind="attrs" class="flex items-center gap-3 focus:outline-none">
                  <span
                    class="size-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                    :class="isSelected
                      ? 'bg-blue-600 text-white'
                      : current === 'step-3'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-zinc-100 text-zinc-500'"
                  >
                    <svg v-if="current === 'step-3'" class="size-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                    <span v-else>2</span>
                  </span>
                  <span class="text-sm font-medium" :class="isSelected ? 'text-zinc-900' : 'text-zinc-500'">Profile</span>
                </button>
              </Item>

              <div class="flex-1 h-px mx-4" :class="current === 'step-3' ? 'bg-blue-200' : 'bg-zinc-200'" />

              <Item value="step-3" v-slot="{ isSelected, attrs }">
                <button v-bind="attrs" class="flex items-center gap-3 focus:outline-none">
                  <span
                    class="size-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                    :class="isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-500'"
                  >
                    3
                  </span>
                  <span class="text-sm font-medium" :class="isSelected ? 'text-zinc-900' : 'text-zinc-500'">Review</span>
                </button>
              </Item>
            </div>
          </div>

          <div class="p-6">
            <div class="h-24 flex items-center justify-center text-sm text-zinc-500 bg-zinc-50 rounded-lg">
              Step content area
            </div>
          </div>

          <div class="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-between">
            <button
              @click="prev"
              class="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors focus:outline-none"
            >
              Back
            </button>
            <button
              @click="next"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              Continue
            </button>
          </div>
        </div>
      </Root>
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
            <Item v-for="(step, i) in steps" :key="step.id" :value="step.id" v-slot="{ isSelected, attrs }">
              <div v-bind="attrs" class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div
                    class="size-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    :class="isSelected
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                      : i < steps.findIndex(s => s.id === current)
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-zinc-100 text-zinc-400'"
                  >
                    <svg v-if="i < steps.findIndex(s => s.id === current)" class="size-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <div
                    v-if="i < steps.length - 1"
                    class="w-0.5 h-14 my-2 rounded-full transition-colors"
                    :class="i < steps.findIndex(s => s.id === current) ? 'bg-violet-200' : 'bg-zinc-200'"
                  />
                </div>
                <div class="pt-1.5">
                  <div
                    class="font-semibold text-sm"
                    :class="isSelected ? 'text-violet-600' : 'text-zinc-700'"
                  >
                    {{ step.label }}
                  </div>
                  <div class="text-sm text-zinc-500 mt-0.5">{{ step.description }}</div>
                </div>
              </div>
            </Item>
          </div>

          <div class="w-72 bg-white rounded-xl shadow-lg ring-1 ring-zinc-950/5 p-6">
            <h2 class="text-lg font-semibold text-zinc-900">{{ steps.find(s => s.id === current)?.label }}</h2>
            <p class="text-sm text-zinc-500 mt-2 mb-6">{{ steps.find(s => s.id === current)?.description }}</p>
            <div class="flex gap-3">
              <button
                @click="prev"
                class="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors focus:outline-none"
              >
                Back
              </button>
              <button
                @click="next"
                class="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 shadow-sm transition-colors focus:outline-none"
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
      function stepIndex () {
        return ['step-1', 'step-2', 'step-3', 'step-4'].indexOf(current.value)
      }
      return { args, current, stepIndex }
    },
    template: `
      <Root v-model="current" v-slot="{ prev, next }">
        <div class="w-80 bg-white rounded-xl shadow-lg ring-1 ring-zinc-950/5 p-6">
          <div class="flex justify-between mb-3">
            <Item v-for="(step, i) in ['step-1', 'step-2', 'step-3', 'step-4']" :key="step" :value="step" v-slot="{ isSelected, attrs }">
              <button
                v-bind="attrs"
                class="size-3 rounded-full transition-all duration-300 focus:outline-none"
                :class="i <= stepIndex()
                  ? 'bg-emerald-500'
                  : 'bg-zinc-200'"
              />
            </Item>
          </div>

          <div class="h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-6">
            <div
              class="h-full bg-emerald-500 transition-all duration-500 ease-out rounded-full"
              :style="{ width: ((stepIndex() / 3) * 100) + '%' }"
            />
          </div>

          <div class="text-center mb-6">
            <span class="text-sm font-medium text-zinc-600">Step {{ stepIndex() + 1 }} of 4</span>
          </div>

          <div class="flex justify-between">
            <button
              @click="prev"
              class="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors focus:outline-none"
            >
              Back
            </button>
            <button
              @click="next"
              class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors focus:outline-none"
            >
              Next
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
        <div class="space-y-6">
          <div class="flex gap-2">
            <Item value="step-1" v-slot="{ isSelected, attrs }">
              <button
                v-bind="attrs"
                class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                :class="isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
              >
                Step 1
              </button>
            </Item>

            <Item value="step-2" v-slot="{ isSelected, attrs }">
              <button
                v-bind="attrs"
                class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                :class="isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
              >
                Step 2
              </button>
            </Item>

            <Item value="step-3" :disabled="true" v-slot="{ attrs }">
              <button
                v-bind="attrs"
                disabled
                class="px-4 py-2 rounded-lg font-medium text-sm bg-zinc-100 text-zinc-400 cursor-not-allowed"
              >
                Locked
              </button>
            </Item>

            <Item value="step-4" v-slot="{ isSelected, attrs }">
              <button
                v-bind="attrs"
                class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                :class="isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
              >
                Step 4
              </button>
            </Item>
          </div>

          <div class="flex gap-3">
            <button
              @click="prev"
              class="px-3 py-1.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors focus:outline-none"
            >
              Prev
            </button>
            <button
              @click="next"
              class="px-3 py-1.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors focus:outline-none"
            >
              Next
            </button>
          </div>
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
        <div class="flex flex-col items-center gap-5">
          <div class="flex gap-1">
            <Item v-for="letter in ['a', 'b', 'c', 'd', 'e']" :key="letter" :value="letter" v-slot="{ isSelected, attrs }">
              <button
                v-bind="attrs"
                class="size-11 rounded-lg font-mono text-sm uppercase transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                :class="isSelected
                  ? 'bg-zinc-900 text-white shadow-lg'
                  : 'bg-white text-zinc-600 shadow-sm ring-1 ring-zinc-200 hover:ring-zinc-300 hover:shadow'"
              >
                {{ letter }}
              </button>
            </Item>
          </div>

          <div class="flex gap-2">
            <button
              @click="first"
              class="size-9 flex items-center justify-center rounded-lg text-zinc-500 bg-zinc-100 hover:bg-zinc-200 transition-colors focus:outline-none"
            >
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              @click="prev"
              class="size-9 flex items-center justify-center rounded-lg text-zinc-500 bg-zinc-100 hover:bg-zinc-200 transition-colors focus:outline-none"
            >
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              @click="next"
              class="size-9 flex items-center justify-center rounded-lg text-zinc-500 bg-zinc-100 hover:bg-zinc-200 transition-colors focus:outline-none"
            >
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              @click="last"
              class="size-9 flex items-center justify-center rounded-lg text-zinc-500 bg-zinc-100 hover:bg-zinc-200 transition-colors focus:outline-none"
            >
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.21 5.23a.75.75 0 011.06-.02l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.04-1.08L8.168 10 4.23 6.29a.75.75 0 01-.02-1.06zm6 0a.75.75 0 011.06-.02l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.04-1.08L14.168 10 10.23 6.29a.75.75 0 01-.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
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
        <div class="w-96 bg-white rounded-2xl shadow-xl ring-1 ring-zinc-950/5 overflow-hidden">
          <div class="px-6 py-4 bg-zinc-50/80 border-b border-zinc-100">
            <div class="flex items-center justify-center gap-3">
              <Item v-for="(step, i) in steps" :key="step" :value="step" v-slot="{ isSelected, attrs }">
                <div v-bind="attrs" class="flex items-center">
                  <div
                    class="size-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all"
                    :class="isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : i < steps.findIndex(s => s === current)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-200 text-zinc-500'"
                  >
                    <svg v-if="i < steps.findIndex(s => s === current)" class="size-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <div
                    v-if="i < steps.length - 1"
                    class="w-12 h-0.5 mx-2 rounded-full transition-colors"
                    :class="i < steps.findIndex(s => s === current) ? 'bg-emerald-500' : 'bg-zinc-200'"
                  />
                </div>
              </Item>
            </div>
          </div>

          <div class="p-6">
            <template v-if="current === 'personal'">
              <h3 class="text-lg font-semibold text-zinc-900 mb-4">Personal Information</h3>
              <div class="space-y-4">
                <input
                  type="text"
                  placeholder="First name"
                  class="w-full px-4 py-2.5 text-sm bg-zinc-50 border-0 rounded-lg ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  class="w-full px-4 py-2.5 text-sm bg-zinc-50 border-0 rounded-lg ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-zinc-400"
                />
              </div>
            </template>

            <template v-else-if="current === 'contact'">
              <h3 class="text-lg font-semibold text-zinc-900 mb-4">Contact Details</h3>
              <div class="space-y-4">
                <input
                  type="email"
                  placeholder="Email address"
                  class="w-full px-4 py-2.5 text-sm bg-zinc-50 border-0 rounded-lg ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-zinc-400"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  class="w-full px-4 py-2.5 text-sm bg-zinc-50 border-0 rounded-lg ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-zinc-400"
                />
              </div>
            </template>

            <template v-else>
              <h3 class="text-lg font-semibold text-zinc-900 mb-4">Preferences</h3>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" class="size-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500/25" />
                  <span class="text-sm text-zinc-600">Receive newsletter</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" class="size-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500/25" />
                  <span class="text-sm text-zinc-600">Enable notifications</span>
                </label>
              </div>
            </template>
          </div>

          <div class="px-6 py-4 bg-zinc-50/80 border-t border-zinc-100 flex justify-between">
            <button
              @click="prev"
              class="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors focus:outline-none"
              :class="{ 'invisible': current === steps[0] }"
            >
              Back
            </button>
            <button
              @click="next"
              class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {{ current === steps[steps.length - 1] ? 'Submit' : 'Continue' }}
            </button>
          </div>
        </div>
      </Root>
    `,
  }),
}
