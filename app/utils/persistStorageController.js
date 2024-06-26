import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import MultiStorage from 'utils/MultiStorage';

function createPersistStorageController({
  name,
  api: {
    currentStoreKey = 'currentStore',
    storesKey = 'stores',
    saveKey = 'save',
    loadKey = 'load',
    deleteKey = 'delete',
    resetKey = 'reset',
  } = {},
}) {
  const Storage = new MultiStorage({ prefix: name });

  const Context = React.createContext({
    [storesKey]: [],
    [saveKey]: () => {},
    [loadKey]: () => {},
    [deleteKey]: () => {},
    [resetKey]: () => {},
  });

  function PersistStorageController({ children }) {
    const [currentStore, setCurrentStore] = useState(null);
    const [stores, setStores] = useState([]);

    // Populate store values on mount.
    useEffect(() => {
      (async () => {
        await Storage.ready;

        const initStores = await Storage.getStores();
        const initCurrentStore = await Storage.getCurrentStore();

        setStores(initStores);
        if (initCurrentStore !== MultiStorage.DEFAULT_STORE) {
          setCurrentStore(initCurrentStore);
        }
      })();
    }, []);

    const api = useMemo(
      () => ({
        [currentStoreKey]: currentStore,
        [storesKey]: stores,
        [saveKey]: async store => {
          await Storage.save(store);
          setCurrentStore(store);
          if (!stores.includes(store)) {
            setStores([...stores, store]);
          }
        },
        [loadKey]: async store => {
          await Storage.load(store);
          setCurrentStore(store);
        },
        [deleteKey]: async store => {
          await Storage.delete(store);
          setStores(stores.filter(s => s !== store));
        },
        [resetKey]: async () => {
          await Storage.reset();
          setCurrentStore(null);
        },
      }),
      [currentStore, stores],
    );

    return <Context.Provider value={api}>{children}</Context.Provider>;
  }

  PersistStorageController.propTypes = {
    children: PropTypes.node,
  };

  return {
    PersistStorageController,
    Context,
    Storage,
  };
}

export default createPersistStorageController;
