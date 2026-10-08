// Framework
import { clamp } from '@vuetify/v0'

/**
 * Position within the guided wizard flow: select (step 1) -> configure (one step per
 * selected plugin) -> components (the last tracked step). Review is a terminal action
 * page, not a guided step, so it carries no progress of its own.
 */
export function wizardProgress (pluginCount: number, position: number): { percent: number, label: string } {
  const total = pluginCount + 2
  const step = clamp(position, 1, total)

  return {
    percent: (step / total) * 100,
    label: `Step ${step} of ${total}`,
  }
}
