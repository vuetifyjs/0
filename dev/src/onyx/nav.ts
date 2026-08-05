export interface DocsPage {
  icon: string
  slug: string
  title: string
}

export interface DocsGroup {
  heading: string
  pages: DocsPage[]
}

export const groups: DocsGroup[] = [
  {
    heading: 'Overview',
    pages: [
      { icon: 'introduction', slug: 'introduction', title: 'Introduction' },
      { icon: 'accessibility', slug: 'accessibility', title: 'Accessibility' },
      { icon: 'release-notes', slug: 'release-notes', title: 'Release Notes' },
    ],
  },
  {
    heading: 'Elements',
    pages: [
      { icon: 'typography', slug: 'typography', title: 'Typography' },
      { icon: 'color', slug: 'color', title: 'Color' },
      { icon: 'depth', slug: 'depth', title: 'Depth' },
      { icon: 'icons', slug: 'icons', title: 'Icons' },
      { icon: 'form-elements', slug: 'form-elements', title: 'Form Elements' },
      { icon: 'buttons', slug: 'buttons', title: 'Buttons' },
      { icon: 'cards', slug: 'cards', title: 'Cards' },
      { icon: 'tabs', slug: 'tabs', title: 'Tabs' },
      { icon: 'dialogs-and-banners', slug: 'dialogs-and-banners', title: 'Dialogs and Banners' },
      { icon: 'chips', slug: 'chips', title: 'Chips' },
      { icon: 'toast', slug: 'toast', title: 'Toast' },
      { icon: 'lists', slug: 'lists', title: 'Lists' },
      { icon: 'progress', slug: 'progress', title: 'Progress' },
      { icon: 'tables', slug: 'tables', title: 'Tables' },
      { icon: 'breadcrumbs', slug: 'breadcrumbs', title: 'Breadcrumbs' },
    ],
  },
]

export const pages = groups.flatMap(group => group.pages)
