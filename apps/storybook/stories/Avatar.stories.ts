// Framework
import { Avatar } from '@vuetify/v0'

// Types
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Avatar.Root> = {
  title: 'Components/Avatar',
  component: Avatar.Root as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
      <AvatarRoot v-bind="args" class="size-16 rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-1 ring-zinc-950/5">
        <AvatarImage
          src="https://picsum.photos/64/64?random=1"
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback class="font-bold text-zinc-600">JD</AvatarFallback>
      </AvatarRoot>
    `,
  }),
}

// Avatar with Fallback (broken image)
export const WithFallback: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" class="size-16 rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-1 ring-zinc-950/5">
        <AvatarImage
          src="https://broken-image-url.jpg"
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback class="font-bold text-zinc-600 text-lg">JD</AvatarFallback>
      </AvatarRoot>
    `,
  }),
}

// Small Avatar
export const Small: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" class="size-8 rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-1 ring-zinc-950/5">
        <AvatarImage
          src="https://picsum.photos/32/32?random=2"
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback class="font-bold text-zinc-600 text-xs">SM</AvatarFallback>
      </AvatarRoot>
    `,
  }),
}

// Large Avatar
export const Large: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" class="size-24 rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-1 ring-zinc-950/5 shadow-lg">
        <AvatarImage
          src="https://picsum.photos/96/96?random=3"
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback class="font-bold text-zinc-600 text-2xl">LG</AvatarFallback>
      </AvatarRoot>
    `,
  }),
}

// Square Avatar
export const Square: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" class="size-16 rounded-xl overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-1 ring-zinc-950/5">
        <AvatarImage
          src="https://picsum.photos/64/64?random=4"
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
        <AvatarFallback class="font-bold text-zinc-600">SQ</AvatarFallback>
      </AvatarRoot>
    `,
  }),
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
      <AvatarRoot class="size-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-2 ring-white -mr-2 z-30 shadow-sm">
        <AvatarImage
          alt="User 1"
          class="w-full h-full object-cover"
          src="https://picsum.photos/48/48?random=5"
        />
        <AvatarFallback class="font-bold text-zinc-600 text-sm">U1</AvatarFallback>
      </AvatarRoot>
      <AvatarRoot class="size-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-2 ring-white -mr-2 z-20 shadow-sm">
        <AvatarImage
          alt="User 2"
          class="w-full h-full object-cover"
          src="https://picsum.photos/48/48?random=6"
        />
        <AvatarFallback class="font-bold text-zinc-600 text-sm">U2</AvatarFallback>
      </AvatarRoot>
      <AvatarRoot class="size-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-2 ring-white -mr-2 z-10 shadow-sm">
        <AvatarImage
          alt="User 3"
          class="w-full h-full object-cover"
          src="https://broken-image.jpg"
        />
        <AvatarFallback class="font-bold text-zinc-600 text-sm">U3</AvatarFallback>
      </AvatarRoot>
      <div class="size-12 rounded-full inline-flex items-center justify-center bg-zinc-200 ring-2 ring-white text-xs font-semibold text-zinc-600 shadow-sm">
        +5
      </div>
    </div>
    `,
  }),
}

// Text Only Avatar (fallback only)
export const TextOnly: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" class="size-16 rounded-full inline-flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25">
        <AvatarFallback class="font-bold text-lg">AB</AvatarFallback>
      </AvatarRoot>
    `,
  }),
}

// Color Variants
export const ColorVariants: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarFallback: Avatar.Fallback },
    setup () {
      const colors = [
        { initials: 'JD', from: 'from-blue-500', to: 'to-cyan-500', shadow: 'shadow-blue-500/25' },
        { initials: 'AB', from: 'from-violet-500', to: 'to-purple-600', shadow: 'shadow-violet-500/25' },
        { initials: 'CD', from: 'from-emerald-500', to: 'to-teal-600', shadow: 'shadow-emerald-500/25' },
        { initials: 'EF', from: 'from-amber-500', to: 'to-orange-600', shadow: 'shadow-amber-500/25' },
        { initials: 'GH', from: 'from-rose-500', to: 'to-pink-600', shadow: 'shadow-rose-500/25' },
      ]
      return { args, colors }
    },
    template: `
      <div class="flex gap-3">
        <AvatarRoot
          v-for="color in colors"
          :key="color.initials"
          class="size-12 rounded-full inline-flex items-center justify-center text-white shadow-lg bg-gradient-to-br"
          :class="[color.from, color.to, color.shadow]"
        >
          <AvatarFallback class="font-bold text-sm">{{ color.initials }}</AvatarFallback>
        </AvatarRoot>
      </div>
    `,
  }),
}

// Multiple Images with Priority
export const MultiplePriority: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <AvatarRoot v-bind="args" class="size-16 rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-1 ring-zinc-950/5">
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
        <AvatarFallback class="font-bold text-zinc-600">MP</AvatarFallback>
      </AvatarRoot>
    `,
  }),
}

// With Status Indicator
export const WithStatus: Story = {
  render: args => ({
    components: { AvatarRoot: Avatar.Root, AvatarImage: Avatar.Image, AvatarFallback: Avatar.Fallback },
    setup () {
      return { args }
    },
    template: `
      <div class="flex gap-6">
        <div class="relative">
          <AvatarRoot class="size-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-1 ring-zinc-950/5">
            <AvatarImage
              src="https://picsum.photos/48/48?random=9"
              alt="Online User"
              class="w-full h-full object-cover"
            />
            <AvatarFallback class="font-bold text-zinc-600 text-sm">ON</AvatarFallback>
          </AvatarRoot>
          <span class="absolute bottom-0 right-0 size-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
        </div>

        <div class="relative">
          <AvatarRoot class="size-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-1 ring-zinc-950/5">
            <AvatarImage
              src="https://picsum.photos/48/48?random=10"
              alt="Away User"
              class="w-full h-full object-cover"
            />
            <AvatarFallback class="font-bold text-zinc-600 text-sm">AW</AvatarFallback>
          </AvatarRoot>
          <span class="absolute bottom-0 right-0 size-3.5 bg-amber-500 rounded-full ring-2 ring-white" />
        </div>

        <div class="relative">
          <AvatarRoot class="size-12 rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-100 ring-1 ring-zinc-950/5">
            <AvatarImage
              src="https://picsum.photos/48/48?random=11"
              alt="Offline User"
              class="w-full h-full object-cover"
            />
            <AvatarFallback class="font-bold text-zinc-600 text-sm">OF</AvatarFallback>
          </AvatarRoot>
          <span class="absolute bottom-0 right-0 size-3.5 bg-zinc-400 rounded-full ring-2 ring-white" />
        </div>
      </div>
    `,
  }),
}
