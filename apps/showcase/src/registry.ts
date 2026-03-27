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
  components: [
    { name: 'CxButton', category: 'actions', description: 'Primary action button' },
    { name: 'CxInput', category: 'forms', description: 'Text input field' },
    { name: 'CxAlert', category: 'feedback', description: 'Dismissible notification', subComponents: ['CxAlertTitle', 'CxAlertContent', 'CxAlertDismiss'] },
    { name: 'CxCallout', category: 'feedback', description: 'Inline content callout', subComponents: ['CxCalloutHeader'] },
    { name: 'CxCard', category: 'layout', description: 'Content card container' },
    { name: 'CxCodeBlock', category: 'content', description: 'Syntax highlighted code', subComponents: ['CxCodeBlockHeader', 'CxCodeBlockActions'] },
    { name: 'CxSearch', category: 'interactive', description: 'Search dialog', subComponents: ['CxSearchInput', 'CxSearchResult', 'CxSearchEmpty', 'CxSearchFooter'] },
    { name: 'CxTabs', category: 'navigation', description: 'Tabbed content', subComponents: ['CxTabPanel'] },
    { name: 'CxAccordion', category: 'disclosure', description: 'Collapsible sections', subComponents: ['CxAccordionItem'] },
    { name: 'CxDropdown', category: 'interactive', description: 'Dropdown menu', subComponents: ['CxDropdownTrigger', 'CxDropdownContent'] },
    { name: 'CxBadge', category: 'display', description: 'Status badge' },
    { name: 'CxTooltip', category: 'interactive', description: 'Hover tooltip' },
  ],
})
