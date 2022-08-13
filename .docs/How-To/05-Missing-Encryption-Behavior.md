---
name: Change behavior with missing encryption
order: 5
---
# Change the behavior when the encryption is not possible

The encryption library use the browser native WebCrypto library to work (or NodeJS Crypto library on a server).

But there is case where the WebCrypto library may not be available, for example on a not secure URL.

By default, this library will raise an exception.

But you can change this with this code:

```js
import { noEncryptionBehavior, NO_ENCRYPTION_BEHAVIOR } from "@macfja/svelte-persistent-store";
noEncryptionBehavior(NO_ENCRYPTION_BEHAVIOR.NO_ENCRYPTION);
```

Put this function call before calling the persistent storage or in the init/boot script.

## List of behavior

| Name                                      | Numeric value | Comment                                                           |
|-------------------------------------------|---------------|-------------------------------------------------------------------|
| [[NO_ENCRYPTION_BEHAVIOR.EXCEPTION]] | `0`           | **(default)** Raise an exception                                  |
| [[NO_ENCRYPTION_BEHAVIOR.NO_ENCRYPTION]]    | `1`           | Use the wrapped Storage as-is. Data will be saved not encrypted   |
| [[NO_ENCRYPTION_BEHAVIOR.NO_STORAGE]]       | `2`           | Don't use any storage, so no not encrypted data will be persisted |
