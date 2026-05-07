// Framework
import { createFilterContext } from '@vuetify/v0'

export interface ApiItem {
  [key: string]: unknown
  name: string
  description?: string
}

export const [useApiFilter, provideApiFilter, apiFilter] = createFilterContext<ApiItem>({
  namespace: 'docs:api-filter',
  mode: 'some',
  keys: ['name', 'description'],
})
