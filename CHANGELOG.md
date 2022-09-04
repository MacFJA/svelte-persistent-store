# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New storage `createChromeStorage` for Chrome Extension

### Fixed

- Change compilation (remove all `require` in ES build) ([Issue#23])
- Better detection of unavailable Crypto capacity
- (dev) Don't allow Testcafe 1.20.* versions

### Changed

- (dev) Use shorthand persist function in test
- (dev) Refactoring of the listeners' creation/usage functions

## [2.0.0]

### Added

- New alias for persisting into Browser local storage (`persistBrowserLocal`)
- New alias for persisting into Browser session storage (`persistBrowserSession`)
- New alias for persisting into cookie storage (`persistCookie`)
- New storage (wrapper) `createEncryptedStorage` ([Issue#21])
- Add basic type definitions in README ([Issue#19])

### Changed

- Change name of functions that create storage
- Change the data serializer ([Issue#18], [Issue#20])
- (dev) New lib to generate documentation
- (dev) Validate code style on configuration files

### Removed

- `noopStorage()` use `createNoopStorage()` instead
- `localStorage()` use `createLocalStorage()` instead
- `sessionStorage()` use `createSessionStorage()` instead
- `indexedDBStorage()` use `createIndexedDBStorage()` instead

## [1.3.0]

### Added

- Possibility to disable console warnings ([Issue#9])
- `undefined` value not handled ([Issue#11])

### Changed

- Change how data are serialized/deserialized to handle class

### Fixed

- Classes can't be persisted

## [1.2.0]

### Changed

- Changed the Cookie lib to be able to set `SameSite` ([Issue#7], [PR#8])
- (DEV) Update the dependencies

## [1.1.1]

### Fixed

- SyntaxError when the value can't be parsed as a JSON ([Issue#3])

### Changed

- Update (dev) dependencies version

## [1.1.0]

### Added

- Add external change listener for SessionStorage and LocalStorage
- Add documentation
- Add IndexedDB Storage

## [1.0.2]

### Fixed

- Add protection on global `document` variable

## [1.0.1]

### Added

- Add `noop` Storage that do nothing

### Fixed

- Add protection on global `window` variable

## [1.0.0]

First version

[Unreleased]: https://github.com/MacFJA/svelte-persistent-store/compare/2.0.0...HEAD
[2.0.0]: https://github.com/MacFJA/svelte-persistent-store/compare/1.3.0...2.0.0
[1.3.0]: https://github.com/MacFJA/svelte-persistent-store/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/MacFJA/svelte-persistent-store/compare/1.1.1...1.2.0
[1.1.1]: https://github.com/MacFJA/svelte-persistent-store/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/MacFJA/svelte-persistent-store/compare/1.0.2...1.1.0
[1.0.2]: https://github.com/MacFJA/svelte-persistent-store/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/MacFJA/svelte-persistent-store/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/MacFJA/svelte-persistent-store/releases/tag/1.0.0

[Issue#3]: https://github.com/MacFJA/svelte-persistent-store/issues/3
[Issue#7]: https://github.com/MacFJA/svelte-persistent-store/issues/7
[Issue#9]: https://github.com/MacFJA/svelte-persistent-store/issues/9
[Issue#11]: https://github.com/MacFJA/svelte-persistent-store/issues/11
[Issue#18]: https://github.com/MacFJA/svelte-persistent-store/issues/18
[Issue#19]: https://github.com/MacFJA/svelte-persistent-store/issues/19
[Issue#20]: https://github.com/MacFJA/svelte-persistent-store/issues/20
[Issue#21]: https://github.com/MacFJA/svelte-persistent-store/issues/21
[Issue#23]: https://github.com/MacFJA/svelte-persistent-store/issues/23
[PR#8]: https://github.com/MacFJA/svelte-persistent-store/pull/8
