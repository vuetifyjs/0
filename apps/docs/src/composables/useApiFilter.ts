// Framework
import { createFilterContext } from '@vuetify/v0'

// Types
import type { ApiEvent, ApiFunction, ApiMethod, ApiOption, ApiProp, ApiProperty, ApiSlot } from '@build/generate-api'

export type ApiItem = ApiOption | ApiProperty | ApiMethod | ApiProp | ApiEvent | ApiSlot | ApiFunction

export const [useApiFilter, provideApiFilter, apiFilter] = createFilterContext<ApiItem>({
  namespace: 'docs:api-filter',
  mode: 'some',
  keys: ['name', 'description'],
})
