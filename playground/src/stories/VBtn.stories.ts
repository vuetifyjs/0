import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Icon } from '@iconify/vue'
import { fn } from 'storybook/test'

import { ref } from 'vue'
import VBtn from '../components/VBtn.vue'

const meta = {
  title: 'Components/VBtn',
  component: VBtn,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'text', 'tonal'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    active: { control: 'boolean' },
    block: { control: 'boolean' },
    rounded: { control: 'boolean' },
  },
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'default',
    disabled: false,
    loading: false,
    active: false,
    block: false,
    rounded: false,
    onClick: fn(),
  },
} satisfies Meta<typeof VBtn>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: args => ({
    components: { VBtn },
    setup () {
      return { args }
    },
    template: '<VBtn v-bind="args">Button</VBtn>',
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { VBtn },
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <VBtn variant="filled">Filled</VBtn>
        <VBtn variant="outlined">Outlined</VBtn>
        <VBtn variant="text">Text</VBtn>
        <VBtn variant="tonal">Tonal</VBtn>
      </div>
    `,
  }),
}

export const Colors: Story = {
  render: () => ({
    components: { VBtn },
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <VBtn color="primary">Primary</VBtn>
        <VBtn color="secondary">Secondary</VBtn>
        <VBtn color="success">Success</VBtn>
        <VBtn color="warning">Warning</VBtn>
        <VBtn color="error">Error</VBtn>
        <VBtn color="info">Info</VBtn>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { VBtn },
    template: `
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <VBtn size="small">Small</VBtn>
        <VBtn size="default">Default</VBtn>
        <VBtn size="large">Large</VBtn>
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { VBtn },
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <VBtn>Normal</VBtn>
        <VBtn :active="true">Active</VBtn>
        <VBtn :disabled="true">Disabled</VBtn>
        <VBtn :loading="true">Loading</VBtn>
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: { VBtn, Icon },
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <VBtn>
          <template #prepend>
            <Icon icon="lucide:mail" class="w-4 h-4" />
          </template>
          Email
        </VBtn>
        <VBtn>
          Download
          <template #append>
            <Icon icon="lucide:download" class="w-4 h-4" />
          </template>
        </VBtn>
        <VBtn :loading="true">
          <template #prepend>
            <Icon icon="lucide:user" class="w-4 h-4" />
          </template>
          Profile
          <template #append>
            <Icon icon="lucide:settings" class="w-4 h-4" />
          </template>
        </VBtn>
      </div>
    `,
  }),
}

export const Shapes: Story = {
  render: () => ({
    components: { VBtn },
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <VBtn>Default</VBtn>
        <VBtn :rounded="true">Rounded</VBtn>
      </div>
    `,
  }),
}

export const BlockButton: Story = {
  render: () => ({
    components: { VBtn },
    template: `
      <div style="width: 100%; max-width: 400px;">
        <VBtn :block="true" color="primary">Block Button</VBtn>
      </div>
    `,
  }),
}

export const VariantColorCombinations: Story = {
  render: () => ({
    components: { VBtn },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <span style="min-width: 80px; font-weight: 500;">Filled:</span>
          <VBtn variant="filled" color="primary">Primary</VBtn>
          <VBtn variant="filled" color="success">Success</VBtn>
          <VBtn variant="filled" color="error">Error</VBtn>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <span style="min-width: 80px; font-weight: 500;">Outlined:</span>
          <VBtn variant="outlined" color="primary">Primary</VBtn>
          <VBtn variant="outlined" color="success">Success</VBtn>
          <VBtn variant="outlined" color="error">Error</VBtn>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <span style="min-width: 80px; font-weight: 500;">Text:</span>
          <VBtn variant="text" color="primary">Primary</VBtn>
          <VBtn variant="text" color="success">Success</VBtn>
          <VBtn variant="text" color="error">Error</VBtn>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <span style="min-width: 80px; font-weight: 500;">Tonal:</span>
          <VBtn variant="tonal" color="primary">Primary</VBtn>
          <VBtn variant="tonal" color="success">Success</VBtn>
          <VBtn variant="tonal" color="error">Error</VBtn>
        </div>
      </div>
    `,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { VBtn },
    setup () {
      const loading = ref(false)

      const handleClick = () => {
        loading.value = true
        setTimeout(() => {
          loading.value = false
        }, 2000)
      }

      return { loading, handleClick }
    },
    template: `
      <VBtn :loading="loading" @click="handleClick">
        Click to Load
      </VBtn>
    `,
  }),
}

export const CustomLoading: Story = {
  render: () => ({
    components: { VBtn, Icon },
    setup () {
      const loading = ref(false)

      const handleClick = () => {
        loading.value = true
        setTimeout(() => {
          loading.value = false
        }, 3000)
      }

      return { loading, handleClick }
    },
    template: `
      <VBtn :loading="loading" @click="handleClick" color="success">
        <template #loading>
          <Icon icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
        </template>
        Send Message
      </VBtn>
    `,
  }),
}
