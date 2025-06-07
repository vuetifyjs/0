<script setup lang="ts">
  import type { InjectionKey, Ref } from 'vue'
  import type { LoadingState } from '../../types/componentStates'
  import { useContextProvider } from '../../composables/useContext'
  import { useImageLoadingState } from '../../composables/useLoadingState'
  import { CONTEXT_KEYS } from '../../constants/contextKeys'
  import { VAtom, type VAtomProps } from '../VAtom/VAtom'

  export interface VAvatarRootProps extends VAtomProps {
    // Add any specific props for VAvatarRoot here
  }

  export interface AvatarContextValue {
    imageLoadingStatus: Ref<LoadingState>
    setImageLoadingStatus: (state: LoadingState) => void
  }

  const props = defineProps<VAvatarRootProps>()

  const { state: imageLoadingStatus, setState: setImageLoadingStatus } = useImageLoadingState()

  const contextValue: AvatarContextValue = {
    imageLoadingStatus,
    setImageLoadingStatus,
  }

  useContextProvider(AvatarContext, contextValue)
</script>

<script lang="ts">
  export const AvatarContext: InjectionKey<AvatarContextValue> = CONTEXT_KEYS.AVATAR
</script>

<template>
  <VAtom :as="props.as" :as-child="props.asChild">
    <slot />
  </VAtom>
</template>
