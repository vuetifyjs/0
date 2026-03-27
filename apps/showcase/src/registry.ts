import { codexTheme } from '@paper/codex'

// Composables
import { registerDesignSystem } from './composables/useShowcase'

registerDesignSystem({
  name: 'Codex',
  slug: 'codex',
  prefix: 'Cx',
  description: 'Documentation design system — batteries-included components for building docs sites.',
  package: '@paper/codex',
  tokens: codexTheme,
  analyzer: {
    package: '@paper/codex',
  },
  components: [
    // actions
    {
      name: 'CxButton',
      description: 'Themed button with variant, size, and icon support',
      category: 'actions',
      props: [
        { name: 'variant', type: 'enum', default: 'primary', options: ['primary', 'secondary', 'ghost'] },
        { name: 'size', type: 'enum', default: 'md', options: ['sm', 'md', 'lg'] },
        { name: 'disabled', type: 'boolean', default: 'false' },
      ],
    },
    {
      name: 'CxIconButton',
      description: 'Icon-only action button',
      category: 'actions',
    },
    {
      name: 'CxCloseButton',
      description: 'Dismiss/close action button',
      category: 'actions',
    },
    {
      name: 'CxBackToTop',
      description: 'Scroll-to-top floating button',
      category: 'actions',
    },

    // forms
    {
      name: 'CxInput',
      description: 'Text input field with label and validation',
      category: 'forms',
      props: [
        { name: 'modelValue', type: 'string', default: '' },
        { name: 'placeholder', type: 'string' },
        { name: 'disabled', type: 'boolean', default: 'false' },
      ],
    },
    {
      name: 'CxSwitch',
      description: 'Toggle switch for boolean settings',
      category: 'forms',
      props: [
        { name: 'modelValue', type: 'boolean', default: 'false' },
        { name: 'disabled', type: 'boolean', default: 'false' },
      ],
    },
    {
      name: 'CxSearch',
      description: 'Full-screen search dialog with keyboard support',
      category: 'forms',
      subComponents: ['CxSearchInput', 'CxSearchResult', 'CxSearchEmpty', 'CxSearchFooter'],
    },

    // feedback
    {
      name: 'CxAlert',
      description: 'Dismissible notification banner',
      category: 'feedback',
      subComponents: ['CxAlertTitle', 'CxAlertContent', 'CxAlertDismiss'],
      props: [
        { name: 'variant', type: 'enum', default: 'info', options: ['info', 'success', 'warning', 'error'] },
        { name: 'dismissible', type: 'boolean', default: 'false' },
      ],
    },
    {
      name: 'CxCallout',
      description: 'Inline highlighted content callout',
      category: 'feedback',
      subComponents: ['CxCalloutHeader'],
      props: [
        { name: 'type', type: 'enum', default: 'note', options: ['note', 'tip', 'warning', 'danger'] },
      ],
    },
    {
      name: 'CxProgressBar',
      description: 'Linear progress indicator',
      category: 'feedback',
      subComponents: ['CxProgressBarLabel'],
      props: [
        { name: 'value', type: 'number', default: '0' },
        { name: 'max', type: 'number', default: '100' },
      ],
    },
    {
      name: 'CxLoaderIcon',
      description: 'Animated loading spinner icon',
      category: 'feedback',
    },
    {
      name: 'CxSkeleton',
      description: 'Content placeholder skeleton loader',
      category: 'feedback',
    },

    // layout
    {
      name: 'CxAppBar',
      description: 'Top application navigation bar',
      category: 'layout',
      subComponents: ['CxAppBarStart', 'CxAppBarEnd'],
    },
    {
      name: 'CxAppNav',
      description: 'Side navigation panel',
      category: 'layout',
    },
    {
      name: 'CxAppMain',
      description: 'Main content area wrapper',
      category: 'layout',
    },
    {
      name: 'CxAppBanner',
      description: 'Full-width announcement banner',
      category: 'layout',
    },
    {
      name: 'CxAppFooter',
      description: 'Page footer container',
      category: 'layout',
    },
    {
      name: 'CxDocLayout',
      description: 'Full documentation page layout shell',
      category: 'layout',
    },
    {
      name: 'CxDivider',
      description: 'Horizontal or vertical separator line',
      category: 'layout',
    },

    // content
    {
      name: 'CxCard',
      description: 'Content card container with optional header and actions',
      category: 'content',
      props: [
        { name: 'variant', type: 'enum', default: 'elevated', options: ['elevated', 'outlined', 'flat'] },
      ],
    },
    {
      name: 'CxBadge',
      description: 'Status or category badge label',
      category: 'content',
      props: [
        { name: 'variant', type: 'enum', default: 'default', options: ['default', 'primary', 'success', 'warning', 'error'] },
      ],
    },
    {
      name: 'CxChip',
      description: 'Compact tag or filter chip',
      category: 'content',
    },
    {
      name: 'CxKbd',
      description: 'Keyboard shortcut key display',
      category: 'content',
    },
    {
      name: 'CxLink',
      description: 'Styled anchor with router-link support',
      category: 'content',
    },
    {
      name: 'CxIcon',
      description: 'SVG icon renderer',
      category: 'content',
    },
    {
      name: 'CxBreadcrumbs',
      description: 'Hierarchical navigation breadcrumb trail',
      category: 'content',
    },
    {
      name: 'CxHeaderAnchor',
      description: 'Heading with copyable anchor link',
      category: 'content',
    },

    // interactive
    {
      name: 'CxDropdown',
      description: 'Floating dropdown menu',
      category: 'interactive',
      subComponents: ['CxDropdownTrigger', 'CxDropdownContent'],
    },
    {
      name: 'CxTooltip',
      description: 'Hover or focus tooltip popover',
      category: 'interactive',
      props: [
        { name: 'text', type: 'string' },
        { name: 'placement', type: 'enum', default: 'top', options: ['top', 'bottom', 'left', 'right'] },
      ],
    },
    {
      name: 'CxTabs',
      description: 'Tabbed content switcher',
      category: 'interactive',
      subComponents: ['CxTabPanel'],
    },
    {
      name: 'CxAccordion',
      description: 'Collapsible disclosure sections',
      category: 'interactive',
      subComponents: ['CxAccordionItem'],
    },

    // code
    {
      name: 'CxCodeBlock',
      description: 'Syntax-highlighted code block with copy action',
      category: 'code',
      subComponents: ['CxCodeBlockHeader', 'CxCodeBlockActions'],
    },
    {
      name: 'CxCodeGroup',
      description: 'Tabbed multi-file code block group',
      category: 'code',
    },
    {
      name: 'CxExampleCode',
      description: 'Live example with embedded source code',
      category: 'code',
    },
    {
      name: 'CxCopyCommand',
      description: 'Copyable CLI command display',
      category: 'code',
      subComponents: ['CxCopyCommandAction', 'CxCopyCommandText'],
    },
    {
      name: 'CxPackageManagerTabs',
      description: 'Tabbed npm/pnpm/yarn install commands',
      category: 'code',
    },

    // navigation
    {
      name: 'CxNavGroup',
      description: 'Collapsible sidebar navigation group',
      category: 'navigation',
    },
    {
      name: 'CxNavLink',
      description: 'Sidebar navigation link with active state',
      category: 'navigation',
    },
    {
      name: 'CxPageNavigator',
      description: 'Previous/next page navigation links',
      category: 'navigation',
    },
    {
      name: 'CxToc',
      description: 'Sticky table of contents sidebar',
      category: 'navigation',
    },

    // display
    {
      name: 'CxExample',
      description: 'Interactive component demo with preview and code',
      category: 'display',
      subComponents: ['CxExampleTitle'],
    },
    {
      name: 'CxApiCard',
      description: 'API reference card for a single prop, slot, or event',
      category: 'display',
      subComponents: ['CxApiCardBadge', 'CxApiCardDefault', 'CxApiCardDescription', 'CxApiCardName', 'CxApiCardType'],
    },
    {
      name: 'CxApiTable',
      description: 'Full props/events/slots API reference table',
      category: 'display',
    },
    {
      name: 'CxFaq',
      description: 'Frequently asked questions accordion list',
      category: 'display',
      subComponents: ['CxFaqItem'],
    },
    {
      name: 'CxMermaid',
      description: 'Mermaid diagram renderer',
      category: 'display',
      subComponents: ['CxMermaidCaption', 'CxMermaidSource'],
    },

    // settings
    {
      name: 'CxSettings',
      description: 'Settings panel with grouped toggles',
      category: 'settings',
      subComponents: ['CxSettingsSection', 'CxSettingsSectionTitle', 'CxSettingsToggle', 'CxSettingsToggleDescription', 'CxSettingsToggleLabel'],
    },
    {
      name: 'CxThemeToggle',
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
