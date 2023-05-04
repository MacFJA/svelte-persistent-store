---
name: Usage of persistent store
order: 5
---

# Usage of persistent store

There are a multiple way to use/create persistent stores.

## The long and configurable way

This method allow to configure the storage by first creating it.
This is particular useful for LocalStorage, SessionStorage, EncryptedStorage and ChromeStorage that have configuration.

_**NOTE:** It's the only way to use EncryptedStorage and ChromeStorage_

### Function call

```typescript
import {writable} from "svelte/store"

const persistedStore = persist(
    writable("my value"),
    <<storageCreateFunction()>>,
    "my-data-key"
)
```

With:

-   `writable("my value")` the store you want to persist
-   `<<storageCreateFunction()>>` one of
    -   `createLocalStorage`
    -   `createSessionStorage`
    -   `createCookieStorage`
    -   `createIndexedDBStorage`
    -   `createEncryptedStorage`
    -   `createChromeStorage`
-   `"my-data-key"` the key that will identify the store in the storage

### Functions signatures

```typescript
declare function persist<T>(store: Writable<T>, storage: StorageInterface<T>, key: string): PersistentStore<T>

declare function createLocalStorage<T>(listenExternalChanges?: boolean): StorageInterface<T>
declare function createSessionStorage<T>(listenExternalChanges?: boolean): StorageInterface<T>
declare function createCookieStorage(): StorageInterface<any>
declare function createIndexedDBStorage<T>(): SelfUpdateStorageInterface<T>
declare function createEncryptedStorage<T>(
    wrapped: StorageInterface<T>,
    encryptionKey: string
): StorageInterface<T> | SelfUpdateStorageInterface<T>
declare function createChromeStorage<T>(
    storageType?: CHROME_STORAGE_TYPE,
    listenExternalChanges?: boolean
): SelfUpdateStorageInterface<T>
```

-   `createLocalStorage` and `createSessionStorage` take a boolean as theirs first parameter (`false` by default). If set to `true` the storage will listen for changes (of the stored value) in other pages
-   `createEncryptedStorage` have 2 parameters, the first one is the storage that you want to encrypt, the second is the encryption key to use
-   `createChromeStorage` have 2 optional parameters, the first one this the type of storage (local storage by default), the second (`false` by default) if set to `true` the storage will listen for changes (of the stored value) in other pages

## Preconfigured storage way

This method allow to use pre-created storage, configured with default options.
This avoids creating multiple times the same storage

### Function call

```typescript
import {writable} from "svelte/store"

const persistedStore = <<persistFunction>>(
    writable("my value"),
    "my-data-key"
)
```

With:

-   `writable("my value")` the store you want to persist
-   `<<persistFunction>>` one of
    -   `persistBrowserLocal`
    -   `persistBrowserSession`
    -   `persistCookie`
-   `"my-data-key"` the key that will identify the store in the storage

### Functions signatures

```typescript
declare function persistBrowserLocal<T>(store: Writable<T>, key: string): PersistentStore<T>
declare function persistBrowserSession<T>(store: Writable<T>, key: string): PersistentStore<T>
declare function persistCookie<T>(store: Writable<T>, cookieName: string): PersistentStore<T>
```

## Short way

This method allow to quickly create a writable store without the boilerplate of creating a Svelte store and a Storage.

### Function call

```typescript
const persistedStore = <<writableFunction>>(
    "my-data-key",
    "my value"
)
```

With:

-   `"my value"` the value store you want to persist
-   `<<writableFunction>>` one of
    -   `localWritable`
    -   `writable`
    -   `sessionWritable`
    -   `cookieWritable`
-   `"my-data-key"` the key that will identify the store in the storage

### Functions signatures

```typescript
declare function localWritable<T>(key: string, initialValue?: T): PersistentStore<T>
declare function writable<T>(key: string, initialValue?: T): PersistentStore<T>
declare function sessionWritable<T>(key: string, initialValue?: T): PersistentStore<T>
declare function cookieWritable<T>(key: string, initialValue?: T): PersistentStore<T>
```

-   `writable` is an alias to `localWritable`

---

## About long format advantages

The long format allow you to use High order function principle.

The `persist` (and also `persistCookie`, `persistBrowserSession`, `persistBrowserLocal`) function is a high order function: it takes a parameter and return an augmented version of it.

As High order function return an augmented version of their parameter, they can be chained.

Imagine we have another lib that enhance a store (like `@macfja/svelte-invalidable`) we can chain them:

```typescript
import { invalidable } from "@macfja/svelte-invalidable"
import { persistBrowserLocal } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

const myStore = persistBrowserLocal(
    invalidable(writable(0), () => Math.random()),
    "last-random"
)

// $myStore will return a number
// myStore.invalidate() (added by @macfja/svelte-invalidable) still work
// The value or myStore is saved in the browser localStorage
```

With the full format (`persist` only) you can also add encryption to a storage

```typescript
import { persist, createLocalStorage, createEncryptedStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

const storage = createEncryptedStorage(createLocalStorage(), "5368566D597133743677397A24432646")
const myStore = persist(writable(0), storage, "my-data-key")
```
