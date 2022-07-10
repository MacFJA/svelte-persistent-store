# Disabling warning about missing storage

When using the library both on Client and Server side, you can have warnings messages about missing storage on the server.

> Unable to find the xxxx. No data will be persisted.
> Are you running on a server? Most of storages are not available while running on a server.

Those message should only appear once, and only during development.

But they can still be annoying. To remove those messages, an options is available:

```js
import { disableWarnings } from "@macfja/svelte-persistent-store";
disableWarnings();
```

Put this function call before calling the persistent storage or in the init/boot script.
