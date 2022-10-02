# Svelte Persistent store

A Svelte store that keep its value through pages and reloads

![Github CI](https://github.com/macfja/svelte-persistent-store/workflows/Quality%20tools/badge.svg)
![GitHub Repo stars](https://img.shields.io/github/stars/macfja/svelte-persistent-store?style=social)
![NPM bundle size](https://img.shields.io/bundlephobia/minzip/@macfja/svelte-persistent-store)
![Download per week](https://img.shields.io/npm/dw/@macfja/svelte-persistent-store)
![License](https://img.shields.io/npm/l/@macfja/svelte-persistent-store)
![NPM version](https://img.shields.io/npm/v/@macfja/svelte-persistent-store)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@macfja/svelte-persistent-store)

## Installation

```
npm install @macfja/svelte-persistent-store
```

## Usage

```javascript
import { persist, createLocalStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

let name = persist(writable("John"), createLocalStorage(), "name")

$name = "Jeanne Doe"

// if you reload the page the value of $name is 'Jeanne Doe'
```

```javascript
import { persistBrowserSession } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

let name = persistBrowserSession(writable("Unsaved"), "document-name")

$title = "My Document"

// if you reload the page the value of $title is 'My Document'
```

## Features

-   Multiple storages (Allow to have the best suited usage depending on your use case)
-   Work with any Svelte store
-   Work with classes, objects, primitive

## Storages

There are 6 storages built-in:

-   `createLocalStorage()`, that use `window.localStorage` to save values
-   `createSessionStorage()`, that use `window.sessionStorage` to save values
-   `createCookieStorage()`, that use `document.cookie` to save values
-   `createIndexedDBStorage()`, that use `window.indexedDB` to save value
-   `createChromeStorage()`, that use `chrome.storage` to save values
-   `createEncryptedStorage()`, that wrap a storage to encrypt data (and key)

You can add more storages, you just need to implement the interface `StorageInterface`

## Documentation

Documentation and examples can be generated with `npm run doc`, next open `docs/index.html` with your favorite web browser.

(Hint: If you don't want to generate the docs, a part of the example and documentation are available [here](.docs/README.md))

### Types

The persist function will return a new Store with type `PersistentStore<T>`.

The full signature of `persist` is:

```typescript
declare function persist<T>(store: Writable<T>, storage: StorageInterface<T>, key: string): PersistentStore<T>
```

The persist function add a `delete` function on the store.

More information about types can be found in the generated `types/index.d.ts` (`npm run prebuild`) or in the generated documentation (`npm run doc`).

## Backwards Compatibility Break

### `1.3.0` to `2.0.0`

Data persisted in version `1.3.0` may not be deserializable with version `2.*`.

If you have persisted store that contains Javascript class with version `1.3.0` of `@macfja/svelte-persistent-store` you will not be able to get the data by default.
This is due to a change of data serialization. More information [here](.docs/How-To/06-Change-Serialization.md)

## Contributing

Contributions are welcome. Please open up an issue or create PR if you would like to help out.

Read more in the [Contributing file](CONTRIBUTING.md)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
