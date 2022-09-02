---
name: Encrypt persisted data
order: 4
---

# Encrypt persisted data

You can encrypt data that are persisted.  
Both the key and the data are encrypted.

_**NOTE:** The encryption is not well adapted for cookie storage, as the data is encrypted, its size greatly increase, you will rapidly get to the allowed cookie size._

## Examples

```html
<script>
    import { persist, createLocalStorage, createEncryptedStorage } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"

    const storage = createEncryptedStorage(createLocalStorage(), "5368566D597133743677397A24432646")
    const nickname = persist(writable("John"), storage, "myapp-nickname")
</script>
```
