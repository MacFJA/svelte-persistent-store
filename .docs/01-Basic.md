# Basic examples

## Local Storage

```html
<script>
    import { persist, localStorage } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"
    
    const theme = persist(writable('light'), localStorage(), 'myapp-theme')
</script>
<aside>
    <label>
        <span>Select the application theme:</span>
        <select bind:value={$theme}>
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
    import { persist, sessionStorage } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"
    
    const currentDocumentTitle = persist(writable('Unsaved document'), sessionStorage(), 'myapp-new-document-title')
    const currentDocumentContent = persist(writable('Lorem ipsum'), sessionStorage(), 'myapp-new-document-content')
    
    const save = () => {
        // myApi.save({title: $currentDocumentTitle, content: $currentDocumentContent})
        currentDocumentTitle.delete()
        currentDocumentContent.delete()
    }
</script>

<article>
    <header>
        <input bind:value={$currentDocumentTitle} />
    </header>
    <p contenteditable="true" bind:textContent={$currentDocumentContent}></p>
</article>
```

## Cookie storage

```html
<script>
    import { persist, cookieStorage } from "@macfja/svelte-persistent-store"
    import { writable } from "svelte/store"
    
    const newsLetterSubscription = persist(writable(false), cookieStorage(), 'newsletter')
</script>

<footer>
    <input name="email"><label><input type="checkbox" bind:checked={$newsLetterSubscription}> I want to receive news by email</label>
</footer>
```