---
name: Change the serialization functions
order: 6
---

# Change the serialization functions

The library allow different serialization functions to use to transform input data into string before saving then in the storage.

-   The default serialization library since version **`2.0.0`** is [`@macfja/serializer`](https://www.npmjs.com/package/@macfja/serializer).
-   In the version **`1.3.0`** the serializer was [`esserializer`](https://www.npmjs.com/package/esserializer).
-   In versions before **`1.3.0`** the serializer was the [Native JSON serialization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON).

## Serialization functions signature

To change the serialization, you need to use `setSerialization` from `@macfja/svelte-persistent-store`.

```typescript
declare function setSerialization(
    serializer: (data: any) => string,
    deserializer: (input: string) => any,
    addSerializableClass?: (classConstructor: FunctionConstructor) => void
): void
```

-   The `serializer` parameter **MUST** be a function that take one parameter which is the data to transform, and **MUST** return a string.
-   The `deserializer` parameter **MUST** be a function that take one parameter which is the serialized data to revert, and **MUST** return tha original data.
-   The `addSerializableClass` parameter is optional. It's a function that take one parameter which is a class.

## Examples

### Using JSON for serialization

```typescript
import { setSerialization } from "@macfja/svelte-persistent-store"

setSerialization(JSON.stringify, JSON.parse)
```

### Using `esserializer` for serialization

```typescript
import { setSerialization } from "@macfja/svelte-persistent-store"
import ESSerializer from "esserializer"

const allowed = []
setSerialization(
    ESSerializer.serialize,
    (data) => ESSerializer.deserialize(data, allowed),
    (aClass) => allowed.push(aClass)
)
```

### Using `esserializer` for serialization as it was implemented in `1.3.0`

```typescript
import { setSerialization } from "@macfja/svelte-persistent-store"
import ESSerializer from "esserializer"

const allowedClasses = []
setSerialization(
    ESSerializer.serialize,
    (value) => {
        if (value === "undefined") {
            return undefined
        }

        if (value !== null && value !== undefined) {
            try {
                return ESSerializer.deserialize(value, allowedClasses)
            } catch (e) {
                // Do nothing
                // use the value "as is"
            }
            try {
                return JSON.parse(value)
            } catch (e) {
                // Do nothing
                // use the value "as is"
            }
        }
        return value
    },
    (classDef) => {
        allowedClasses.push(classDef)
    }
)
```

### Using `@macfja/serializer` for serialization

```typescript
import { setSerialization } from "@macfja/svelte-persistent-store"
import { serialize, deserialize, addGlobalAllowedClass } from "@macfja/serializer"

setSerialization(serialize, deserialize, addGlobalAllowedClass)
```
