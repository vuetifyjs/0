# useContext

The `useContext` composable provides access to the global context of your application. This is useful for accessing shared state or methods that are available throughout your app. It serves as the baseline for [useRegistrar](#useregistrar)

## Usage

```ts
import { useContext } from '@vuetify/0'

const [useContext, provideContext] = useContext('namespace')
```
