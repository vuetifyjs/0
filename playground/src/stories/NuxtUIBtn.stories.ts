import type { Meta, StoryObj } from '@storybook/vue3-vite'
import NuxtUIBtn from '../components/NuxtUIBtn.vue'

const meta: Meta<typeof NuxtUIBtn> = {
  title: 'Components/NuxtUIBtn',
  component: NuxtUIBtn,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'soft', 'ghost', 'link'],
    },
    color: {
      control: { type: 'select' },
      options: [
        'primary',
        'gray',
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',
      ],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    icon: { control: 'text' },
    loadingIcon: { control: 'text' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    leading: { control: 'boolean' },
    trailing: { control: 'boolean' },
    square: { control: 'boolean' },
    block: { control: 'boolean' },
    active: { control: 'boolean' },
  },
  args: {
    label: 'Button',
    variant: 'solid',
    color: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    trailing: false,
    square: false,
    block: false,
    active: false,
  },
}

export default meta
type Story = StoryObj<typeof NuxtUIBtn>

export const Default: Story = {
  args: {
    label: 'Default Button',
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Icon Button',
    icon: 'lucide:edit',
  },
}

export const TrailingIcon: Story = {
  args: {
    label: 'Trailing Icon',
    icon: 'lucide:arrow-right',
    trailing: true,
  },
}

export const Loading: Story = {
  args: {
    label: 'Loading Button',
    loading: true,
  },
}

export const LoadingWithIcon: Story = {
  args: {
    label: 'Loading Icon',
    icon: 'lucide:cloud-upload',
    loading: true,
  },
}

export const LoadingWithTrailingIcon: Story = {
  args: {
    label: 'Loading Trailing',
    icon: 'lucide:settings',
    trailing: true,
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    disabled: true,
  },
}

export const Square: Story = {
  args: {
    icon: 'lucide:search',
    square: true,
    label: '',
  },
}

export const Block: Story = {
  args: {
    label: 'Block Button',
    block: true,
  },
}

export const LinkVariant: Story = {
  args: {
    label: 'Link Button',
    variant: 'link',
  },
}
