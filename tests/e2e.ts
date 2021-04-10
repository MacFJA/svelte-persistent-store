import { Selector } from "testcafe"

fixture("Svelte Persistent Storage")
    .page("http://localhost:5000")

const cookieInput = Selector('#cookieInput'),
    localInput = Selector('#localInput'),
    sessionInput = Selector('#sessionInput'),
    indexedInput = Selector('#indexedInput'),
    documentCookie = Selector('#documentCookie'),
    reloadButton = Selector('#reloadButton'),
    clearButton = Selector('#clearButton')

test("Initial state", async t => {
    await t
        .click(clearButton)
        .click(reloadButton)
        .expect(cookieInput.value).eql("John")
        .expect(localInput.value).eql('Foo')
        .expect(sessionInput.value).eql('Bar')
        .expect(indexedInput.value).eql('Hello')
        .expect(documentCookie.textContent).contains("sps-userName=%22John%22")
})

test("Cookie storage", async t => {
    await t
        .expect(cookieInput.value).eql("John")
        .selectText(cookieInput)
        .typeText(cookieInput, "Foobar")
        .expect(documentCookie.textContent).contains("sps-userName=%22Foobar%22")
        .click(reloadButton)
        .expect(cookieInput.value).eql("Foobar")
        .expect(documentCookie.textContent).contains("sps-userName=%22Foobar%22")
        .click(clearButton)
        .click(reloadButton)
        .expect(cookieInput.value).eql("John")
})

test("Local storage", async t => {
    await t
        .expect(localInput.value).eql("Foo")
        .typeText(localInput, "bar")
        .click(reloadButton)
        .expect(localInput.value).eql("Foobar")
        .click(clearButton)
        .click(reloadButton)
        .expect(localInput.value).eql("Foo")
})

test("Session storage", async t => {
    await t
        .expect(sessionInput.value).eql("Bar")
        .typeText(sessionInput, "bar")
        .click(reloadButton)
        .expect(sessionInput.value).eql("Barbar")
        .click(clearButton)
        .click(reloadButton)
        .expect(sessionInput.value).eql("Bar")
})

test("IndexedDB storage", async t => {
    await t
        .expect(indexedInput.value).eql("Hello")
        .typeText(indexedInput, " World")
        .click(reloadButton)
        .expect(indexedInput.value).eql("Hello World")
        .click(clearButton)
        .click(reloadButton)
        .expect(indexedInput.value).eql("Hello")
})