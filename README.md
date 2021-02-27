# Svelte Persistent store

A Svelte store that keep its value through pages and reloads

## Installation

```
npm install @macfja/svelte-persistent-store
```

## Usage

```javascript
import { persist, localStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

let name = persist(writable('John'), localStorage(), 'name')

$name = 'Jeanne Doe'

// if you reload the page the value of $name is 'Jeanne Doe'
```

## Storages

There are 3 storages built-in:

 - `localStorage()`, that use `window.localStorage` to save values 
 - `sessionStorage()`, that use `window.sessionStorage` to save values 
 - `cookieStorage()`, that use `document.cookie` to save values 

You can add more storages, you just need to implement the interface `StorageInterface`

## Contributing

Contributions are welcome. Please open up an issue or create PR if you would like to help out.

Read more in the [Contributing file](CONTRIBUTING.md)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.