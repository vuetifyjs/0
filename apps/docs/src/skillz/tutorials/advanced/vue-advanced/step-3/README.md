---
hideFiles: false
hideTabs: false
hideBreadcrumbs: true
---
# effectScope

`effectScope()` groups reactive effects (watchers, computed, etc.) so you can **dispose them all at once**. This is essential for composables that set up intervals, listeners, or subscriptions.

## The problem

Without `effectScope`, you'd need to manually track and clean up every watcher and interval:

```ts
const interval = setInterval(poll, 1000)
const stopWatch = watch(source, callback)

// Later...
clearInterval(interval)
stopWatch()
```

## The solution

```ts
import { effectScope } from 'vue'

const scope = effectScope()

scope.run(() => {
  // Everything created here is grouped
  watch(source, callback)
  setInterval(poll, 1000)
})

// One call disposes everything
scope.stop()
```

## Try it

The editor shows a `usePolling` composable that uses `effectScope` to manage a polling interval. Click **Start** to begin, **Stop** to dispose the scope, and **Restart** to create a fresh one. Try adding `pause()` and `resume()` functions that stop and restart the interval without disposing the scope.
