// Types
import type { FeatureContext } from '../index'

export interface FeatureAdapter {
  init: (context: FeatureContext<any>) => Promise<void> | void
}
