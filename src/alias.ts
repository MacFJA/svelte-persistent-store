import { writable as svelteWritable } from "svelte/store"
import type { Writable, StartStopNotifier } from "svelte/store"

import type { PersistentStore, StorageInterface } from "./core"
import { createCookieStorage, createLocalStorage, createSessionStorage, persist } from "./core"

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

/**
 * Create a standard Svelte store persisted in Browser LocalStorage
 * @param {string} key The key of the data to persist
 * @param {*} [initialValue] The initial data of the store
 * @param {StartStopNotifier<*>} [start] start and stop notifications for subscriptions
 * @return {PersistentStore<*>}
 */
export function localWritable<T>(key: string, initialValue?: T, start?: StartStopNotifier<T>): PersistentStore<T> {
  return persistBrowserLocal(svelteWritable(initialValue, start), key)
}
/**
 * Create a standard Svelte store persisted in Browser LocalStorage.
 * (Alias of [[localWritable]])
 * @param {string} key The key of the data to persist
 * @param {*} [initialValue] The initial data of the store
 * @param {StartStopNotifier<*>} [start] start and stop notifications for subscriptions
 * @return {PersistentStore<*>}
 */
export function writable<T>(key: string, initialValue?: T, start?: StartStopNotifier<T>): PersistentStore<T> {
  return localWritable(key, initialValue, start)
}
/**
 * Create a standard Svelte store persisted in Browser SessionStorage
 * @param {string} key The key of the data to persist
 * @param {*} [initialValue] The initial data of the store
 * @param {StartStopNotifier<*>} [start] start and stop notifications for subscriptions
 * @return {PersistentStore<*>}
 */
export function sessionWritable<T>(key: string, initialValue?: T, start?: StartStopNotifier<T>): PersistentStore<T> {
  return persistBrowserSession(svelteWritable(initialValue, start), key)
}
/**
 * Create a standard Svelte store persisted in cookie
 * @param {string} key The key of the data to persist
 * @param {*} [initialValue] The initial data of the store
 * @param {StartStopNotifier<*>} [start] start and stop notifications for subscriptions
 * @return {PersistentStore<*>}
 */
export function cookieWritable<T>(key: string, initialValue?: T, start?: StartStopNotifier<T>): PersistentStore<T> {
  return persistCookie(svelteWritable(initialValue, start), key)
}
