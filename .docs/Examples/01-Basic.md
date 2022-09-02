---
name: Basic examples
order: 1
---

# Basic examples

## Local Storage

```html
<script>
    import { persistBrowserLocal } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"

    const theme = persistBrowserLocal(writable("light"), "myapp-theme")
</script>
<aside>
    <label>
        <span>Select the application theme:</span>
        <select bind:value="{$theme}">
            <option value="light">Light colors</option>
            <option value="dark">Dark colors</option>
            <option value="amoled">Darker AMOLED colors</option>
        </select>
    </label>
</aside>
```

## Session storage

```html
<script>
    import { persistBrowserSession } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"

    const currentDocumentTitle = persistBrowserSession(writable("Unsaved document"), "myapp-new-document-title")
    const currentDocumentContent = persistBrowserSession(writable("Lorem ipsum"), "myapp-new-document-content")

    const save = () => {
        // myApi.save({title: $currentDocumentTitle, content: $currentDocumentContent})
        currentDocumentTitle.delete()
        currentDocumentContent.delete()
    }
</script>

<article>
    <header>
        <input bind:value="{$currentDocumentTitle}" />
    </header>
    <p contenteditable="true" bind:textContent="{$currentDocumentContent}"></p>
</article>
```

## Cookie storage

```html
<script>
    import { persist, cookieStorage } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"

    const newsLetterSubscription = persist(writable(false), cookieStorage(), "newsletter")
</script>

<footer>
    <input name="email" />
    <label><input type="checkbox" bind:checked="{$newsLetterSubscription}" /> I want to receive news by email</label>
</footer>
```

## indexedDB storage

```html
<script>
    import { persist, createIndexedDBStorage } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"

    const layout = persist(writable("2column"), createIndexedDBStorage(), "myapp-layout")
</script>

<aside>
    <label>
        <span>Select the application layout:</span>
        <select bind:value="{$layout}">
            <option value="2column">2 columns (Right)</option>
            <option value="2column-left">2 columns (Left)</option>
            <option value="stacked">Stacked</option>
            <option value="stacked-rev">Stacked Reversed</option>
        </select>
    </label>
</aside>
```

## Chrome storage

```html
<script>
    import { persist, createChromeStorage, CHROME_STORAGE_TYPE } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"

    const mode = persist(writable("2column"), createChromeStorage(CHROME_STORAGE_TYPE.SYNC), "myext-mode")
</script>

<aside>
    <label>
        <span>Select the extension mode:</span>
        <select bind:value="{$mode}">
            <option value="off">Off</option>
            <option value="normal">Normal</option>
            <option value="debug">Debug (verbose)</option>
        </select>
    </label>
</aside>
```
