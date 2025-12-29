// Utilities
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Types
import type { RouteParams } from 'vue-router'

// https://github.com/vuejs/router/issues/1160#issuecomment-1055276586
export function useParams<P extends RouteParams> () {
  const route = useRoute()

  return computed(
    () => route.params as P,
  )
}
