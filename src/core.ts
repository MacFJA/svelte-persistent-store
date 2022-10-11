import {
  serialize as defaultSerializer,
  deserialize as defaultDeserializer,
  addGlobalAllowedClass,
  type ClassDefinition,
} from "@macfja/serializer"
import { get as getCookie, set as setCookie, erase as removeCookie } from "browser-cookies"
import { get, set, createStore, del } from "idb-keyval"
import type { Writable } from "svelte/store"

/**
 * Disabled warnings about missing/unavailable storages
 */
export function disableWarnings(): void {
  noWarnings = true
}

/**
 * If set to true, no warning will be emitted if the requested Storage is not found.
 * This option can be useful when the lib is used on a server.
 */
let noWarnings = false

/**
 * List of storages where the warning have already been displayed.
 */
const alreadyWarnFor: Array<string> = []

const warnUser = (message) => {
  const isProduction = typeof process !== "undefined" && process.env?.NODE_ENV === "production"

  if (!noWarnings && alreadyWarnFor.indexOf(message) === -1 && !isProduction) {
    if (typeof window === "undefined") {
      message += "\n" + "Are you running on a server? Most of storages are not available while running on a server."
    }
    console.warn(message)
    alreadyWarnFor.push(message)
  }
}
/**
 * Add a log to indicate that the requested Storage have not been found.
 * @param {string} storageName
 */
const warnStorageNotFound = (storageName) => {
  warnUser(`Unable to find the ${storageName}. No data will be persisted.`)
}

/**
 * Add a class to the allowed list of classes to be serialized
 * @param classDef The class to add to the list
 */
export const addSerializableClass = (classDef: ClassDefinition<any>): void => {
  addSerializable(classDef)
}

/**
 * The function that will be used to serialize data
 * @internal
 * @private
 * @type {(data: any) => string}
 */
export let serialize = defaultSerializer
/**
 * The function that will be used to deserialize data
 * @internal
 * @private
 * @type {(input: string) => any}
 */
export let deserialize = defaultDeserializer
/**
 * The function used to add a class in the serializer allowed class
 * @type {(classConstructor: ClassDefinition<any>) => void}
 */
let addSerializable = addGlobalAllowedClass

/**
 * Set the serialization functions to use
 * @param {(data: any) => string} serializer The function to use to transform any data into a string
 * @param {(input: string) => any} deserializer The function to use to transform back string into the original data (reverse of the serializer)
 * @param {(classConstructor: ClassDefinition<any>) => void} [addSerializableClass] The function to use to add a class in the serializer/deserializer allowed class
 */
export function setSerialization(
  serializer: (data: any) => string,
  deserializer: (input: string) => any,
  addSerializableClass?: (classConstructor: ClassDefinition<any>) => void
): void {
  serialize = serializer
  deserialize = deserializer
  addSerializable =
    addSerializableClass ??
    (() => {
      return
    })
}

/**
 * A store that keep its value in time.
 */
export interface PersistentStore<T> extends Writable<T> {
  /**
   * Delete the store value from the persistent storage
   */
  delete(): void
}

/**
 * Storage interface
 */
export interface StorageInterface<T> {
  /**
   * Get a value from the storage.
   *
   * If the value doesn't exist in the storage, `null` should be returned.
   * This method MUST be synchronous.
   * @param key The key/name of the value to retrieve
   */
  getValue(key: string): T | null

  /**
   * Save a value in the storage.
   * @param key The key/name of the value to save
   * @param value The value to save
   */
  setValue(key: string, value: T): void

  /**
   * Remove a value from the storage
   * @param key The key/name of the value to remove
   */
  deleteValue(key: string): void
}

export interface SelfUpdateStorageInterface<T> extends StorageInterface<T> {
  /**
   * Add a listener to the storage values changes
   * @param {string} key The key to listen
   * @param {(newValue: T) => void} listener The listener callback function
   */
  addListener(key: string, listener: (newValue: T) => void): void
  /**
   * Remove a listener from the storage values changes
   * @param {string} key The key that was listened
   * @param {(newValue: T) => void} listener The listener callback function to remove
   */
  removeListener(key: string, listener: (newValue: T) => void): void
}

/**
 * Make a store persistent
 * @param {Writable<*>} store The store to enhance
 * @param {StorageInterface} storage The storage to use
 * @param {string} key The name of the data key
 */
