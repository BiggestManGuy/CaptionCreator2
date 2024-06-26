export const REDUCER_RESET = '@@REDUCER_RESET';

export function resetReducer(group) {
  return {
    type: REDUCER_RESET,
    group,
  };
}

/**
 * Wraps a reducer and listens for a reset action in which it sets the state to
 * undefined.
 * @param {function} reducer
 * @param {string} [group] - Optional group name: If action is dispatched with
 *                           this name, it will reset only this reducer.
 * @returns {function}
 */
export default (reducer, group) => (state, action) => {
  if (action.type === REDUCER_RESET && group === action.group) {
    state = undefined; /* eslint-disable-line no-param-reassign */
  }

  return reducer(state, action);
};
