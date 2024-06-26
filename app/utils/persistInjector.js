import { identity, noop, omit, debounce } from 'lodash';
import { compose } from 'redux';

import checkStore from './checkStore';
import MultiStorage from './MultiStorage';
import { injectReducerFactory } from './reducerInjectors';

export const PREPARE_LOAD = '@@persistor/PREPARE_LOAD';
export const LOAD = '@@persistor/LOAD';

export function prepareLoadAction(key) {
  return {
    type: `${PREPARE_LOAD}/${key}`,
  };
}

export function loadAction(key, state) {
  return {
    type: `${LOAD}/${key}`,
    state,
  };
}

export function makePersistReducer(key, reducer) {
  const prepareLoad = prepareLoadAction(key);
  const load = loadAction(key);

  return function persistReducer(state, action) {
    switch (action.type) {
      case prepareLoad.type:
        return Object.assign({}, state, { _loaded: false });
      case load.type:
        return Object.assign({}, state, action.state, { _loaded: true });
      default:
        return reducer(state, action);
    }
  };
}

export function runMigrations(state, migrations) {
  const currentVer = state._migrationVer || 0; // eslint-disable-line no-underscore-dangle
  const migrationsToRun = migrations.slice(currentVer, migrations.length);

  return migrationsToRun.reduce(
    (migratedState, migration, index) =>
      Object.assign(migration(migratedState), {
        _migrationVer: currentVer + index + 1,
      }),
    state,
  );
}

export function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

export function injectPersistFactory(store, isValid) {
  const injectReducer = injectReducerFactory(store, isValid);

  return function injectPersist(
    key,
    {
      reducer,
      blacklist = [],
      migrations = [],
      serialize = identity,
      rehydrate = identity,
      storage = new MultiStorage({ prefix: key }),
    },
  ) {
    if (!isValid) checkStore(store);

    if (
      Reflect.has(store.persistedReducers, key) &&
      store.persistedReducers[key] === reducer
    )
      return noop;

    // eslint-disable-next-line no-param-reassign
    store.persistedReducers[key] = reducer;

    const persistReducer = makePersistReducer(key, reducer);
    injectReducer(key, persistReducer);

    const serializer = compose(
      serialize,
      state => omit(state, [...blacklist, '_loaded']),
    );

    const rehydrator = compose(
      state => runMigrations(state, migrations),
      state => Object.assign({}, reducer(undefined, { type: null }), state),
      rehydrate,
    );

    const serializeState = debounce(state => {
      storage.set(key, serializer(state));
    }, 1000);

    let rehydrated = false;

    (async () => {
      await storage.ready;
      const state = await storage.get(key);
      store.dispatch(loadAction(key, rehydrator(state)));
      rehydrated = true;
    })();

    storage.on('before:load', () => {
      store.dispatch(prepareLoadAction(key));
    });

    storage.on('load', async () => {
      const data = await storage.get(key);
      store.dispatch(loadAction(key, rehydrator(data)));
    });

    storage.on('before:reset', () => {
      store.dispatch(prepareLoadAction(key));
    });

    storage.on('reset', () => {
      // Load with default state.
      store.dispatch(loadAction(key, reducer(undefined, { type: null })));
    });

    return observeStore(
      store,
      state => state[key],
      subState => {
        // We must make sure the store is rehydrated from storage first,
        // there's potential to overwrite it with default values otherwise.
        if (rehydrated) serializeState(subState);
      },
    );
  };
}

export default function getInjectors(store) {
  checkStore(store);

  return {
    injectPersist: injectPersistFactory(store, true),
  };
}
