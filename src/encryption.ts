import toHex from "sjcl-codec-hex/from-bits"
import fromHex from "sjcl-codec-hex/to-bits"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sjcl from "sjcl-es"

import { deserialize, serialize } from "./core"
import type { StorageInterface } from "./core"

/**
 * The behavior when no encryption library is available when requesting an encrypted storage
 * @deprecated
 */
export enum NO_ENCRYPTION_BEHAVIOR {
  /**
   * Throw an exception
   */
  EXCEPTION = 0,
  /**
   * Use the wrapped Storage as-is
   */
  NO_ENCRYPTION = 1,
  /**
   * Don't use any storage, so no not encrypted data will be persisted
   */
  NO_STORAGE = 2,
}

/**
 * Set the behavior when no encryption library is available when requesting an encrypted storage
 * @deprecated
 * @param behavior
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function noEncryptionBehavior(behavior: NO_ENCRYPTION_BEHAVIOR): void {
  // Do nothing
}

/**
 * The encryption interface
 */
export interface Encryption {
  /**
   * Hash the input data
   * @param {string} data The data to hash
   * @return {string} The hashed data
   */
  hash: (data: string) => string
  /**
   * Encrypt the input data.
   *
   * Must be reversible with `decrypt` function.
   * @param {string} data The data to encrypt
   * @return {string} The encrypted data
   */
  encrypt: (data: string) => string
  /**
   * Decrypt the input data.
   *
   * Must be reversible with `encrypt` function.
   * @param {string} data The data to decrypt
   * @return {string} The decrypted data
   */
  decrypt: (data: string) => string
}

/**
 * Encryption implementation with AES-256-GCM
 */
export class GCMEncryption implements Encryption {
  /**
   * The AES cipher to use for hashing, encrypting and decrypting
   * @private
   */
  private readonly cipher

  /**
   * The GCM Encryption constructor
   * @param {string} encryptionKey The HEX key to use for encryption
   */
  constructor(encryptionKey: string) {
    this.cipher = new sjcl.cipher.aes(fromHex(encryptionKey))
  }

  /**
   * Encrypt the input data.
   *
   * @param {string} data The data to encrypt
   * @param {string} [iv] The IV to use during the encryption (default to "sps")
   * @return {string} The encrypted data
   */
  encrypt(data: string, iv?: string | undefined): string {
    if (!iv) iv = "sps"
    const encodedIv = sjcl.codec.utf8String.toBits(iv)
    return (
      toHex(sjcl.mode.gcm.encrypt(this.cipher, sjcl.codec.utf8String.toBits(data), encodedIv, [], 256)) +
      ":" +
      toHex(encodedIv)
    )
  }

  /**
   * Encrypt the input data.
   *
   * The IV is extracted from the encrypted data.
   *
   * @param {string} data The data to decrypt
   * @return {string} The decrypted data
   */
  decrypt(data: string): string {
    return sjcl.codec.utf8String.fromBits(
      sjcl.mode.gcm.decrypt(this.cipher, fromHex(data.split(":")[0]), fromHex(data.split(":")[1]))
    )
  }

  /**
   * Hash the input data.
   *
   * Use the encrypt function with the IV set to "sps"
   *
   * @param {string} data The data to hash
   * @return {string} The hashed data
   */
  hash(data: string): string {
    return this.encrypt(data, "sps")
  }
}

/**
 * Add encryption layer on a storage
 * @deprecated Use createEncryptionStorage instead
 * @param wrapped The storage to enhance
 * @param encryptionKey The encryption key to use on key and data
 */
export function createEncryptedStorage<T>(
  wrapped: StorageInterface<string>,
  encryptionKey: string
): StorageInterface<T> {
  const encryption = new GCMEncryption(encryptionKey)
  return createEncryptionStorage(wrapped, encryption)
}

/**
 * Add encryption layer on a storage
 * @param wrapped The storage to enhance
 * @param encryption The encryption to use on key and data
 */
export function createEncryptionStorage<T>(
  wrapped: StorageInterface<string>,
  encryption: Encryption
): StorageInterface<T> {
  return {
    getValue(key: string): T | null {
      const encryptedKey = encryption.hash(key)
      const storageValue = wrapped.getValue(encryptedKey)
      if (storageValue === null) return null
      return deserialize(encryption.decrypt(storageValue))
    },
    setValue(key: string, value: T): void {
      const encryptedKey = encryption.hash(key)
      const encryptedValue = encryption.encrypt(serialize(value))
      wrapped.setValue(encryptedKey, encryptedValue)
    },
    deleteValue(key: string): void {
      const encryptedKey = encryption.hash(key)
      wrapped.deleteValue(encryptedKey)
    },
  }
}
