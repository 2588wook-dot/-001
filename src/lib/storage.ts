/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class IndexedDBStore {
  private dbName = 'dwg_portfolio_db';
  private storeName = 'projects_store';
  private version = 1;

  private getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result !== undefined ? request.result as T : null);
      });
    } catch (e) {
      console.error('IndexedDB get error, falling back to localStorage', e);
      const val = localStorage.getItem(key);
      try {
        return val ? JSON.parse(val) as T : null;
      } catch {
        return null;
      }
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(value, key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (e) {
      console.error('IndexedDB set error, falling back to localStorage', e);
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error('LocalStorage also failed:', err);
        throw err;
      }
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (e) {
      console.error('IndexedDB delete error, falling back to localStorage', e);
      localStorage.removeItem(key);
    }
  }
}

export const storage = new IndexedDBStore();
