export type { QuExpansionPanelContext, QuExpansionPanelProps } from './QuExpansionPanel.vue'
export { default as QuExpansionPanelActions } from './QuExpansionPanelActions.vue'
export type { QuExpansionPanelContentProps } from './QuExpansionPanelContent.vue'
export { default as QuExpansionPanelContent } from './QuExpansionPanelContent.vue'
export type { QuExpansionPanelHeaderProps } from './QuExpansionPanelHeader.vue'
export { default as QuExpansionPanelHeader } from './QuExpansionPanelHeader.vue'
export type { QuExpansionPanelItemProps } from './QuExpansionPanelItem.vue'
export { default as QuExpansionPanelItem } from './QuExpansionPanelItem.vue'

// Context
import Root from './QuExpansionPanel.vue'
import Actions from './QuExpansionPanelActions.vue'
import Content from './QuExpansionPanelContent.vue'
import Header from './QuExpansionPanelHeader.vue'
import Item from './QuExpansionPanelItem.vue'

/**
 * The Material Design 1 expansion panel: 48 dp rows stacked on one card, each
 * opening into a 64 dp header and an editing body that detaches 16 dp from
 * its neighbours and lifts to 8 dp. Composes v0 `ExpansionPanel.Group`,
 * `Root`, `Header`, `Activator`, `Cue` and `Content`; single-open by default,
 * `multiple` otherwise.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuExpansionPanelHeader`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuExpansionPanel v-model="panel">
 *   <QuExpansionPanel.Item value="trip">
 *     <QuExpansionPanel.Header label="Trip name" summary="Caribbean cruise" />
 *
 *     <QuExpansionPanel.Content>
 *       Where are you going?
 *
 *       <QuExpansionPanel.Actions>
 *         <QuButton>Cancel</QuButton>
 *         <QuButton>Save</QuButton>
 *       </QuExpansionPanel.Actions>
 *     </QuExpansionPanel.Content>
 *   </QuExpansionPanel.Item>
 * </QuExpansionPanel>
 * ```
 */
export const QuExpansionPanel = Object.assign(Root, {
  /** One panel: registers its `value` with the root and hosts a header and a content region. */
  Item,
  /** The 48 dp row (64 dp expanded): label, secondary line, value column and the expand icon, inside an `h3`. */
  Header,
  /** The region the header expands: the editing body. */
  Content,
  /** The CANCEL / SAVE row below a divider, placed last inside `Content`; the buttons are yours. */
  Actions,
})
