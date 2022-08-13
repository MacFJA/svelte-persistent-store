---
name: Persist a JavaScript class
order: 3
---
# Persist a JavaScript class

The storage of classes is a bit more involving that simple object or array.

Class are complex object that contains functions and logic that do more than holding data.

To store classes we need to serialize them into a special form that we will be able to reverse, to do so we need to register the class, so we know that we have something to do with it.

## Example

```html
<script>
    import { persist, createLocalStorage, addSerializableClass } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"

    export class NameHolder {
        constructor() {
            this.name = "John"
        }

        setName(name) {
            this.name = name
        }
        getName() {
            return this.name
        }
    }

    // Register the class
    addSerializableClass(NameHolder);

    let classStore = persist(writable(new NameHolder()), createLocalStorage(), 'user-name');
    
    function updateName() {
        $classStore.setName('Jeanne');
        /* Force reactivity as we are working with object/class,
         * As there is no assignation, Svelte can't detect reactivity, so we help it by creating an assignation
         */
        $classStore = $classStore;
    }
</script>

The current name is: <var id="classValue">{$classStore.getName()}</var>
<button id="classButton" on:click={updateName}>Change name to Jeanne</button>
```