export function persist<T>(store: Writable<T>, storage: StorageInterface<T>, key: string): PersistentStore<T> {
  const initialValue = storage.getValue(key)

  if (null !== initialValue) {
    store.set(initialValue)
  }

  if ((storage as SelfUpdateStorageInterface<T>).addListener) {
    ;(storage as SelfUpdateStorageInterface<T>).addListener(key, (newValue) => {
      store.set(newValue)
    })
  }

  store.subscribe((value) => {
    storage.setValue(key, value)
  })

  return {
    ...store,
    delete() {
      storage.deleteValue(key)
    },
  }
}

function noop() {
  return
}

/**
 * Create helper function to use asynchronous storage
 * @param {() => void} onFirst Function to run every time the number of listener goes from 0 to 1
 * @param {() => void} onEmptied Function to run every tie the number of listener goes from 1 to 0
 * @return {{callListeners: (eventKey: string, newValue: any) => void, addListener: (key: string, listener: (newValue: any) => void) => void, removeListener: (key: string, listener: (newValue: any) => void) => void}}
 */
function createListenerFunctions<T>(
  onFirst: () => void = noop,
  onEmptied: () => void = noop
): {
  callListeners: (eventKey: string, newValue: T) => void
  addListener: (key: string, listener: (newValue: T) => void) => void
  removeListener: (key: string, listener: (newValue: T) => void) => void
} {
  const listeners: Array<{ key: string; listener: (newValue: T) => void }> = []
  return {
    callListeners(eventKey: string, newValue: T) {
      if (newValue === undefined) {
        return
      }
      listeners.filter(({ key }) => key === eventKey).forEach(({ listener }) => listener(newValue))
    },
    addListener(key: string, listener: (newValue: any) => void) {
      listeners.push({ key, listener })
      if (listeners.length === 1) onFirst()
    },
    removeListener(key: string, listener: (newValue: any) => void) {
      const index = listeners.indexOf({ key, listener })
      if (index !== -1) {
        listeners.splice(index, 1)
      }
      if (listeners.length === 0) onEmptied()
    },
  }
}

const sharedCookieStorage = createCookieStorage(),
  sharedLocalStorage: StorageInterface<any> = createLocalStorage(),
  sharedSessionStorage: StorageInterface<any> = createSessionStorage()
/**
 * Persist a store into a cookie
 * @param {Writable<*>} store The store to enhance
 * @param {string} cookieName The name of the cookie
 */
export function persistCookie<T>(store: Writable<T>, cookieName: string): PersistentStore<T> {
  return persist(store, sharedCookieStorage, cookieName)
}
/**
 * Persist a store into the browser session storage
 * @param {Writable<*>} store The store to enhance
 * @param {string} key The name of the key in the browser session storage
 */
export function persistBrowserSession<T>(store: Writable<T>, key: string): PersistentStore<T> {
  return persist(store, sharedSessionStorage, key)
}
/**
 * Persist a store into the browser local storage
 * @param {Writable<*>} store The store to enhance
 * @param {string} key The name of the key in the browser local storage
 */
export function persistBrowserLocal<T>(store: Writable<T>, key: string): PersistentStore<T> {
  return persist(store, sharedLocalStorage, key)
}

function getBrowserStorage(browserStorage: Storage, listenExternalChanges = false): SelfUpdateStorageInterface<any> {
  const listenerFunction = (event: StorageEvent) => {
    const eventKey = event.key
    if (event.storageArea === browserStorage) {
      callListeners(eventKey, deserialize(event.newValue))
    }
  }
  const connect = () => {
    if (listenExternalChanges && typeof window !== "undefined" && window?.addEventListener) {
      window.addEventListener("storage", listenerFunction)
    }
  }
  const disconnect = () => {
    if (listenExternalChanges && typeof window !== "undefined" && window?.removeEventListener) {
      window.removeEventListener("storage", listenerFunction)
    }
  }
  const { removeListener, callListeners, addListener } = createListenerFunctions<any>(connect, disconnect)

  return {
    addListener,
    removeListener,
    getValue(key: string): any | null {
      const value = browserStorage.getItem(key)
      return deserialize(value)
    },
    deleteValue(key: string) {
      browserStorage.removeItem(key)
    },
    setValue(key: string, value: any) {
      browserStorage.setItem(key, serialize(value))
    },
  }
}

/**
 * Storage implementation that use the browser local storage
 * @param {boolean} listenExternalChanges Update the store if the localStorage is updated from another page
 */
