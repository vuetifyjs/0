/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="vite-plugin-vue-layouts-next/client" />

declare module '*.md' {
  // Types
  import type { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}

declare module 'virtual:api' {
  // Types
  import type { ApiData } from '@build/generate-api'
  const data: ApiData
  export default data
}

declare module 'virtual:nav' {
  // Types
  import type { NavItem } from '@build/generate-nav'
  const data: NavItem[]
  export default data
}

declare module 'virtual:page-dates' {
  // Types
  import type { PageDates } from '@build/generate-page-dates'
  const data: PageDates
  export default data
}

declare module 'virtual:llms-stats' {
  // Types
  import type { LlmsStats } from '@build/generate-llms-full'
  const data: LlmsStats
  export default data
}
