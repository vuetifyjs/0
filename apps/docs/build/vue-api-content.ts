/**
 * Vue API content for hover popovers.
 *
 * Provides curated descriptions for Vue internals so users can
 * understand what they are and when to use them without leaving the docs.
 *
 * NOTE: This module is imported client-side, so no Node.js APIs allowed.
 */

export interface VueApiEntry {
  name: string
  category: 'Reactivity' | 'Lifecycle' | 'Injection' | 'Setup' | 'Render' | 'General' | 'Types'
  summary: string
  usage: string
  signature: string
  href: string
}

export const VUE_API_CONTENT: Record<string, VueApiEntry> = {
  // ===========================================================================
  // Reactivity: Core
  // ===========================================================================
  ref: {
    name: 'ref',
    category: 'Reactivity',
    summary: 'Creates a reactive reference that triggers updates when `.value` changes.',
    usage: 'Use for primitives (strings, numbers, booleans) or when you want explicit `.value` access for objects.',
    signature: 'function ref<T>(value: T): Ref<T>',
    href: 'https://vuejs.org/api/reactivity-core.html#ref',
  },
  computed: {
    name: 'computed',
    category: 'Reactivity',
    summary: 'Creates a cached reactive value that auto-updates when dependencies change.',
    usage: 'Use for derived state that depends on other reactive values. Avoids redundant calculations.',
    signature: 'function computed<T>(getter: () => T): ComputedRef<T>',
    href: 'https://vuejs.org/api/reactivity-core.html#computed',
  },
  reactive: {
    name: 'reactive',
    category: 'Reactivity',
    summary: 'Creates a deeply reactive proxy of an object.',
    usage: 'Use for complex objects when you want automatic deep reactivity without `.value` access.',
    signature: 'function reactive<T extends object>(target: T): T',
    href: 'https://vuejs.org/api/reactivity-core.html#reactive',
  },
  readonly: {
    name: 'readonly',
    category: 'Reactivity',
    summary: 'Creates a readonly proxy of a reactive or plain object.',
    usage: 'Use when exposing state that consumers should not modify directly.',
    signature: 'function readonly<T extends object>(target: T): Readonly<T>',
    href: 'https://vuejs.org/api/reactivity-core.html#readonly',
  },
  watch: {
    name: 'watch',
    category: 'Reactivity',
    summary: 'Watches reactive sources and runs a callback when they change.',
    usage: 'Use for side effects (API calls, logging) that should run when specific values change.',
    signature: 'function watch<T>(source: WatchSource<T>, cb: WatchCallback<T>): WatchStopHandle',
    href: 'https://vuejs.org/api/reactivity-core.html#watch',
  },
  watchEffect: {
    name: 'watchEffect',
    category: 'Reactivity',
    summary: 'Runs a function immediately and re-runs when its reactive dependencies change.',
    usage: 'Use when you want automatic dependency tracking without specifying sources explicitly.',
    signature: 'function watchEffect(effect: () => void): WatchStopHandle',
    href: 'https://vuejs.org/api/reactivity-core.html#watcheffect',
  },
  watchPostEffect: {
    name: 'watchPostEffect',
    category: 'Reactivity',
    summary: 'Alias for watchEffect with `flush: "post"` - runs after DOM updates.',
    usage: 'Use when your effect needs to access updated DOM elements.',
    signature: 'function watchPostEffect(effect: () => void): WatchStopHandle',
    href: 'https://vuejs.org/api/reactivity-core.html#watchposteffect',
  },
  watchSyncEffect: {
    name: 'watchSyncEffect',
    category: 'Reactivity',
    summary: 'Alias for watchEffect with `flush: "sync"` - runs synchronously.',
    usage: 'Use rarely, only when you need synchronous updates before any DOM changes.',
    signature: 'function watchSyncEffect(effect: () => void): WatchStopHandle',
    href: 'https://vuejs.org/api/reactivity-core.html#watchsynceffect',
  },

  // ===========================================================================
  // Reactivity: Utilities
  // ===========================================================================
  isRef: {
    name: 'isRef',
    category: 'Reactivity',
    summary: 'Checks if a value is a ref object.',
    usage: 'Use to determine if you need `.value` access or to handle both ref and non-ref inputs.',
    signature: 'function isRef<T>(r: Ref<T> | unknown): r is Ref<T>',
    href: 'https://vuejs.org/api/reactivity-utilities.html#isref',
  },
  unref: {
    name: 'unref',
    category: 'Reactivity',
    summary: 'Unwraps a ref, returning the inner value. Returns non-refs as-is.',
    usage: 'Use to get the raw value regardless of whether input is a ref or plain value.',
    signature: 'function unref<T>(ref: T | Ref<T>): T',
    href: 'https://vuejs.org/api/reactivity-utilities.html#unref',
  },
  toRef: {
    name: 'toRef',
    category: 'Reactivity',
    summary: 'Creates a ref that syncs with a property of a reactive object.',
    usage: 'Use to pass reactive properties as refs while maintaining reactivity connection.',
    signature: 'function toRef<T, K extends keyof T>(obj: T, key: K): Ref<T[K]>',
    href: 'https://vuejs.org/api/reactivity-utilities.html#toref',
  },
  toValue: {
    name: 'toValue',
    category: 'Reactivity',
    summary: 'Normalizes values, refs, and getters to their plain values.',
    usage: 'Use in composables to accept flexible inputs (value, ref, or getter function).',
    signature: 'function toValue<T>(source: MaybeRefOrGetter<T>): T',
    href: 'https://vuejs.org/api/reactivity-utilities.html#tovalue',
  },
  toRefs: {
    name: 'toRefs',
    category: 'Reactivity',
    summary: 'Converts a reactive object to plain object where each property is a ref.',
    usage: 'Use when destructuring reactive objects to maintain reactivity on individual properties.',
    signature: 'function toRefs<T extends object>(obj: T): ToRefs<T>',
    href: 'https://vuejs.org/api/reactivity-utilities.html#torefs',
  },
  isProxy: {
    name: 'isProxy',
    category: 'Reactivity',
    summary: 'Checks if a value is a reactive or readonly proxy.',
    usage: 'Use to detect if an object has been wrapped by reactive() or readonly().',
    signature: 'function isProxy(value: unknown): boolean',
    href: 'https://vuejs.org/api/reactivity-utilities.html#isproxy',
  },
  isReactive: {
    name: 'isReactive',
    category: 'Reactivity',
    summary: 'Checks if a value is a reactive proxy created by reactive().',
    usage: 'Use to verify an object has deep reactivity enabled.',
    signature: 'function isReactive(value: unknown): boolean',
    href: 'https://vuejs.org/api/reactivity-utilities.html#isreactive',
  },
  isReadonly: {
    name: 'isReadonly',
    category: 'Reactivity',
    summary: 'Checks if a value is a readonly proxy created by readonly().',
    usage: 'Use to check if modifications to an object will be blocked.',
    signature: 'function isReadonly(value: unknown): boolean',
    href: 'https://vuejs.org/api/reactivity-utilities.html#isreadonly',
  },

  // ===========================================================================
  // Reactivity: Advanced
  // ===========================================================================
  shallowRef: {
    name: 'shallowRef',
    category: 'Reactivity',
    summary: 'Creates a ref that only tracks `.value` assignment, not deep changes.',
    usage: 'Use for large objects/arrays where you replace the whole value rather than mutate properties.',
    signature: 'function shallowRef<T>(value: T): ShallowRef<T>',
    href: 'https://vuejs.org/api/reactivity-advanced.html#shallowref',
  },
  triggerRef: {
    name: 'triggerRef',
    category: 'Reactivity',
    summary: 'Force triggers effects for a shallowRef after mutating its inner value.',
    usage: 'Use after directly mutating shallowRef contents to notify watchers.',
    signature: 'function triggerRef(ref: ShallowRef): void',
    href: 'https://vuejs.org/api/reactivity-advanced.html#triggerref',
  },
  customRef: {
    name: 'customRef',
    category: 'Reactivity',
    summary: 'Creates a customized ref with explicit control over tracking and triggering.',
    usage: 'Use for advanced patterns like debounced refs or refs with validation logic.',
    signature: 'function customRef<T>(factory: CustomRefFactory<T>): Ref<T>',
    href: 'https://vuejs.org/api/reactivity-advanced.html#customref',
  },
  shallowReactive: {
    name: 'shallowReactive',
    category: 'Reactivity',
    summary: 'Creates a reactive proxy that only tracks root-level properties.',
    usage: 'Use when nested objects should remain plain (not deeply reactive).',
    signature: 'function shallowReactive<T extends object>(target: T): T',
    href: 'https://vuejs.org/api/reactivity-advanced.html#shallowreactive',
  },
  shallowReadonly: {
    name: 'shallowReadonly',
    category: 'Reactivity',
    summary: 'Creates a readonly proxy that only makes root-level properties readonly.',
    usage: 'Use when you want to prevent root property changes but allow nested mutations.',
    signature: 'function shallowReadonly<T extends object>(target: T): Readonly<T>',
    href: 'https://vuejs.org/api/reactivity-advanced.html#shallowreadonly',
  },
  toRaw: {
    name: 'toRaw',
    category: 'Reactivity',
    summary: 'Returns the raw, non-proxied object from a reactive or readonly proxy.',
    usage: 'Use when passing data to external libraries that should not trigger reactivity.',
    signature: 'function toRaw<T>(proxy: T): T',
    href: 'https://vuejs.org/api/reactivity-advanced.html#toraw',
  },
  markRaw: {
    name: 'markRaw',
    category: 'Reactivity',
    summary: 'Marks an object so it will never be converted to a reactive proxy.',
    usage: 'Use for objects that should not be reactive (e.g., class instances, third-party objects).',
    signature: 'function markRaw<T extends object>(value: T): T',
    href: 'https://vuejs.org/api/reactivity-advanced.html#markraw',
  },
  effectScope: {
    name: 'effectScope',
    category: 'Reactivity',
    summary: 'Creates a scope that captures reactive effects for collective disposal.',
    usage: 'Use in composables to group watchers and computed refs for cleanup.',
    signature: 'function effectScope(detached?: boolean): EffectScope',
    href: 'https://vuejs.org/api/reactivity-advanced.html#effectscope',
  },
  getCurrentScope: {
    name: 'getCurrentScope',
    category: 'Reactivity',
    summary: 'Returns the current active effect scope, if any.',
    usage: 'Use to check if code is running within a component or effect scope.',
    signature: 'function getCurrentScope(): EffectScope | undefined',
    href: 'https://vuejs.org/api/reactivity-advanced.html#getcurrentscope',
  },
  onScopeDispose: {
    name: 'onScopeDispose',
    category: 'Reactivity',
    summary: 'Registers a callback to run when the current effect scope is disposed.',
    usage: 'Use for cleanup in composables (like onUnmounted but works outside components).',
    signature: 'function onScopeDispose(fn: () => void): void',
    href: 'https://vuejs.org/api/reactivity-advanced.html#onscopedispose',
  },

  // ===========================================================================
  // Lifecycle Hooks
  // ===========================================================================
  onMounted: {
    name: 'onMounted',
    category: 'Lifecycle',
    summary: 'Registers a callback to run after the component is mounted to the DOM.',
    usage: 'Use for DOM-dependent initialization, third-party library setup, or data fetching.',
    signature: 'function onMounted(callback: () => void): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#onmounted',
  },
  onUpdated: {
    name: 'onUpdated',
    category: 'Lifecycle',
    summary: 'Registers a callback to run after the component has updated its DOM.',
    usage: 'Use to access updated DOM after reactive state changes. Avoid state changes here.',
    signature: 'function onUpdated(callback: () => void): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#onupdated',
  },
  onUnmounted: {
    name: 'onUnmounted',
    category: 'Lifecycle',
    summary: 'Registers a callback to run after the component is unmounted.',
    usage: 'Use for cleanup: remove event listeners, cancel timers, disconnect observers.',
    signature: 'function onUnmounted(callback: () => void): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#onunmounted',
  },
  onBeforeMount: {
    name: 'onBeforeMount',
    category: 'Lifecycle',
    summary: 'Registers a callback to run before the component is mounted.',
    usage: 'Use for setup that must happen before DOM insertion. DOM is not yet available.',
    signature: 'function onBeforeMount(callback: () => void): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#onbeforemount',
  },
  onBeforeUpdate: {
    name: 'onBeforeUpdate',
    category: 'Lifecycle',
    summary: 'Registers a callback to run before the component updates its DOM.',
    usage: 'Use to access DOM state before Vue updates it. Can read current DOM values.',
    signature: 'function onBeforeUpdate(callback: () => void): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#onbeforeupdate',
  },
  onBeforeUnmount: {
    name: 'onBeforeUnmount',
    category: 'Lifecycle',
    summary: 'Registers a callback to run before the component is unmounted.',
    usage: 'Use for cleanup that needs DOM access. Component is still fully functional.',
    signature: 'function onBeforeUnmount(callback: () => void): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#onbeforeunmount',
  },
  onErrorCaptured: {
    name: 'onErrorCaptured',
    category: 'Lifecycle',
    summary: 'Registers a callback to run when an error is captured from a descendant.',
    usage: 'Use for error boundaries. Return false to prevent error propagation.',
    signature: 'function onErrorCaptured(callback: ErrorCapturedHook): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured',
  },
  onRenderTracked: {
    name: 'onRenderTracked',
    category: 'Lifecycle',
    summary: 'Registers a callback when a reactive dependency is tracked during render.',
    usage: 'Use for debugging to see which reactive values the component depends on.',
    signature: 'function onRenderTracked(callback: DebuggerHook): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#onrendertracked',
  },
  onRenderTriggered: {
    name: 'onRenderTriggered',
    category: 'Lifecycle',
    summary: 'Registers a callback when a reactive dependency triggers a re-render.',
    usage: 'Use for debugging to identify which changes cause component updates.',
    signature: 'function onRenderTriggered(callback: DebuggerHook): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#onrendertriggered',
  },
  onActivated: {
    name: 'onActivated',
    category: 'Lifecycle',
    summary: 'Registers a callback when a kept-alive component is activated.',
    usage: 'Use to refresh data or restart timers when component becomes visible again.',
    signature: 'function onActivated(callback: () => void): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#onactivated',
  },
  onDeactivated: {
    name: 'onDeactivated',
    category: 'Lifecycle',
    summary: 'Registers a callback when a kept-alive component is deactivated.',
    usage: 'Use to pause expensive operations when component is cached but not visible.',
    signature: 'function onDeactivated(callback: () => void): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#ondeactivated',
  },
  onServerPrefetch: {
    name: 'onServerPrefetch',
    category: 'Lifecycle',
    summary: 'Registers an async function to run during server-side rendering.',
    usage: 'Use for SSR data fetching. Returns a promise that SSR waits for.',
    signature: 'function onServerPrefetch(callback: () => Promise<any>): void',
    href: 'https://vuejs.org/api/composition-api-lifecycle.html#onserverprefetch',
  },

  // ===========================================================================
  // Dependency Injection
  // ===========================================================================
  provide: {
    name: 'provide',
    category: 'Injection',
    summary: 'Provides a value that can be injected by descendant components.',
    usage: 'Use to share state/methods across component trees without prop drilling.',
    signature: 'function provide<T>(key: InjectionKey<T> | string, value: T): void',
    href: 'https://vuejs.org/api/composition-api-dependency-injection.html#provide',
  },
  inject: {
    name: 'inject',
    category: 'Injection',
    summary: 'Injects a value provided by an ancestor component.',
    usage: 'Use to consume shared state/methods provided higher in the component tree.',
    signature: 'function inject<T>(key: InjectionKey<T> | string, defaultValue?: T): T',
    href: 'https://vuejs.org/api/composition-api-dependency-injection.html#inject',
  },
  hasInjectionContext: {
    name: 'hasInjectionContext',
    category: 'Injection',
    summary: 'Returns true if inject() can be used without warning.',
    usage: 'Use in composables to check if running within a component setup context.',
    signature: 'function hasInjectionContext(): boolean',
    href: 'https://vuejs.org/api/composition-api-dependency-injection.html#hasinjectioncontext',
  },

  // ===========================================================================
  // Setup Helpers
  // ===========================================================================
  defineProps: {
    name: 'defineProps',
    category: 'Setup',
    summary: 'Declares component props in `<script setup>`.',
    usage: 'Use to define props with type inference. Compiler macro, no import needed.',
    signature: 'function defineProps<T>(): Readonly<T>',
    href: 'https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits',
  },
  defineEmits: {
    name: 'defineEmits',
    category: 'Setup',
    summary: 'Declares component events in `<script setup>`.',
    usage: 'Use to define and type events the component can emit. Compiler macro.',
    signature: 'function defineEmits<T>(): T',
    href: 'https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits',
  },
  defineExpose: {
    name: 'defineExpose',
    category: 'Setup',
    summary: 'Exposes public properties on the component instance.',
    usage: 'Use to make specific methods/properties accessible via template refs.',
    signature: 'function defineExpose(exposed: Record<string, any>): void',
    href: 'https://vuejs.org/api/sfc-script-setup.html#defineexpose',
  },
  defineOptions: {
    name: 'defineOptions',
    category: 'Setup',
    summary: 'Declares component options like `name` or `inheritAttrs` in `<script setup>`.',
    usage: 'Use to set options that cannot be expressed with other macros.',
    signature: 'function defineOptions(options: ComponentOptions): void',
    href: 'https://vuejs.org/api/sfc-script-setup.html#defineoptions',
  },
  defineSlots: {
    name: 'defineSlots',
    category: 'Setup',
    summary: 'Declares expected slots and their prop types in `<script setup>`.',
    usage: 'Use to type slot props for better IDE support and type checking.',
    signature: 'function defineSlots<T>(): T',
    href: 'https://vuejs.org/api/sfc-script-setup.html#defineslots',
  },
  defineModel: {
    name: 'defineModel',
    category: 'Setup',
    summary: 'Declares a two-way binding prop in `<script setup>`.',
    usage: 'Use for v-model bindings. Creates prop + emit pair automatically.',
    signature: 'function defineModel<T>(name?: string, options?: Options): Ref<T>',
    href: 'https://vuejs.org/api/sfc-script-setup.html#definemodel',
  },
  withDefaults: {
    name: 'withDefaults',
    category: 'Setup',
    summary: 'Provides default values for type-based defineProps declarations.',
    usage: 'Use when defineProps uses type-only syntax and needs default values.',
    signature: 'function withDefaults<T>(props: T, defaults: Partial<T>): T',
    href: 'https://vuejs.org/api/sfc-script-setup.html#default-props-values-when-using-type-declaration',
  },
  useSlots: {
    name: 'useSlots',
    category: 'Setup',
    summary: 'Returns the slots object from the current component.',
    usage: 'Use in render functions or when you need programmatic access to slots.',
    signature: 'function useSlots(): Slots',
    href: 'https://vuejs.org/api/sfc-script-setup.html#useslots-useattrs',
  },
  useAttrs: {
    name: 'useAttrs',
    category: 'Setup',
    summary: 'Returns the attrs object containing fallthrough attributes.',
    usage: 'Use when you need to access or forward non-prop attributes.',
    signature: 'function useAttrs(): Attrs',
    href: 'https://vuejs.org/api/sfc-script-setup.html#useslots-useattrs',
  },
  useTemplateRef: {
    name: 'useTemplateRef',
    category: 'Setup',
    summary: 'Creates a ref bound to a template element by its ref attribute.',
    usage: 'Use to get typed DOM element or component references from templates.',
    signature: 'function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>',
    href: 'https://vuejs.org/api/composition-api-helpers.html#usetemplateref',
  },
  useId: {
    name: 'useId',
    category: 'Setup',
    summary: 'Generates a unique ID that is stable across server and client.',
    usage: 'Use for accessibility attributes (aria-labelledby, etc.) in SSR apps.',
    signature: 'function useId(): string',
    href: 'https://vuejs.org/api/composition-api-helpers.html#useid',
  },
  useCssModule: {
    name: 'useCssModule',
    category: 'Setup',
    summary: 'Returns the CSS module object for the component.',
    usage: 'Use to access CSS module class names in script setup.',
    signature: 'function useCssModule(name?: string): Record<string, string>',
    href: 'https://vuejs.org/api/sfc-css-features.html#usecssmodule',
  },

  // ===========================================================================
  // Render Function
  // ===========================================================================
  h: {
    name: 'h',
    category: 'Render',
    summary: 'Creates virtual DOM nodes (vnodes) for render functions.',
    usage: 'Use when building components with render functions instead of templates.',
    signature: 'function h(type: Component | string, props?: object, children?: VNodeChild): VNode',
    href: 'https://vuejs.org/api/render-function.html#h',
  },
  mergeProps: {
    name: 'mergeProps',
    category: 'Render',
    summary: 'Merges multiple props objects with special handling for class, style, and listeners.',
    usage: 'Use in render functions to combine props from multiple sources.',
    signature: 'function mergeProps(...args: object[]): object',
    href: 'https://vuejs.org/api/render-function.html#mergeprops',
  },
  cloneVNode: {
    name: 'cloneVNode',
    category: 'Render',
    summary: 'Clones a vnode with optional extra props to merge.',
    usage: 'Use to modify vnodes from slots without mutating the original.',
    signature: 'function cloneVNode(vnode: VNode, extraProps?: object): VNode',
    href: 'https://vuejs.org/api/render-function.html#clonevnode',
  },
  isVNode: {
    name: 'isVNode',
    category: 'Render',
    summary: 'Checks if a value is a vnode.',
    usage: 'Use to validate values when processing render function output.',
    signature: 'function isVNode(value: unknown): value is VNode',
    href: 'https://vuejs.org/api/render-function.html#isvnode',
  },
  resolveComponent: {
    name: 'resolveComponent',
    category: 'Render',
    summary: 'Resolves a registered component by name.',
    usage: 'Use in render functions to get a component from the resolution context.',
    signature: 'function resolveComponent(name: string): Component | string',
    href: 'https://vuejs.org/api/render-function.html#resolvecomponent',
  },
  resolveDirective: {
    name: 'resolveDirective',
    category: 'Render',
    summary: 'Resolves a registered directive by name.',
    usage: 'Use in render functions to get a directive for use with withDirectives.',
    signature: 'function resolveDirective(name: string): Directive | undefined',
    href: 'https://vuejs.org/api/render-function.html#resolvedirective',
  },
  withDirectives: {
    name: 'withDirectives',
    category: 'Render',
    summary: 'Adds custom directives to a vnode.',
    usage: 'Use in render functions to apply directives like v-show or custom directives.',
    signature: 'function withDirectives(vnode: VNode, directives: DirectiveArguments): VNode',
    href: 'https://vuejs.org/api/render-function.html#withdirectives',
  },
  withModifiers: {
    name: 'withModifiers',
    category: 'Render',
    summary: 'Adds event modifiers to an event handler function.',
    usage: 'Use in render functions to add .stop, .prevent, or other modifiers.',
    signature: 'function withModifiers(fn: Function, modifiers: string[]): Function',
    href: 'https://vuejs.org/api/render-function.html#withmodifiers',
  },

  // ===========================================================================
  // Custom Elements
  // ===========================================================================
  defineCustomElement: {
    name: 'defineCustomElement',
    category: 'General',
    summary: 'Creates a custom element class from a Vue component.',
    usage: 'Use to build Web Components with Vue that work outside Vue apps.',
    signature: 'function defineCustomElement(component: Component): CustomElementConstructor',
    href: 'https://vuejs.org/api/custom-elements.html#definecustomelement',
  },
  useHost: {
    name: 'useHost',
    category: 'General',
    summary: 'Returns the custom element host in a custom element component.',
    usage: 'Use inside defineCustomElement components to access the host element.',
    signature: 'function useHost(): HTMLElement | null',
    href: 'https://vuejs.org/api/custom-elements.html#usehost',
  },
  useShadowRoot: {
    name: 'useShadowRoot',
    category: 'General',
    summary: 'Returns the shadow root of a custom element component.',
    usage: 'Use to access the shadow DOM in custom element components.',
    signature: 'function useShadowRoot(): ShadowRoot | null',
    href: 'https://vuejs.org/api/custom-elements.html#useshadowroot',
  },

  // ===========================================================================
  // General
  // ===========================================================================
  defineComponent: {
    name: 'defineComponent',
    category: 'General',
    summary: 'Type helper for defining Vue components with TypeScript inference.',
    usage: 'Use for components defined outside SFCs or when you need explicit types.',
    signature: 'function defineComponent<T>(options: ComponentOptions<T>): Component<T>',
    href: 'https://vuejs.org/api/general.html#definecomponent',
  },
  defineAsyncComponent: {
    name: 'defineAsyncComponent',
    category: 'General',
    summary: 'Creates a component that is loaded lazily when rendered.',
    usage: 'Use for code splitting - load components only when needed.',
    signature: 'function defineAsyncComponent(loader: () => Promise<Component>): Component',
    href: 'https://vuejs.org/api/general.html#defineasynccomponent',
  },
  nextTick: {
    name: 'nextTick',
    category: 'General',
    summary: 'Waits for the next DOM update flush.',
    usage: 'Use when you need to access DOM after reactive state changes.',
    signature: 'function nextTick(callback?: () => void): Promise<void>',
    href: 'https://vuejs.org/api/general.html#nexttick',
  },
  createApp: {
    name: 'createApp',
    category: 'General',
    summary: 'Creates an application instance.',
    usage: 'Use once per app to bootstrap Vue and mount to the DOM.',
    signature: 'function createApp(rootComponent: Component, rootProps?: object): App',
    href: 'https://vuejs.org/api/application.html#createapp',
  },

  // ===========================================================================
  // Type Helpers (commonly seen in code, worth explaining)
  // ===========================================================================
  Ref: {
    name: 'Ref<T>',
    category: 'Types',
    summary: 'Type for a reactive reference with a `.value` property.',
    usage: 'Use to type ref() return values or composable parameters.',
    signature: 'interface Ref<T> { value: T }',
    href: 'https://vuejs.org/api/reactivity-core.html#ref',
  },
  ShallowRef: {
    name: 'ShallowRef<T>',
    category: 'Types',
    summary: 'Type for a ref that only tracks `.value` assignment.',
    usage: 'Use when storing objects where you replace the whole value.',
    signature: 'interface ShallowRef<T> { value: T }',
    href: 'https://vuejs.org/api/reactivity-advanced.html#shallowref',
  },
  ComputedRef: {
    name: 'ComputedRef<T>',
    category: 'Types',
    summary: 'Type for a readonly computed ref.',
    usage: 'Use to type computed() return values.',
    signature: 'interface ComputedRef<T> extends Ref<T> { readonly value: T }',
    href: 'https://vuejs.org/api/reactivity-core.html#computed',
  },
  MaybeRef: {
    name: 'MaybeRef<T>',
    category: 'Types',
    summary: 'Type for a value that may or may not be a ref.',
    usage: 'Use in composable parameters to accept both plain values and refs.',
    signature: 'type MaybeRef<T> = T | Ref<T>',
    href: 'https://vuejs.org/api/reactivity-utilities.html#tovalue',
  },
  MaybeRefOrGetter: {
    name: 'MaybeRefOrGetter<T>',
    category: 'Types',
    summary: 'Type for a value, ref, or getter function.',
    usage: 'Use in composable parameters for maximum flexibility. Use toValue() to unwrap.',
    signature: 'type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)',
    href: 'https://vuejs.org/api/reactivity-utilities.html#tovalue',
  },
  InjectionKey: {
    name: 'InjectionKey<T>',
    category: 'Types',
    summary: 'Symbol type for typed provide/inject.',
    usage: 'Use to create typed keys for dependency injection.',
    signature: 'type InjectionKey<T> = Symbol & { __type?: T }',
    href: 'https://vuejs.org/api/composition-api-dependency-injection.html#inject',
  },
}