export function createLocalStorage<T>(listenExternalChanges = false): StorageInterface<T> {
  if (typeof window !== "undefined" && window?.localStorage) {
    return getBrowserStorage(window.localStorage, listenExternalChanges)
  }
  warnStorageNotFound("window.localStorage")
  return createNoopStorage()
}

/**
 * Storage implementation that use the browser session storage
 * @param {boolean} listenExternalChanges Update the store if the sessionStorage is updated from another page
 */
export function createSessionStorage<T>(listenExternalChanges = false): StorageInterface<T> {
  if (typeof window !== "undefined" && window?.sessionStorage) {
    return getBrowserStorage(window.sessionStorage, listenExternalChanges)
  }
  warnStorageNotFound("window.sessionStorage")
  return createNoopStorage()
}

/**
 * Storage implementation that use the browser cookies
 */
export function createCookieStorage(): StorageInterface<any> {
  if (typeof document === "undefined" || typeof document?.cookie !== "string") {
    warnStorageNotFound("document.cookies")
    return createNoopStorage()
  }

  return {
    getValue(key: string): any | null {
      const value = getCookie(key)
      return deserialize(value)
    },
    deleteValue(key: string) {
      removeCookie(key, { samesite: "Strict" })
    },
    setValue(key: string, value: any) {
      setCookie(key, serialize(value), { samesite: "Strict" })
    },
  }
}

/**
 * Storage implementation that use the browser IndexedDB
 */
export function createIndexedDBStorage<T>(): SelfUpdateStorageInterface<T> {
  if (typeof indexedDB !== "object" || typeof window === "undefined" || typeof window?.indexedDB !== "object") {
    warnStorageNotFound("IndexedDB")
    return createNoopSelfUpdateStorage()
  }

  const { removeListener, callListeners, addListener } = createListenerFunctions<T>()
  const database = createStore("svelte-persist", "persist")
  return {
    addListener,
    removeListener,
    getValue(key: string): T | null {
      get(key, database).then((value) => callListeners(key, deserialize(value) as T))
      return null
    },
    setValue(key: string, value: T): void {
      set(key, serialize(value), database)
    },
    deleteValue(key: string): void {
      del(key, database)
    },
  }
}

export enum CHROME_STORAGE_TYPE {
  LOCAL,
  SESSION,
  SYNC,
}
export function createChromeStorage<T>(
  storageType: CHROME_STORAGE_TYPE = CHROME_STORAGE_TYPE.LOCAL,
  listenExternalChanges = false
): SelfUpdateStorageInterface<T> {
  if (typeof chrome !== "object" || typeof chrome.storage !== "object") {
    warnStorageNotFound("ChromeStorage")
    return createNoopSelfUpdateStorage()
  }

  let area = "local"
  switch (storageType) {
    case CHROME_STORAGE_TYPE.LOCAL:
      area = "local"
      break
    case CHROME_STORAGE_TYPE.SYNC:
      area = "sync"
      break
    case CHROME_STORAGE_TYPE.SESSION:
      area = "session"
      break
  }

  function externalChangesListener(changes: Record<string, { oldValue: T; newValue: T }>, areaName) {
    if (areaName !== area) return
    for (const [key, { newValue }] of Object.entries(changes)) {
      callListeners(key, newValue)
    }
  }

  const { removeListener, callListeners, addListener } = createListenerFunctions<T>(
    () => {
      if (listenExternalChanges) {
        chrome.storage.onChanged.addListener(externalChangesListener)
      }
    },
    () => {
      if (listenExternalChanges) {
        chrome.storage.onChanged.removeListener(externalChangesListener)
      }
    }
  )

  return {
    addListener,
    removeListener,
    getValue(key: string): T | null {
      chrome.storage[area].get([key], (result) => callListeners(key, result.key))
      return null
    },
    setValue(key: string, value: T): void {
      chrome.storage[area].set({ [key]: value })
    },
    deleteValue(key: string): void {
      chrome.storage[area].remove(key)
    },
  }
}

/**
 * Storage implementation that do nothing
 */
export function createNoopStorage(): StorageInterface<any> {
  return {
    getValue(): null {
      return null
    },
    deleteValue() {
      // Do nothing
    },
    setValue() {
      // Do nothing
    },
  }
}

function createNoopSelfUpdateStorage(): SelfUpdateStorageInterface<any> {
  return {
    addListener() {
      // Do nothing
    },
    removeListener() {
      // Do nothing
    },
    getValue(): null {
      return null
    },
    deleteValue() {
      // Do nothing
    },
    setValue() {
      // Do nothing
    },
  }
}
