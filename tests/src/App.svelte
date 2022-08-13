<script>
    import {
        persist,
        createCookieStorage,
        createLocalStorage,
        createSessionStorage,
        createIndexedDBStorage,
        addSerializableClass,
    } from "../../src/index"
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

    addSerializableClass(NameHolder)

    let cookieExample = persist(writable('John'), createCookieStorage(), 'sps-userName')
    let localExample = persist(writable('Foo'), createLocalStorage(), 'sps-action')
    let sessionExample = persist(writable('Bar'), createSessionStorage(), 'sps-call')
    let indexedDBExample = persist(writable('Hello'), createIndexedDBStorage(), 'sps-data')
    let undefinedExample = persist(writable(), createSessionStorage(), 'sps-undefined')
    let undefinedExample2 = persist(writable(), createIndexedDBStorage(), 'sps-undefined')
    let undefinedExample3 = persist(writable(), createCookieStorage(), 'sps-undefined')
    let nullExample = persist(writable(null), createSessionStorage(), 'sps-null')
    let nullExample2 = persist(writable(null), createIndexedDBStorage(), 'sps-null')
    let nullExample3 = persist(writable(null), createCookieStorage(), 'sps-null')
    let classExample = persist(writable(new NameHolder()), createLocalStorage(), 'sps-class')
    let arrayExample = persist(writable([1,2,3]), createLocalStorage(), 'sps-array')
    let objectExample = persist(writable({a: 1, b: 2}), createLocalStorage(), 'sps-object')

    let cookie = ''

    cookieExample.subscribe(_ => {
        cookie = document.cookie
    })
</script>

<fieldset>
    <legend>Cookie storage</legend>
    <section>
        Current content of cookie: <var id="documentCookie">{cookie}</var>
    </section>
    <label>Enter a name: <input id="cookieInput" bind:value={$cookieExample}></label>
</fieldset>

<fieldset>
    <legend>LocalStorage</legend>
    <label>Enter a word: <input id="localInput" bind:value={$localExample}></label>
</fieldset>

<fieldset>
    <legend>SessionStorage</legend>
    <label>Enter a word: <input id="sessionInput" bind:value={$sessionExample}></label>
</fieldset>

<fieldset>
    <legend>IndexedDB Storage</legend>
    <label>Enter a word: <input id="indexedInput" bind:value={$indexedDBExample}></label>
</fieldset>

<fieldset>
    <legend>Special value</legend>
    <fieldset>
        <legend>Undefined value</legend>
        <fieldset id="undefinedTest">
            <legend>Session Storage</legend>
            <code>{$undefinedExample}</code> &rarr; <var>{typeof $undefinedExample}</var>
        </fieldset>
        <fieldset id="undefinedTest2">
            <legend>IndexedDB Storage</legend>
            <code>{$undefinedExample2}</code> &rarr; <var>{typeof $undefinedExample2}</var>
        </fieldset>
        <fieldset id="undefinedTest3">
            <legend>Cookie Storage</legend>
            <code>{$undefinedExample3}</code> &rarr; <var>{typeof $undefinedExample3}</var>
        </fieldset>
    </fieldset>
    <fieldset>
        <legend>Null value</legend>
        <fieldset id="nullTest">
            <legend>Session Storage</legend>
            <code>{$nullExample}</code> &rarr; <var>{typeof $nullExample}</var>
        </fieldset>
        <fieldset id="nullTest2">
            <legend>IndexedDB Storage</legend>
            <code>{$nullExample2}</code> &rarr; <var>{typeof $nullExample2}</var>
        </fieldset>
        <fieldset id="nullTest3">
            <legend>Cookie Storage</legend>
            <code>{$nullExample3}</code> &rarr; <var>{typeof $nullExample3}</var>
        </fieldset>
    </fieldset>
    <fieldset>
        <legend>Not scalar value</legend>
        <fieldset id="arrayTest">
            <legend>Array</legend>
            <code>{$arrayExample}</code> &rarr; <var>{typeof $arrayExample}</var>
            <button on:click={() => $arrayExample = [...$arrayExample, 4]}>Append 4</button>
        </fieldset>
        <fieldset id="objectTest">
            <legend>Object</legend>
            <code>{$objectExample}</code> &rarr; <var>{typeof $objectExample}</var>
            <button on:click={() => $objectExample.b = 4}>Change key b</button>
        </fieldset>
    </fieldset>
</fieldset>

<fieldset>
    <legend>Class transform</legend>
    The current name is: <var id="classValue">{$classExample.getName()}</var>.
    The current object type is: <var id="className">{$classExample.constructor.name}</var>.
    <button id="classButton" on:click={() => { $classExample.setName('Jeanne'); $classExample = $classExample}}>Change name to Jeanne</button>
</fieldset>

<button id="reloadButton" on:click={() => window.location.reload()}>Reload the page</button>

<button id="clearButton" on:click={() => {
    cookieExample.delete();
    localExample.delete();
    sessionExample.delete();
    indexedDBExample.delete();
    undefinedExample.delete()
    undefinedExample2.delete()
    undefinedExample3.delete()
    nullExample.delete()
    nullExample2.delete()
    nullExample3.delete()
    classExample.delete()
    arrayExample.delete()
    objectExample.delete()
}}>Clear storages</button>
