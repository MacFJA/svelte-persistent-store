<script>
    import {persist, cookieStorage, localStorage, sessionStorage, indexedDBStorage} from "../../src/index"
    import { writable } from "svelte/store"

    let cookieExample = persist(writable('John'), cookieStorage(), 'sps-userName')
    let localExample = persist(writable('Foo'), localStorage(), 'sps-action')
    let sessionExample = persist(writable('Bar'), sessionStorage(), 'sps-call')
    let indexedDBExample = persist(writable('Hello'), indexedDBStorage(), 'sps-data')

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

<button id="reloadButton" on:click={() => window.location.reload()}>Reload the page</button>

<button id="clearButton" on:click={() => {cookieExample.delete(); localExample.delete(); sessionExample.delete(); indexedDBExample.delete()}}>Clear storages</button>