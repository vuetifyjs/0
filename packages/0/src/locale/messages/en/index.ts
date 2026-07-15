/**
 * @module locale/messages/en
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-locale
 *
 * @remarks
 * Built-in English aria strings for @vuetify/v0 components. These are the
 * same keys that components pass to `locale.t()`. Importing this module and
 * passing it to `createLocalePlugin` satisfies WCAG 4.1.2 Name, Role, Value
 * without writing custom translations.
 *
 * @example
 * ```ts
 * import en from '@vuetify/v0/locale/messages/en'
 * import { createLocalePlugin } from '@vuetify/v0/locale'
 *
 * app.use(createLocalePlugin({ messages: { en }, default: 'en' }))
 * ```
 */

export default {
  AlertDialog: {
    close: 'Close',
  },
  Avatar: {
    indicatorLabel: '+{count} more',
  },
  Breadcrumbs: {
    label: 'Breadcrumbs',
  },
  Button: {
    label: 'Button',
  },
  Carousel: {
    indicator: 'Go to slide {current} of {size}',
    indicators: 'Carousel indicators',
    label: 'Carousel',
    liveRegion: 'Slide {current} of {size}',
    next: 'Next slide',
    prev: 'Previous slide',
    progress: '{percent}% complete',
    progressLabel: 'Carousel progress',
    slide: 'Slide {current} of {size}',
  },
  Combobox: {
    noResults: 'No results',
  },
  Dialog: {
    close: 'Close',
  },
  NumberField: {
    decrement: 'Decrement',
    increment: 'Increment',
  },
  Pagination: {
    currentPage: 'Page {page}, current',
    first: 'First page',
    goToPage: 'Go to page {page}',
    label: 'Pagination',
    last: 'Last page',
    next: 'Next page',
    prev: 'Previous page',
    status: 'Page {page} of {pages}',
  },
  Rating: {
    valueText: '{value} of {size} stars',
  },
  Snackbar: {
    close: 'Dismiss',
  },
  Splitter: {
    handle: 'Resize panels',
  },
} as const
