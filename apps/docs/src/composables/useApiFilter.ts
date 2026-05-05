// Framework
import { createFilterContext } from '@vuetify/v0'

export interface ApiItem {
  name: string
  description?: string
  [key: string]: unknown
}

export const [useApiFilter, provideApiFilter, apiFilter] = createFilterContext<ApiItem>({
  namespace: 'docs:api-filter',
  mode: 'some',
  keys: ['name', 'description'],
})
