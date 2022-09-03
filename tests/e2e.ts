import { Selector } from "testcafe"

fixture("Svelte Persistent Storage")
    .page("http://localhost:5000")

const cookieInput = Selector("#cookieInput"),
    localInput = Selector("#localInput"),
    sessionInput = Selector("#sessionInput"),
    indexedInput = Selector("#indexedInput"),
    documentCookie = Selector("#documentCookie"),
    undefinedValue = Selector("#undefinedTest code"),
    undefinedType = Selector("#undefinedTest var"),
    undefinedValue2 = Selector("#undefinedTest2 code"),
    undefinedType2 = Selector("#undefinedTest2 var"),
    undefinedValue3 = Selector("#undefinedTest3 code"),
    undefinedType3 = Selector("#undefinedTest3 var"),
    arrayValue = Selector("#arrayTest code"),
    arrayType = Selector("#arrayTest var"),
    arrayButton = Selector("#arrayTest button"),
    objectValue = Selector("#objectTest code"),
    objectType = Selector("#objectTest var"),
    objectButton = Selector("#objectTest button"),
    nullValue = Selector("#nullTest code"),
    nullType = Selector("#nullTest var"),
    nullValue2 = Selector("#nullTest2 code"),
    nullType2 = Selector("#nullTest2 var"),
    nullValue3 = Selector("#nullTest3 code"),
    nullType3 = Selector("#nullTest3 var"),
    classValue = Selector("#classValue"),
    className = Selector("#className"),
    classButton = Selector("#classButton"),
    storageValue = Selector("#storageValue"),
    storageRawValue = Selector("#storageRawValue"),
    storageJSONButton = Selector("#storageJSONButton"),
    storageSerializerButton = Selector("#storageSerializerButton"),
    reloadButton = Selector("#reloadButton"),
    clearButton = Selector("#clearButton")

test("Initial state", async t => {
    await t
        .click(storageSerializerButton)
        .click(clearButton)
        .click(reloadButton)
        .expect(cookieInput.value).eql("John")
        .expect(localInput.value).eql("Foo")
        .expect(sessionInput.value).eql("Bar")
        .expect(indexedInput.value).eql("Hello")
        .expect(documentCookie.textContent).contains("sps-userName=%22John%22")
        .expect(undefinedValue.textContent).eql("undefined")
        .expect(undefinedType.textContent).eql("undefined")
        .expect(undefinedValue2.textContent).eql("undefined")
        .expect(undefinedType2.textContent).eql("undefined")
        .expect(undefinedValue3.textContent).eql("undefined")
        .expect(undefinedType3.textContent).eql("undefined")
        .expect(arrayValue.textContent).eql("1,2,3")
        .expect(arrayType.textContent).eql("object")
        .expect(objectValue.textContent).eql("[object Object]")
        .expect(objectType.textContent).eql("object")
        .expect(nullValue.textContent).eql("null")
        .expect(nullType.textContent).eql("object")
        .expect(nullValue2.textContent).eql("null")
        .expect(nullType2.textContent).eql("object")
        .expect(nullValue3.textContent).eql("null")
        .expect(nullType3.textContent).eql("object")
        .expect(classValue.textContent).eql("John")
        .expect(className.textContent).eql("NameHolder")
        .expect(storageValue.textContent).eql("{\"foo\":\"bar\",\"baz\":{\"hello\":\"world\",\"foobar\":[1,2,3]}}")
        .expect(storageRawValue.textContent).eql("{\"foo\":\"bar\",\"baz\":{\"hello\":\"world\",\"foobar\":[\"#$@__reference__2\",1,2,3],\"#$@__reference__\":1},\"#$@__reference__\":0}")
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

test("Undefined value in storage", async t => {
    await t
        .click(reloadButton)
        .expect(undefinedValue.textContent).eql("undefined")
        .expect(undefinedType.textContent).eql("undefined")
        .expect(undefinedValue2.textContent).eql("undefined")
        .expect(undefinedType2.textContent).eql("undefined")
        .expect(undefinedValue3.textContent).eql("undefined")
        .expect(undefinedType3.textContent).eql("undefined")
})

test("Null value in storage", async t => {
    await t
        .click(reloadButton)
        .expect(nullValue.textContent).eql("null")
        .expect(nullType.textContent).eql("object")
        .expect(nullValue2.textContent).eql("null")
        .expect(nullType2.textContent).eql("object")
        .expect(nullValue3.textContent).eql("null")
        .expect(nullType3.textContent).eql("object")
})

test("Array value in storage", async t => {
    await t
        .click(reloadButton)
        .expect(arrayValue.textContent).eql("1,2,3")
        .expect(arrayType.textContent).eql("object")
        .click(arrayButton)
        .expect(arrayValue.textContent).eql("1,2,3,4")
        .expect(arrayType.textContent).eql("object")
        .click(clearButton)
        .click(reloadButton)
        .expect(arrayValue.textContent).eql("1,2,3")
        .expect(arrayType.textContent).eql("object")
})

test("Object value in storage", async t => {
    await t
        .click(reloadButton)
        .expect(objectValue.textContent).eql("[object Object]")
        .expect(objectType.textContent).eql("object")
        .click(objectButton)
        .expect(objectValue.textContent).eql("[object Object]")
        .expect(objectType.textContent).eql("object")
        .click(clearButton)
        .click(reloadButton)
        .expect(objectValue.textContent).eql("[object Object]")
        .expect(objectType.textContent).eql("object")
})

test("Class transform", async t => {
    await t
        .expect(classValue.textContent).eql("John")
        .expect(className.textContent).eql("NameHolder")
        .click(classButton)
        .expect(classValue.textContent).eql("Jeanne")
        .expect(className.textContent).eql("NameHolder")
        .click(reloadButton)
        .expect(classValue.textContent).eql("Jeanne")
        .expect(className.textContent).eql("NameHolder")
        .click(clearButton)
        .click(reloadButton)
        .expect(classValue.textContent).eql("John")
        .expect(className.textContent).eql("NameHolder")
})

test("Serialization functions", async t => {
    await t
        .expect(storageValue.textContent).eql("{\"foo\":\"bar\",\"baz\":{\"hello\":\"world\",\"foobar\":[1,2,3]}}")
        .expect(storageRawValue.textContent).eql("{\"foo\":\"bar\",\"baz\":{\"hello\":\"world\",\"foobar\":[\"#$@__reference__2\",1,2,3],\"#$@__reference__\":1},\"#$@__reference__\":0}")
        .click(storageJSONButton)
        .expect(storageValue.textContent).eql("{\"foo\":\"bar\",\"baz\":{\"hello\":\"world\",\"foobar\":[1,2,3]}}")
        .expect(storageRawValue.textContent).eql("{\"foo\":\"bar\",\"baz\":{\"hello\":\"world\",\"foobar\":[1,2,3]}}")
        .click(storageSerializerButton)
        .expect(storageValue.textContent).eql("{\"foo\":\"bar\",\"baz\":{\"hello\":\"world\",\"foobar\":[1,2,3]}}")
        .expect(storageRawValue.textContent).eql("{\"foo\":\"bar\",\"baz\":{\"hello\":\"world\",\"foobar\":[\"#$@__reference__2\",1,2,3],\"#$@__reference__\":1},\"#$@__reference__\":0}")
})
