# Create a new asynchronous storage 

There is a workaround (trickery) to work with asynchronous data storage.
(Remember, `StorageInterface.getValue` should synchronously return a value)

The idea is to use the `SelfUpdateStorageInterface` interface to deliver the value when it finally arrived.

The `IndexedDBStorage` use this workaround.

## Quick example

```js
function myStorage<T>(): SelfUpdateStorageInterface<T> {
    const listeners: Array<{key: string, listener: (newValue: T) => void}> = []
    const listenerFunction = (eventKey: string, newValue: T) => {
        listeners
            .filter(({key}) => key === eventKey)
            .forEach(({listener}) => listener(newValue))
    }
    return {
        getValue(key: string): T | null {
            readRealStorageWithPromise(key).then(value => listenerFunction(key, value))
            return null // Tell the store to use current decorated store value
        },
        // ... addListener, removeListener, setValue, deleteValue
    }
}
```