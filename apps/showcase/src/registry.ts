import { helixTheme } from '@paper/helix'

// Composables
import { registerDesignSystem } from './composables/useShowcase'

registerDesignSystem({
  name: 'Helix',
  slug: 'helix',
  prefix: 'Hx',
  description: 'Documentation design system — batteries-included components for building docs sites.',
  package: '@paper/helix',
  tokens: helixTheme,
  analyzer: {
    package: '@paper/helix',
  },
  components: [
    // actions
    {
      name: 'HxButton',
      description: 'Themed button with variant, size, and icon support',
      category: 'actions',
      props: [
        { name: 'variant', type: 'enum', default: 'primary', options: ['primary', 'secondary', 'ghost'] },
        { name: 'size', type: 'enum', default: 'md', options: ['sm', 'md', 'lg'] },
        { name: 'disabled', type: 'boolean', default: 'false' },
      ],
    },
    {
      name: 'HxIconButton',
      description: 'Icon-only action button',
      category: 'actions',
    },
    {
      name: 'HxCloseButton',
      description: 'Dismiss/close action button',
      category: 'actions',
    },
    {
      name: 'HxBackToTop',
      description: 'Scroll-to-top floating button',
      category: 'actions',
    },

    // forms
    {
      name: 'HxInput',
      description: 'Text input field with label and validation',
      category: 'forms',
      props: [
        { name: 'modelValue', type: 'string', default: '' },
        { name: 'placeholder', type: 'string' },
        { name: 'disabled', type: 'boolean', default: 'false' },
      ],
    },
    {
      name: 'HxSwitch',
      description: 'Toggle switch for boolean settings',
      category: 'forms',
      props: [
        { name: 'modelValue', type: 'boolean', default: 'false' },
        { name: 'disabled', type: 'boolean', default: 'false' },
      ],
    },
    {
      name: 'HxSearch',
      description: 'Full-screen search dialog with keyboard support',
      category: 'forms',
      subComponents: ['HxSearchInput', 'HxSearchResult', 'HxSearchEmpty', 'HxSearchFooter'],
    },

    // feedback
    {
      name: 'HxAlert',
      description: 'Dismissible notification banner',
      category: 'feedback',
      subComponents: ['HxAlertTitle', 'HxAlertContent', 'HxAlertDismiss'],
      props: [
        { name: 'variant', type: 'enum', default: 'info', options: ['info', 'success', 'warning', 'error'] },
        { name: 'dismissible', type: 'boolean', default: 'false' },
      ],
    },
    {
      name: 'HxCallout',
      description: 'Inline highlighted content callout',
      category: 'feedback',
      subComponents: ['HxCalloutHeader'],
      props: [
        { name: 'type', type: 'enum', default: 'note', options: ['note', 'tip', 'warning', 'danger'] },
      ],
    },
    {
      name: 'HxProgressBar',
      description: 'Linear progress indicator',
      category: 'feedback',
      subComponents: ['HxProgressBarLabel'],
      props: [
        { name: 'value', type: 'number', default: '0' },
        { name: 'max', type: 'number', default: '100' },
      ],
    },
    {
      name: 'HxLoaderIcon',
      description: 'Animated loading spinner icon',
      category: 'feedback',
    },
    {
      name: 'HxSkeleton',
      description: 'Content placeholder skeleton loader',
      category: 'feedback',
    },

    // layout
    {
      name: 'HxAppBar',
      description: 'Top application navigation bar',
      category: 'layout',
      subComponents: ['HxAppBarStart', 'HxAppBarEnd'],
    },
    {
      name: 'HxAppNav',
      description: 'Side navigation panel',
      category: 'layout',
    },
    {
      name: 'HxAppMain',
      description: 'Main content area wrapper',
      category: 'layout',
    },
    {
      name: 'HxAppBanner',
      description: 'Full-width announcement banner',
      category: 'layout',
    },
    {
      name: 'HxAppFooter',
      description: 'Page footer container',
      category: 'layout',
    },
    {
      name: 'HxDocLayout',
      description: 'Full documentation page layout shell',
      category: 'layout',
    },
    {
      name: 'HxDivider',
      description: 'Horizontal or vertical separator line',
      category: 'layout',
    },

    // content
    {
      name: 'HxCard',
      description: 'Content card container with optional header and actions',
      category: 'content',
      props: [
        { name: 'variant', type: 'enum', default: 'elevated', options: ['elevated', 'outlined', 'flat'] },
      ],
    },
    {
      name: 'HxBadge',
      description: 'Status or category badge label',
      category: 'content',
      props: [
        { name: 'variant', type: 'enum', default: 'default', options: ['default', 'primary', 'success', 'warning', 'error'] },
      ],
    },
    {
      name: 'HxChip',
      description: 'Compact tag or filter chip',
      category: 'content',
    },
    {
      name: 'HxKbd',
      description: 'Keyboard shortcut key display',
      category: 'content',
    },
    {
      name: 'HxLink',
      description: 'Styled anchor with router-link support',
      category: 'content',
    },
    {
      name: 'HxIcon',
      description: 'SVG icon renderer',
      category: 'content',
    },
    {
      name: 'HxBreadcrumbs',
      description: 'Hierarchical navigation breadcrumb trail',
      category: 'content',
    },
    {
      name: 'HxHeaderAnchor',
      description: 'Heading with copyable anchor link',
      category: 'content',
    },

    // interactive
    {
      name: 'HxDropdown',
      description: 'Floating dropdown menu',
      category: 'interactive',
      subComponents: ['HxDropdownTrigger', 'HxDropdownContent'],
    },
    {
      name: 'HxTooltip',
      description: 'Hover or focus tooltip popover',
      category: 'interactive',
      props: [
        { name: 'text', type: 'string' },
        { name: 'placement', type: 'enum', default: 'top', options: ['top', 'bottom', 'left', 'right'] },
      ],
    },
    {
      name: 'HxTabs',
      description: 'Tabbed content switcher',
      category: 'interactive',
      subComponents: ['HxTabPanel'],
    },
    {
      name: 'HxAccordion',
      description: 'Collapsible disclosure sections',
      category: 'interactive',
      subComponents: ['HxAccordionItem'],
    },

    // code
    {
      name: 'HxCodeBlock',
      description: 'Syntax-highlighted code block with copy action',
      category: 'code',
      subComponents: ['HxCodeBlockHeader', 'HxCodeBlockActions'],
    },
    {
      name: 'HxCodeGroup',
      description: 'Tabbed multi-file code block group',
      category: 'code',
    },
    {
      name: 'HxExampleCode',
      description: 'Live example with embedded source code',
      category: 'code',
    },
    {
      name: 'HxCopyCommand',
      description: 'Copyable CLI command display',
      category: 'code',
      subComponents: ['HxCopyCommandAction', 'HxCopyCommandText'],
    },
    {
      name: 'HxPackageManagerTabs',
      description: 'Tabbed npm/pnpm/yarn install commands',
      category: 'code',
    },

    // navigation
    {
      name: 'HxNavGroup',
      description: 'Collapsible sidebar navigation group',
      category: 'navigation',
    },
    {
      name: 'HxNavLink',
      description: 'Sidebar navigation link with active state',
      category: 'navigation',
    },
    {
      name: 'HxPageNavigator',
      description: 'Previous/next page navigation links',
      category: 'navigation',
    },
    {
      name: 'HxToc',
      description: 'Sticky table of contents sidebar',
      category: 'navigation',
    },

    // display
    {
      name: 'HxExample',
      description: 'Interactive component demo with preview and code',
      category: 'display',
      subComponents: ['HxExampleTitle'],
    },
    {
      name: 'HxApiCard',
      description: 'API reference card for a single prop, slot, or event',
      category: 'display',
      subComponents: ['HxApiCardBadge', 'HxApiCardDefault', 'HxApiCardDescription', 'HxApiCardName', 'HxApiCardType'],
    },
    {
      name: 'HxApiTable',
      description: 'Full props/events/slots API reference table',
      category: 'display',
    },
    {
      name: 'HxFaq',
      description: 'Frequently asked questions accordion list',
      category: 'display',
      subComponents: ['HxFaqItem'],
    },
    {
      name: 'HxMermaid',
      description: 'Mermaid diagram renderer',
      category: 'display',
      subComponents: ['HxMermaidCaption', 'HxMermaidSource'],
    },

    // settings
    {
      name: 'HxSettings',
      description: 'Settings panel with grouped toggles',
      category: 'settings',
      subComponents: ['HxSettingsSection', 'HxSettingsSectionTitle', 'HxSettingsToggle', 'HxSettingsToggleDescription', 'HxSettingsToggleLabel'],
    },
    {
      name: 'HxThemeToggle',
      description: 'Light/dark theme switcher button',
      category: 'settings',
    },
  ],
  composables: [
    { name: 'useAnchorLinks', description: 'Manage scroll-to-anchor navigation', category: 'navigation' },
    { name: 'useClipboard', description: 'Copy text to clipboard with success feedback', category: 'clipboard' },
    { name: 'useCodeHighlighter', description: 'Syntax highlighting via Shiki', category: 'code' },
    { name: 'useCountUp', description: 'Animated number counting', category: 'animation' },
    { name: 'useIdleCallback', description: 'requestIdleCallback wrapper', category: 'performance' },
    { name: 'usePopoverPosition', description: 'Positioning logic for tooltips and dropdowns', category: 'layout' },
    { name: 'useReveal', description: 'Scroll-triggered reveal animations', category: 'animation' },
    { name: 'useRouterLinks', description: 'Transform router links in content', category: 'navigation' },
    { name: 'useScrollLock', description: 'Prevent body scroll', category: 'scroll' },
    { name: 'useScrollPersist', description: 'Save and restore scroll position per route', category: 'scroll' },
    { name: 'useScrollSpy', description: 'Track active heading during scroll', category: 'scroll' },
    { name: 'useSearch', description: 'Client-side search with Ctrl+K hotkey', category: 'search' },
    { name: 'useSettings', description: 'Context-based settings with storage', category: 'settings' },
    { name: 'useThemeToggle', description: 'Light and dark theme control', category: 'theme' },
    { name: 'useToc', description: 'Table of contents extraction from DOM', category: 'navigation' },
  ],
})
