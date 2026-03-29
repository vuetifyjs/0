<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import {
    HxAccordion,
    HxAccordionItem,
    HxAlert,
    HxAlertContent,
    HxAlertDismiss,
    HxAlertTitle,
    HxApiCard,
    HxApiTable,
    HxAppBar,
    HxAppBarEnd,
    HxAppBarStart,
    HxBackToTop,
    HxBadge,
    HxBreadcrumbs,
    HxButton,
    HxCallout,
    HxCard,
    HxChip,
    HxCloseButton,
    HxCodeBlock,
    HxCodeGroup,
    HxCopyCommand,
    HxCopyCommandAction,
    HxCopyCommandText,
    HxDivider,
    HxDropdown,
    HxDropdownContent,
    HxDropdownTrigger,
    HxExample,
    HxExampleTitle,
    HxFaq,
    HxFaqItem,
    HxHeaderAnchor,
    HxIcon,
    HxIconButton,
    HxInput,
    HxKbd,
    HxLink,
    HxLoaderIcon,
    HxNavGroup,
    HxNavLink,
    HxPackageManagerTabs,
    HxPageNavigator,
    HxProgressBar,
    HxProgressBarLabel,
    HxSettings,
    HxSkeleton,
    HxSwitch,
    HxTabs,
    HxTabPanel,
    HxThemeToggle,
    HxTooltip,
  } from '../src'

  const switchValue = shallowRef(false)
  const switchValue2 = shallowRef(true)
  const inputValue = shallowRef('')
  const alertVisible = shallowRef(true)

  const sampleCode = `import { createApp } from 'vue'
import { createHelixPlugin } from '@paper/helix'

const app = createApp(App)
app.use(createHelixPlugin())
app.mount('#app')`

  const sampleApiItems = [
    { name: 'color', type: 'string', default: '\'primary\'', description: 'The color variant' },
    { name: 'size', type: '\'sm\' | \'md\'', default: '\'md\'', description: 'Size of the component' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the component' },
  ]
</script>

<template>
  <div class="bg-background text-on-background min-h-screen">
    <div class="max-w-4xl mx-auto p-8">
      <h1 class="text-3xl font-bold mb-2">Helix Kitchen Sink</h1>
      <p class="text-on-surface-variant mb-8">Every component in @paper/helix, rendered on a single page.</p>

      <!-- ============================================================ -->
      <!-- LAYOUT -->
      <!-- ============================================================ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Layout</h2>

        <!-- HxAppBar -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxAppBar</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxAppBar class="bg-surface border border-divider rounded-lg px-4">
              <HxAppBarStart>
                <span class="font-bold">Logo</span>
              </HxAppBarStart>
              <HxAppBarEnd>
                <HxThemeToggle show-label />
              </HxAppBarEnd>
            </HxAppBar>
          </div>
        </div>

        <!-- HxDivider -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxDivider</h3>
          <div class="p-4 border border-divider rounded-lg">
            <p class="mb-2">Content above</p>
            <HxDivider />
            <p class="mt-2">Content below</p>
            <div class="flex items-center gap-4 h-8 mt-4">
              <span>Left</span>
              <HxDivider orientation="vertical" />
              <span>Right</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- ACTIONS -->
      <!-- ============================================================ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Actions</h2>

        <!-- HxButton -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxButton</h3>
          <div class="p-4 border border-divider rounded-lg flex flex-wrap items-center gap-3">
            <HxButton variant="primary">Primary</HxButton>
            <HxButton variant="secondary">Secondary</HxButton>
            <HxButton variant="ghost">Ghost</HxButton>
            <HxButton disabled variant="primary">Disabled</HxButton>
            <HxButton loading variant="primary">Loading</HxButton>
          </div>
        </div>

        <!-- HxIconButton -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxIconButton</h3>
          <div class="p-4 border border-divider rounded-lg flex items-center gap-3">
            <HxIconButton title="Settings">&#9881;</HxIconButton>
            <HxIconButton title="Edit">&#9998;</HxIconButton>
            <HxIconButton disabled title="Disabled">&#10006;</HxIconButton>
          </div>
        </div>

        <!-- HxCloseButton -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxCloseButton</h3>
          <div class="p-4 border border-divider rounded-lg flex items-center gap-3">
            <HxCloseButton size="sm" />
            <HxCloseButton size="md" />
          </div>
        </div>

        <!-- HxBackToTop -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxBackToTop</h3>
          <div class="p-4 border border-divider rounded-lg">
            <p class="text-sm text-on-surface-variant">
              HxBackToTop renders a floating button when the user scrolls down. Scroll this page to see it in action.
            </p>
            <HxBackToTop />
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- CONTENT -->
      <!-- ============================================================ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Content</h2>

        <!-- HxCard -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxCard</h3>
          <div class="p-4 border border-divider rounded-lg flex flex-wrap gap-4">
            <HxCard class="p-4 w-48">
              <p class="font-medium">Plain Card</p>
              <p class="text-sm text-on-surface-variant">Basic content</p>
            </HxCard>
            <HxCard class="p-4 w-48" hoverable>
              <p class="font-medium">Hoverable</p>
              <p class="text-sm text-on-surface-variant">Hover to see effect</p>
            </HxCard>
            <HxCard class="p-4 w-48" href="#">
              <p class="font-medium">Linked Card</p>
              <p class="text-sm text-on-surface-variant">Clickable link</p>
            </HxCard>
          </div>
        </div>

        <!-- HxBadge -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxBadge</h3>
          <div class="p-4 border border-divider rounded-lg">
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <HxBadge color="primary" label="Primary" />
              <HxBadge color="success" label="Success" />
              <HxBadge color="warning" label="Warning" />
              <HxBadge color="error" label="Error" />
              <HxBadge color="info" label="Info" />
            </div>
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <HxBadge color="primary" label="Solid" variant="solid" />
              <HxBadge color="primary" label="Outlined" variant="outlined" />
              <HxBadge color="primary" label="Subtle" variant="subtle" />
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <HxBadge color="primary" label="Small" size="sm" />
              <HxBadge color="primary" label="Medium" size="md" />
              <HxBadge color="success" label="Pill" shape="pill" />
              <HxBadge color="success" label="Rounded" shape="rounded" />
            </div>
          </div>
        </div>

        <!-- HxChip -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxChip</h3>
          <div class="p-4 border border-divider rounded-lg flex items-center gap-3">
            <HxChip text="Default" />
            <HxChip color="var(--v0-primary)">Colored</HxChip>
            <HxChip color="var(--v0-success)">Success</HxChip>
          </div>
        </div>

        <!-- HxKbd -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxKbd</h3>
          <div class="p-4 border border-divider rounded-lg flex items-center gap-2">
            <HxKbd>Ctrl</HxKbd>
            <span>+</span>
            <HxKbd>K</HxKbd>
            <span class="ml-4">or</span>
            <HxKbd>Esc</HxKbd>
          </div>
        </div>

        <!-- HxLink -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxLink</h3>
          <div class="p-4 border border-divider rounded-lg flex items-center gap-4">
            <HxLink to="/">Internal Link</HxLink>
            <HxLink to="https://vuetifyjs.com">External Link</HxLink>
            <HxLink no-suffix to="https://vuetifyjs.com">No Suffix</HxLink>
          </div>
        </div>

        <!-- HxIcon -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxIcon</h3>
          <div class="p-4 border border-divider rounded-lg flex items-center gap-4">
            <HxIcon :size="16">&#9733;</HxIcon>
            <HxIcon :size="24">&#9733;</HxIcon>
            <HxIcon :size="32">&#9733;</HxIcon>
          </div>
        </div>

        <!-- HxBreadcrumbs -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxBreadcrumbs</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxBreadcrumbs
              :items="[
                { label: 'Home', to: '/' },
                { label: 'Components', to: '/' },
                { label: 'Button' },
              ]"
            />
          </div>
        </div>

        <!-- HxHeaderAnchor -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxHeaderAnchor</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxHeaderAnchor id="demo-heading" tag="h3">Linkable Heading</HxHeaderAnchor>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- FEEDBACK -->
      <!-- ============================================================ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Feedback</h2>

        <!-- HxAlert -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxAlert</h3>
          <div class="p-4 border border-divider rounded-lg space-y-3">
            <HxAlert type="info">
              <HxAlertTitle>Info Alert</HxAlertTitle>
              <HxAlertContent>This is an informational message.</HxAlertContent>
            </HxAlert>
            <HxAlert type="success">
              <HxAlertTitle>Success</HxAlertTitle>
              <HxAlertContent>Operation completed successfully.</HxAlertContent>
            </HxAlert>
            <HxAlert type="warning">
              <HxAlertTitle>Warning</HxAlertTitle>
              <HxAlertContent>Please review before continuing.</HxAlertContent>
            </HxAlert>
            <HxAlert type="error">
              <HxAlertTitle>Error</HxAlertTitle>
              <HxAlertContent>Something went wrong.</HxAlertContent>
            </HxAlert>
            <HxAlert v-if="alertVisible" type="info">
              <HxAlertTitle>Dismissable</HxAlertTitle>
              <HxAlertContent>Click the X to dismiss.</HxAlertContent>
              <HxAlertDismiss @dismiss="alertVisible = false" />
            </HxAlert>
          </div>
        </div>

        <!-- HxCallout -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxCallout</h3>
          <div class="p-4 border border-divider rounded-lg space-y-3">
            <HxCallout type="tip">This is a helpful tip for the reader.</HxCallout>
            <HxCallout type="info">Informational callout with additional context.</HxCallout>
            <HxCallout type="warning">Be careful when modifying this setting.</HxCallout>
            <HxCallout type="error">This action is destructive and cannot be undone.</HxCallout>
          </div>
        </div>

        <!-- HxProgressBar -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxProgressBar</h3>
          <div class="p-4 border border-divider rounded-lg space-y-4">
            <HxProgressBar color="primary" :value="25">
              <HxProgressBarLabel>25%</HxProgressBarLabel>
            </HxProgressBar>
            <HxProgressBar color="success" :value="50">
              <HxProgressBarLabel>50%</HxProgressBarLabel>
            </HxProgressBar>
            <HxProgressBar color="warning" :value="75">
              <HxProgressBarLabel>75%</HxProgressBarLabel>
            </HxProgressBar>
            <HxProgressBar color="error" :value="90">
              <HxProgressBarLabel>90%</HxProgressBarLabel>
            </HxProgressBar>
            <HxProgressBar color="primary" size="md" :value="60">
              <HxProgressBarLabel>60%</HxProgressBarLabel>
            </HxProgressBar>
          </div>
        </div>

        <!-- HxLoaderIcon -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxLoaderIcon</h3>
          <div class="p-4 border border-divider rounded-lg flex items-center gap-6">
            <div class="flex flex-col items-center gap-1">
              <HxLoaderIcon :size="20" variant="spinner" />
              <span class="text-xs text-on-surface-variant">Spinner</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <HxLoaderIcon :size="20" variant="dots" />
              <span class="text-xs text-on-surface-variant">Dots</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <HxLoaderIcon :size="20" variant="wave" />
              <span class="text-xs text-on-surface-variant">Wave</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <HxLoaderIcon :size="20" variant="orbit" />
              <span class="text-xs text-on-surface-variant">Orbit</span>
            </div>
          </div>
        </div>

        <!-- HxSkeleton -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxSkeleton</h3>
          <div class="p-4 border border-divider rounded-lg space-y-4">
            <HxSkeleton :lines="3" :widths="['w-full', 'w-3/4', 'w-1/2']" />
            <HxSkeleton direction="row" height="h-8" :lines="2" :widths="['w-24', 'w-32']" />
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- FORMS -->
      <!-- ============================================================ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Forms</h2>

        <!-- HxInput -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxInput</h3>
          <div class="p-4 border border-divider rounded-lg space-y-3">
            <HxInput v-model="inputValue" placeholder="Type something..." />
            <HxInput disabled placeholder="Disabled" />
            <p class="text-sm text-on-surface-variant">Value: {{ inputValue || '(empty)' }}</p>
          </div>
        </div>

        <!-- HxSwitch -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxSwitch</h3>
          <div class="p-4 border border-divider rounded-lg flex items-center gap-6">
            <div class="flex items-center gap-2">
              <HxSwitch v-model="switchValue" label="Default" />
              <span class="text-sm">{{ switchValue ? 'On' : 'Off' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <HxSwitch v-model="switchValue2" label="Small" small />
              <span class="text-sm">{{ switchValue2 ? 'On' : 'Off' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- INTERACTIVE -->
      <!-- ============================================================ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Interactive</h2>

        <!-- HxDropdown -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxDropdown</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxDropdown>
              <HxDropdownTrigger>
                <HxButton variant="secondary">Open Dropdown</HxButton>
              </HxDropdownTrigger>

              <HxDropdownContent class="bg-surface border border-divider rounded-lg p-2 shadow-lg">
                <div class="px-3 py-1.5 hover:bg-surface-tint rounded cursor-pointer">Option 1</div>
                <div class="px-3 py-1.5 hover:bg-surface-tint rounded cursor-pointer">Option 2</div>
                <div class="px-3 py-1.5 hover:bg-surface-tint rounded cursor-pointer">Option 3</div>
              </HxDropdownContent>
            </HxDropdown>
          </div>
        </div>

        <!-- HxTooltip -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxTooltip</h3>
          <div class="p-4 border border-divider rounded-lg flex items-center gap-4">
            <HxTooltip placement="top" text="Tooltip on top">
              <HxButton variant="secondary">Top</HxButton>
            </HxTooltip>
            <HxTooltip placement="bottom" text="Tooltip on bottom">
              <HxButton variant="secondary">Bottom</HxButton>
            </HxTooltip>
            <HxTooltip placement="left" text="Tooltip on left">
              <HxButton variant="secondary">Left</HxButton>
            </HxTooltip>
            <HxTooltip placement="right" text="Tooltip on right">
              <HxButton variant="secondary">Right</HxButton>
            </HxTooltip>
          </div>
        </div>

        <!-- HxTabs -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxTabs</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxTabs
              :items="[
                { value: 'overview', label: 'Overview' },
                { value: 'api', label: 'API' },
                { value: 'examples', label: 'Examples' },
              ]"
            >
              <HxTabPanel value="overview">
                <div class="p-4">Overview content goes here.</div>
              </HxTabPanel>
              <HxTabPanel value="api">
                <div class="p-4">API documentation content.</div>
              </HxTabPanel>
              <HxTabPanel value="examples">
                <div class="p-4">Example code and demos.</div>
              </HxTabPanel>
            </HxTabs>
          </div>
        </div>

        <!-- HxAccordion -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxAccordion</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxAccordion>
              <HxAccordionItem title="First Section">
                <p class="p-3">Content for the first section.</p>
              </HxAccordionItem>
              <HxAccordionItem title="Second Section">
                <p class="p-3">Content for the second section.</p>
              </HxAccordionItem>
              <HxAccordionItem disabled title="Disabled Section">
                <p class="p-3">This section is disabled.</p>
              </HxAccordionItem>
            </HxAccordion>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- CODE -->
      <!-- ============================================================ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Code</h2>

        <!-- HxCodeBlock -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxCodeBlock</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxCodeBlock :code="sampleCode" language="ts" />
          </div>
        </div>

        <!-- HxCodeGroup -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxCodeGroup</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxCodeGroup
              :items="[
                { label: 'main.ts', code: sampleCode, language: 'ts' },
                { label: 'App.vue', code: '<template>\n  <div>Hello Helix</div>\n</template>', language: 'vue' },
              ]"
            />
          </div>
        </div>

        <!-- HxCopyCommand -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxCopyCommand</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxCopyCommand>
              <HxCopyCommandText>pnpm add @paper/helix</HxCopyCommandText>
              <HxCopyCommandAction text="pnpm add @paper/helix" />
            </HxCopyCommand>
          </div>
        </div>

        <!-- HxPackageManagerTabs -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxPackageManagerTabs</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxPackageManagerTabs package="@paper/helix" />
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- NAVIGATION -->
      <!-- ============================================================ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Navigation</h2>

        <!-- HxNavGroup + HxNavLink -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxNavGroup / HxNavLink</h3>
          <div class="p-4 border border-divider rounded-lg">
            <ul class="list-none p-0 m-0">
              <HxNavGroup label="Getting Started">
                <HxNavLink label="Installation" to="/" />
                <HxNavLink label="Quick Start" to="/" />
                <HxNavLink active label="Configuration" to="/" />
              </HxNavGroup>
              <HxNavGroup label="Components">
                <HxNavLink label="Button" to="/" />
                <HxNavLink label="Card" to="/" />
                <HxNavLink label="Alert" to="/" />
              </HxNavGroup>
            </ul>
          </div>
        </div>

        <!-- HxPageNavigator -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxPageNavigator</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxPageNavigator
              :next="{ label: 'Configuration', to: '/' }"
              :prev="{ label: 'Installation', to: '/' }"
            />
          </div>
        </div>

        <!-- HxToc -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxToc</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxToc
              active-id="installation"
              :headings="[
                { id: 'overview', text: 'Overview', level: 2, children: [] },
                { id: 'installation', text: 'Installation', level: 2, children: [
                  { id: 'prerequisites', text: 'Prerequisites', level: 3, children: [] },
                ] },
                { id: 'usage', text: 'Usage', level: 2, children: [] },
              ]"
            />
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- DISPLAY -->
      <!-- ============================================================ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Display</h2>

        <!-- HxExample -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxExample</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxExample
              :code="'<HxButton variant=&quot;primary&quot;>Click me</HxButton>'"
              language="vue"
              title="Button Example"
            >
              <HxExampleTitle>Button Demo</HxExampleTitle>
              <div class="p-4">
                <HxButton variant="primary">Click me</HxButton>
              </div>
            </HxExample>
          </div>
        </div>

        <!-- HxApiCard -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxApiCard</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxApiCard
              default="'primary'"
              description="Sets the color variant of the component."
              kind="prop"
              name="color"
              type="'primary' | 'secondary' | 'success'"
            />
          </div>
        </div>

        <!-- HxApiTable -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxApiTable</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxApiTable :items="sampleApiItems" kind="prop" />
          </div>
        </div>

        <!-- HxFaq -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxFaq / HxFaqItem</h3>
          <div class="p-4 border border-divider rounded-lg">
            <HxFaq>
              <HxFaqItem question="What is Helix?">
                <p class="p-3">Helix is a documentation design system built on Paper and v0.</p>
              </HxFaqItem>
              <HxFaqItem question="How do I install it?">
                <p class="p-3">Run <code>pnpm add @paper/helix</code> in your project.</p>
              </HxFaqItem>
              <HxFaqItem question="Is it production ready?">
                <p class="p-3">Helix is currently in active development.</p>
              </HxFaqItem>
            </HxFaq>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SEARCH -->
      <!-- ============================================================ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Search</h2>

        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxSearch</h3>
          <div class="p-4 border border-divider rounded-lg">
            <p class="text-sm text-on-surface-variant">
              HxSearch opens a modal search dialog triggered by
              <HxKbd>Ctrl</HxKbd>+<HxKbd>K</HxKbd>.
              It requires search items or external result groups to function.
              Press the hotkey to see the empty modal.
            </p>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SETTINGS -->
      <!-- ============================================================ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Settings</h2>

        <!-- HxThemeToggle -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxThemeToggle</h3>
          <div class="p-4 border border-divider rounded-lg flex items-center gap-4">
            <HxThemeToggle />
            <HxThemeToggle show-label />
          </div>
        </div>

        <!-- HxSettings -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">HxSettings</h3>
          <div class="p-4 border border-divider rounded-lg">
            <p class="text-sm text-on-surface-variant">
              HxSettings is a slide-over panel controlled by the settings composable.
              It renders when <code>settings.isOpen</code> is true.
            </p>
            <HxSettings />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
