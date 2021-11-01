<script>
    import {persist, cookieStorage, localStorage, sessionStorage, indexedDBStorage} from "../../src/index"
    import { writable } from "svelte/store"

    let cookieExample = persist(writable('John'), cookieStorage(), 'sps-userName')
    let localExample = persist(writable('Foo'), localStorage(), 'sps-action')
    let sessionExample = persist(writable('Bar'), sessionStorage(), 'sps-call')
    let indexedDBExample = persist(writable('Hello'), indexedDBStorage(), 'sps-data')
    let undefinedExample = persist(writable(), sessionStorage(), 'sps-undefined')
    let undefinedExample2 = persist(writable(), indexedDBStorage(), 'sps-undefined')
    let undefinedExample3 = persist(writable(), cookieStorage(), 'sps-undefined')
    let nullExample = persist(writable(null), sessionStorage(), 'sps-null')
    let nullExample2 = persist(writable(null), indexedDBStorage(), 'sps-null')
    let nullExample3 = persist(writable(null), cookieStorage(), 'sps-null')

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
}}>Clear storages</button>