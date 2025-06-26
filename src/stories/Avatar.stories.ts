import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Avatar } from '@/lib/components/Avatar'

const meta: Meta<typeof Avatar.Root> = {
  title: 'Components/Avatar',
  component: Avatar.Root,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'span'],
      description: 'The HTML element to render',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic Avatar with Image
export const Default: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; background: #f0f0f0;">
        <AvatarImage 
          src="https://picsum.photos/64/64?random=1" 
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback style="font-weight: bold; color: #666;">JD</AvatarFallback>
      </AvatarRoot>
    `,
  }),
  args: {
    as: 'div',
  },
}

// Avatar with Fallback (broken image)
export const WithFallback: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; background: #f0f0f0;">
        <AvatarImage 
          src="https://broken-image-url.jpg" 
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback style="font-weight: bold; color: #666; font-size: 18px;">JD</AvatarFallback>
      </AvatarRoot>
    `,
  }),
  args: {
    as: 'div',
  },
}

// Small Avatar
export const Small: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; background: #f0f0f0;">
        <AvatarImage 
          src="https://picsum.photos/32/32?random=2" 
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback style="font-weight: bold; color: #666; font-size: 12px;">SM</AvatarFallback>
      </AvatarRoot>
    `,
  }),
  args: {
    as: 'div',
  },
}

// Large Avatar
export const Large: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" style="width: 96px; height: 96px; border-radius: 50%; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; background: #f0f0f0;">
        <AvatarImage 
          src="https://picsum.photos/96/96?random=3" 
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback style="font-weight: bold; color: #666; font-size: 24px;">LG</AvatarFallback>
      </AvatarRoot>
    `,
  }),
  args: {
    as: 'div',
  },
}

// Square Avatar
export const Square: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" style="width: 64px; height: 64px; border-radius: 8px; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; background: #f0f0f0;">
        <AvatarImage 
          src="https://picsum.photos/64/64?random=4" 
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback style="font-weight: bold; color: #666;">SQ</AvatarFallback>
      </AvatarRoot>
    `,
  }),
  args: {
    as: 'div',
  },
}

// Avatar Group
export const Group: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
    <div class="flex">
      <AvatarRoot class="size-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100 border-2 border-white -mr-2 z-30">
        <AvatarImage
          alt="User 1"
          class="w-full h-full object-cover"
          src="https://picsum.photos/48/48?random=5"
        />
        <AvatarFallback class="font-bold text-gray-600">U1</AvatarFallback>
      </AvatarRoot>
      <AvatarRoot class="size-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100 border-2 border-white -mr-2 z-20">
        <AvatarImage
          alt="User 2"
          class="w-full h-full object-cover"
          src="https://picsum.photos/48/48?random=6"
        />
        <AvatarFallback class="font-bold text-gray-600">U2</AvatarFallback>
      </AvatarRoot>
      <AvatarRoot class="size-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-100 border-2 border-white -mr-2 z-10">
        <AvatarImage
          alt="User 3"
          class="w-full h-full object-cover"
          src="https://broken-image.jpg"
        />
        <AvatarFallback class="font-bold text-gray-600">U3</AvatarFallback>
      </AvatarRoot>
    </div>
    `,
  }),
  args: {
    as: 'div',
  },
}

// Text Only Avatar (fallback only)
export const TextOnly: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" style="width: 64px; height: 64px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <AvatarFallback style="font-weight: bold; font-size: 18px;">AB</AvatarFallback>
      </AvatarRoot>
    `,
  }),
  args: {
    as: 'div',
  },
}

// Multiple Images with Priority
export const MultiplePriority: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; background: #f0f0f0;">
        <!-- High priority image (should show if loaded) -->
        <AvatarImage 
          :priority="1"
          src="https://picsum.photos/64/64?random=7" 
          alt="High Priority Avatar"
          class="w-full h-full object-cover"
        />
        <!-- Low priority image (backup) -->
        <AvatarImage 
          :priority="2"
          src="https://picsum.photos/64/64?random=8" 
          alt="Low Priority Avatar"
          class="w-full h-full object-cover"
        />
        <!-- Fallback -->
        <AvatarFallback style="font-weight: bold; color: #666;">MP</AvatarFallback>
      </AvatarRoot>
    `,
  }),
  args: {
    as: 'div',
  },
}
