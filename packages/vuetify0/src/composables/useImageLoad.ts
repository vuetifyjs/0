import { onMounted, onUnmounted, type Ref, watch } from 'vue'
import { useImageLoadingState } from './useLoadingState'

/**
 * Composable for handling image loading with automatic event management
 * @param src - Reactive source URL for the image
 * @returns Object with loading status, image ref, and event handlers
 */
export function useImageLoad (
  src: Ref<string | undefined>,
  imageRef: Ref<HTMLImageElement | null>,
) {
  const { state: status, setState } = useImageLoadingState()

  const handleLoad = () => {
    setState('loaded')
  }

  const handleError = () => {
    setState('error')
  }

  const setupImageListeners = () => {
    if (!imageRef.value) {
      return
    }

    if (imageRef.value.complete) {
      setState(imageRef.value.naturalWidth ? 'loaded' : 'error')
    } else {
      imageRef.value.addEventListener('load', handleLoad)
      imageRef.value.addEventListener('error', handleError)
    }
  }

  const cleanupImageListeners = () => {
    if (!imageRef.value) {
      return
    }

    imageRef.value.removeEventListener('load', handleLoad)
    imageRef.value.removeEventListener('error', handleError)
  }

  watch(
    () => src.value,
    () => {
      setState('loading')
    },
    { immediate: true },
  )

  onMounted(() => {
    setupImageListeners()
  })

  onUnmounted(() => {
    cleanupImageListeners()
  })

  return {
    status,
    handleLoad,
    handleError,
    setupImageListeners,
    cleanupImageListeners,
  }
}
