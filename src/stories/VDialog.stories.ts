import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import { VDialog } from '@/components/VDialog'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Components/VDialog',
  component: VDialog,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof VDialog>

export default meta
type Story = StoryObj<typeof meta>

/*
 * Stories for VDialog component
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  args: {},
  render: args => ({
    components: { VDialog },
    setup () {
      return { args }
    },
    template: '<VDialog v-bind="args" />',
  }),
}

export const Interactive: Story = {
  args: {},
  render: args => ({
    components: { VDialog },
    setup () {
      return { args }
    },
    template: `
      <div class="p-4">
        <p class="mb-4 text-gray-600">Click the button below to open the dialog:</p>
        <VDialog v-bind="args" />
      </div>
    `,
  }),
}

export const MultipleDialogs: Story = {
  args: {},
  render: args => ({
    components: { VDialog },
    setup () {
      return { args }
    },
    template: `
      <div class="p-4 space-y-4">
        <p class="text-gray-600">Multiple dialog instances:</p>
        <div class="flex gap-4">
          <VDialog v-bind="args" />
          <VDialog v-bind="args" />
        </div>
      </div>
    `,
  }),
}

export const WithCustomContent: Story = {
  args: {},
  render: args => ({
    components: { VDialog },
    setup () {
      const customDialog = ref(false)
      return { args, customDialog }
    },
    template: `
      <div class="p-4">
        <p class="mb-4 text-gray-600">This shows the default VDialog component with its built-in form:</p>
        <VDialog v-bind="args">
        <p class="mt-8 mb-4 text-gray-600">The VDialog component includes:</p>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Focus trap functionality</li>
          <li>Backdrop with blur effect</li>
          <li>Form inputs (Name and Email)</li>
          <li>Submit and Cancel buttons</li>
          <li>Proper accessibility features</li>
        </ul>
        </VDialog>
      </div>
    `,
  }),
}
