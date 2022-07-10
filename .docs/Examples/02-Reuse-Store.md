# Reuse a store across an application

There are, at least, 3 ways to have the same store between components.

1. Recreate the same code definition in the second component
2. Create the store in one component `context="module"` scope
3. Create the store outside a component and import it

**The 1st solution is NOT the best**. Each stores will be a different instance, so they won't share anything.
If you change the store value in one component other won't see it (unless you unmount/mount the component again).
You also expose yourself to data concurrency: each stores will erase the previously saved value of another store.

The 2nd and 3rd are similar. The difference between the two is the "owning" of the store.
If you declare it in the `context="module"` of a component you implicitly make this component as owner (for human point of view) as every times you need it you will import it from this component.
Creating the component in a separate JS/TS file, the store is not _"attached"_ to any component.

----

Here an example of those 3 implementations

## Duplication definition in every component

```html
<!-- Component1.svelte -->
<script>
  import { persist, localStorage } from "@macfja/svelte-persistent-store"
  import { writable } from "svelte/store"

  let name = persist(writable("John"), localStorage(), "name")

  $name = 'Jeanne Doe'
</script>
```
&nbsp;
```html
<!-- Component2.svelte -->
<script>
  import { persist, localStorage } from "@macfja/svelte-persistent-store"
  import { writable } from "svelte/store"
  import { onMount } from "svelte"

  let name = persist(writable("Foobar"), localStorage(), "name")

  onMount(() => { alert($name) }) // If Component2 is loaded/mount after Component1 the alert will be "Jeanne Doe"
</script>
```

## Context module

```html
<!-- Component1.svelte -->
<script context="module">
  import { persist, localStorage } from "@macfja/svelte-persistent-store"
  import { writable } from "svelte/store"

  export let name = persist(writable("John"), localStorage(), "name")
</script>
<script>
  $name = "Jeanne Doe"
</script>
```
&nbsp;
```html
<!-- Component2.svelte -->
<script>
  import { name } from "Component1.svelte"

  name.subscribe(value => alert(value)) // the alert will open when the store is change in any component
</script>
```

## External definition

```js
// stores.js
import { persist, localStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export let name = persist(writable("John"), localStorage(), "name")
```
&nbsp;
```html
<!-- Component1.svelte -->
<script>
  import { name } from "stores.js"

  $name = "Jeanne Doe"
</script>
```
&nbsp;
```html
<!-- Component2.svelte -->
<script>
  import { name } from "stores.js"

  name.subscribe(value => alert(value)) // the alert will open when the store is change in any component
</script>
```
