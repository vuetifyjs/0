import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { User } from 'lucide-vue-next'

import VAvatar from '../components/VAvatar.vue'

const meta = {
  title: 'Components/VAvatar',
  component: VAvatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['x-small', 'small', 'default', 'large', 'x-large'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
    },
    variant: {
      control: 'select',
      options: ['flat', 'elevated', 'text', 'tonal', 'plain', 'outlined'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    border: {
      control: 'select',
      options: [false, true, 'sm', 'md', 'lg'],
    },
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'default'],
    },
    image: { control: 'text' },
    text: { control: 'text' },
    icon: { control: 'text' },
    tile: { control: 'boolean' },
  },
  args: {
    size: 'default',
    color: 'primary',
    variant: 'flat',
    rounded: 'full',
    border: false,
    density: 'default',
    tile: false,
  },
} satisfies Meta<typeof VAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'JD',
  },
}

export const BasicUsage: Story = {
  render: () => ({
    components: { VAvatar, User },
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <VAvatar image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
        <VAvatar text="JD" />
        <VAvatar icon="ph:user-bold" />
        <VAvatar>
          <User />
        </VAvatar>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { VAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <VAvatar size="x-small" text="XS" />
        <VAvatar size="small" text="S" />
        <VAvatar size="default" text="D" />
        <VAvatar size="large" text="L" />
        <VAvatar size="x-large" text="XL" />
        <VAvatar :size="64" text="64" />
        <VAvatar size="80px" text="80" />
      </div>
    `,
  }),
}

export const Colors: Story = {
  render: () => ({
    components: { VAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <VAvatar color="primary" text="P" />
        <VAvatar color="secondary" text="S" />
        <VAvatar color="success" text="✓" />
        <VAvatar color="warning" text="!" />
        <VAvatar color="error" text="✗" />
        <VAvatar color="info" text="i" />
      </div>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { VAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <VAvatar text="F" variant="flat" />
        <VAvatar text="E" variant="elevated" />
        <VAvatar text="T" variant="text" />
        <VAvatar color="primary" text="T" variant="tonal" />
        <VAvatar text="P" variant="plain" />
        <VAvatar text="O" variant="outlined" />
      </div>
    `,
  }),
}

export const RoundedAndTile: Story = {
  render: () => ({
    components: { VAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <VAvatar rounded="none" text="N" />
        <VAvatar rounded="xs" text="XS" />
        <VAvatar rounded="sm" text="SM" />
        <VAvatar rounded="md" text="MD" />
        <VAvatar rounded="lg" text="LG" />
        <VAvatar rounded="xl" text="XL" />
        <VAvatar rounded="full" text="F" />
        <VAvatar text="T" tile />
      </div>
    `,
  }),
}

export const Border: Story = {
  render: () => ({
    components: { VAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <VAvatar border text="B" />
        <VAvatar border="sm" text="SM" />
        <VAvatar border="md" text="MD" />
        <VAvatar border="lg" text="LG" />
        <VAvatar :border="8" text="8" />
      </div>
    `,
  }),
}

export const Density: Story = {
  render: () => ({
    components: { VAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <VAvatar density="compact" text="C" variant="outlined" />
        <VAvatar density="comfortable" text="Co" variant="outlined" />
        <VAvatar density="default" text="D" variant="outlined" />
      </div>
    `,
  }),
}

export const ImageWithFallback: Story = {
  render: () => ({
    components: { VAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <VAvatar
          image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          text="JD"
        />
        <VAvatar
          color="error"
          image="https://broken-url.jpg"
          text="FB"
        />
        <VAvatar
          :delay-ms="1000"
          icon="ph:user-bold"
          image="https://slow-loading-image.jpg"
        />
      </div>
    `,
  }),
}

export const ComplexExamples: Story = {
  render: () => ({
    components: { VAvatar },
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <VAvatar
          border="md"
          color="primary"
          size="large"
          text="CEO"
          variant="elevated"
        />
        <VAvatar
          color="success"
          icon="ph:check-bold"
          rounded="lg"
          size="x-large"
          variant="tonal"
        />
        <VAvatar
          color="warning"
          :size="56"
          tile
          variant="outlined"
        >
          <div style="font-size: 1.25rem;">🎭</div>
        </VAvatar>
      </div>
    `,
  }),
}

export const AvatarGroup: Story = {
  render: () => ({
    components: { VAvatar },
    template: `
      <div style="display: flex; align-items: center;">
        <VAvatar
          border="md"
          style="border-color: white; margin-left: -0.5rem; z-index: 40;"
          image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        />
        <VAvatar
          border="md"
          style="border-color: white; margin-left: -0.5rem; z-index: 30;"
          image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
        />
        <VAvatar
          border="md"
          style="border-color: white; margin-left: -0.5rem; z-index: 20;"
          image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        />
        <VAvatar
          border="md"
          style="border-color: white; margin-left: -0.5rem; z-index: 10;"
          color="secondary"
          text="+3"
        />
      </div>
    `,
  }),
}

export const WithImage: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
}

export const WithIcon: Story = {
  args: {
    icon: 'ph:user-bold',
    color: 'primary',
  },
}

export const WithText: Story = {
  args: {
    text: 'AB',
    color: 'success',
    variant: 'tonal',
  },
}

export const Large: Story = {
  args: {
    text: 'XL',
    size: 'x-large',
    color: 'primary',
    variant: 'elevated',
  },
}

export const Square: Story = {
  args: {
    text: 'SQ',
    tile: true,
    color: 'warning',
  },
}
