# Storage that can update themselves

The **sessionStorage** and **localStorage** are able to listen changes made externally to the current Window.

_**NOTE:** Change that are made from another browser window (browser tab) from the same website domain and same browser **ONLY**.
Change made inside the same application instance (i.e. in another page of an SPA) are NOT considered as external changes!_ 

To activate this feature, just add `true` as the parameter of the `localStorage` and `sessionStorage`.

## Examples

### Local Storage

```html
<script>
    import { persist, localStorage } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"

    const nickname = persist(writable('John'), localStorage(true), 'myapp-nickname')
    //                                                      ^^^^
</script>
```

If the another Window from the (same) browser change the value of the _localStorage_ (from a Svelte application or not), the store will be updated.

### Session Storage

```html
<script>
    import { persist, sessionStorage } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"

    const unreadCount = persist(writable(0), sessionStorage(true), 'myapp-unread')
    //                                                      ^^^^
</script>
```

If the another Window from the (same) browser change the value of the _sessionStorage_ (from a Svelte application or not), the store will be updated.