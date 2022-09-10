---
name: Encrypt persisted data
order: 4
---

# Encrypt persisted data

You can encrypt data that are persisted.

The key is hashed (with the [[GCMEncryption]], hashing is done with an encryption).  
The data is encrypted.

_**NOTE:** The encryption is not well adapted for cookie storage, as the data is encrypted, its size greatly increase, you will rapidly get to the allowed cookie size._

## Examples

```html
<script>
    import { persist, createLocalStorage, createEncryptedStorage, GCMEncryption } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"

    const storage = createEncryptedStorage(createLocalStorage(), new GCMEncryption("5368566D597133743677397A24432646"))
    const nickname = persist(writable("John"), storage, "myapp-nickname")
</script>
```

## Encryption key

https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
