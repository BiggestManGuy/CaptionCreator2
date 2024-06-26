import _identity from 'lodash/identity';
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { ReactReduxContext } from 'react-redux';

import getInjectors from './persistInjector';

/**
 * Persists the reducer state (using localforage)
 *
 * @param {string} key - Key of the reducer.
 * @param {Function} reducer - Persisted reducer to be injected.
 * @param {Function[]} migrations - Array of migration functions where index = version.
 * @param {string[]} blacklist - List of keys to to exclude from storage.
 * @param {Function} serialize - Transforms the state to be serialized.
 * @param {Function} rehydrate - Transforms the state to be rehydrated.
 *
 */
export default ({
  key,
  reducer,
  blacklist = [],
  migrations = [],
  serialize = _identity,
  rehydrate = _identity,
}) => WrappedComponent => {
  class PersistInjector extends React.Component {
    static WrappedComponent = WrappedComponent;

    static contextType = ReactReduxContext;

    static displayName = `withPersist(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    constructor(props, context) {
      super(props, context);

      this.unsubscribe = getInjectors(context.store).injectPersist(key, {
        reducer,
        blacklist,
        migrations,
        serialize,
        rehydrate,
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(PersistInjector, WrappedComponent);
};

const useInjectPersistedReducer = ({
  key,
  reducer,
  blacklist = [],
  migrations = [],
  serialize = _identity,
  rehydrate = _identity,
  storage,
}) => {
  const { store } = React.useContext(ReactReduxContext);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(
    () =>
      getInjectors(store).injectPersist(key, {
        reducer,
        blacklist,
        migrations,
        serialize,
        rehydrate,
        storage,
      }),
    [],
  );

  // Watch for store to be rehydrated.
  // ! This relies on _loaded never being altered by some outside action.
  React.useEffect(() => {
    const checkLoaded = () => {
      const state = store.getState()[key];
      const currentlyLoaded = !!state && state._loaded;
      if (isLoaded !== currentlyLoaded) {
        setIsLoaded(currentlyLoaded);
      }
    };
    checkLoaded();
    return store.subscribe(checkLoaded);
  }, [isLoaded]);

  return isLoaded;
};

export { useInjectPersistedReducer };
