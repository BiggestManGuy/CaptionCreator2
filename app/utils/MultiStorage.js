import EventEmitter from 'events';
import localforage from 'localforage';

const META_KEY_CURRENT = 'current';
const META_KEY_STORES = 'stores';

export default class MultiStorage extends EventEmitter {
  static DEFAULT_STORE = Symbol('DEFAULT_STORE');

  constructor({ name = window.location.hostname, prefix, config }) {
    super();

    this._name = name;
    this._prefix = prefix;
    this._config = config;

    this._stores = {
      [MultiStorage.DEFAULT_STORE]: localforage.createInstance({
        name,
        storeName: `${prefix}__store__default`,
        ...this._config,
      }),
    };

    this._meta = localforage.createInstance({
      name,
      storeName: `${prefix}__meta`,
    });

    this.ready = (async () => {
      const stores = await this._meta.getItem(META_KEY_STORES);
      if (stores === null) {
        // This is the first time loading the store.
        await this._meta.setItem(META_KEY_CURRENT, null);
        await this._meta.setItem(META_KEY_STORES, []);
      } else {
        // Init offline stores.
        stores.forEach(this._addStore.bind(this));
      }
    })();
  }

  _addStore(storeName) {
    this._stores[storeName] = localforage.createInstance({
      name: this._name,
      storeName: `${this._prefix}__store__[${storeName}]`,
      ...this._config,
    });
  }

  /**
   * Set the current store in use.
   * @param {string} [storeName]
   * @returns {Promise<void>}
   */
  async load(storeName) {
    if (!this._stores[storeName]) {
      throw new Error('Store does not exist');
    }

    this.emit('before:load', storeName);

    await this._meta.setItem(META_KEY_CURRENT, storeName);

    this.emit('load', storeName);
  }

  /**
   * Save data to a new store. Will override if already exists.
   * @param {string} storeName
   * @param {boolean} [setCurrent=true]
   * @returns {Promise<void>}
   */
  async save(storeName, setCurrent = true) {
    const keys = await this.getStores();
    let newKeys = keys;
    if (!keys.includes(storeName)) {
      newKeys = [...keys, storeName];
      await this._meta.setItem(META_KEY_STORES, newKeys);
    }

    this._addStore(storeName);

    const currentStore = await this.getCurrentStore();

    const data = {};
    await this._stores[currentStore].iterate((value, key) => {
      data[key] = value;
    });

    await Promise.all(
      Object.keys(data).map(async key => {
        await this._stores[storeName].setItem(key, data[key]);
      }),
    );

    if (setCurrent) {
      await this._meta.setItem(META_KEY_CURRENT, storeName);
    }

    this.emit('save', storeName, newKeys, setCurrent);
  }

  /**
   * Delete a store.
   * @param {string} storeName
   * @returns {Promise<void>}
   */
  async delete(storeName) {
    const stores = await this._meta.getItem(META_KEY_STORES);
    const newKeys = stores.filter(s => s !== storeName);

    await this._stores[storeName].dropInstance();
    delete this._stores[storeName];

    await this._meta.setItem(META_KEY_STORES, newKeys);

    this.emit('delete', storeName, newKeys);
  }

  /**
   * Reset to default store.
   * @returns {Promise<void>}
   */
  async reset() {
    this.emit('before:reset');

    await this._meta.setItem(META_KEY_CURRENT, null);
    await this._stores[MultiStorage.DEFAULT_STORE].clear();

    this.emit('reset');
  }

  /**
   * Get the current store.
   * @returns {Promise<string>}
   */
  async getCurrentStore() {
    return (
      (await this._meta.getItem(META_KEY_CURRENT)) || MultiStorage.DEFAULT_STORE
    );
  }

  /**
   * Get names of all saved stores.
   * @returns {Promise<string[]>}
   */
  async getStores() {
    return this._meta.getItem(META_KEY_STORES);
  }

  /**
   * Get data for current store.
   * @param {string} [key]
   * @returns {Promise<*>} - Store data.
   */
  async get(key) {
    const currentStore = await this.getCurrentStore();
    return this._stores[currentStore].getItem(key);
  }

  /**
   * Set data for current store.
   * @param {string} key
   * @param {*} data
   * @returns {Promise<void>}
   */
  async set(key, data) {
    const currentStore = await this.getCurrentStore();
    return this._stores[currentStore].setItem(key, data);
  }
}
