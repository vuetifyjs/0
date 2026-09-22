/**
 * Vue API names for build-time detection.
 *
 * This list is the lightweight, statically-importable counterpart to
 * vue-api-content.ts. The shiki transformer (which runs client-side on every
 * docs page via useMarkdown/useHighlightCode) only needs the *names* to mark
 * potential API references; it must not pull in the full descriptions. Those
 * live in vue-api-content.ts, which is dynamically imported (hover-time only)
 * by DocsApiHover.vue.
 *
 * vue-api-content.ts types its record as `Record<VueApiName, VueApiEntry>`, so
 * TypeScript enforces that this list and the content stay in exact sync — a
 * missing or extra name fails the build rather than drifting silently.
 *
 * NOTE: Imported client-side, so no Node.js APIs allowed.
 */

export const VUE_API_NAMES = [
  'ref', 'computed', 'reactive', 'readonly', 'watch', 'watchEffect',
  'watchPostEffect', 'watchSyncEffect', 'isRef', 'unref', 'toRef', 'toValue',
  'toRefs', 'isProxy', 'isReactive', 'isReadonly', 'shallowRef', 'triggerRef',
  'customRef', 'shallowReactive', 'shallowReadonly', 'toRaw', 'markRaw', 'effectScope',
  'getCurrentScope', 'onScopeDispose', 'onMounted', 'onUpdated', 'onUnmounted', 'onBeforeMount',
  'onBeforeUpdate', 'onBeforeUnmount', 'onErrorCaptured', 'onRenderTracked', 'onRenderTriggered', 'onActivated',
  'onDeactivated', 'onServerPrefetch', 'provide', 'inject', 'hasInjectionContext', 'defineProps',
  'defineEmits', 'defineExpose', 'defineOptions', 'defineSlots', 'defineModel', 'withDefaults',
  'useSlots', 'useAttrs', 'useTemplateRef', 'useId', 'useCssModule', 'h',
  'mergeProps', 'cloneVNode', 'isVNode', 'resolveComponent', 'resolveDirective', 'withDirectives',
  'withModifiers', 'defineCustomElement', 'useHost', 'useShadowRoot', 'defineComponent', 'defineAsyncComponent',
  'nextTick', 'createApp', 'Ref', 'ShallowRef', 'ComputedRef', 'MaybeRef',
  'MaybeRefOrGetter', 'InjectionKey',
] as const

export type VueApiName = typeof VUE_API_NAMES[number]
