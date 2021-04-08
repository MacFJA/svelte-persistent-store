# Create new storage

New storages can be added. They need to implement the interface `StorageInterface<T>`.

This interface expose all method needed by the store to persist data.

The interface `SelfUpdateStorageInterface<T>` allow to have a storage with value that can change from outside the application.

## Storage `StorageInterface<T>`

The only particularity in this interface, the method `StorageInterface.getValue` **MUST** be synchronous.

## Storage `SelfUpdateStorageInterface<T>`

The method `SelfUpdateStorageInterface.addListener` take as parameter a function that must be call every time the storage is updated (by an external source).  
This function take one parameter, the key that have been changed.  
The store will call the `StorageInterface.getValue` to get the new value