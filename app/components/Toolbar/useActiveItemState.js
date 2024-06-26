import { debounce } from 'lodash';
import { useState, useRef } from 'react';
import useUnmount from 'react-use/lib/useUnmount';

/**
 * Returns a wrapper function that invokes func only after waiting mininum of
 * wait milliseconds.
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
const minDelay = (func, wait = 1000) => {
  let waitElapsed = false;
  let fnAwaitingExecution = null;

  setTimeout(() => {
    waitElapsed = true;
    if (fnAwaitingExecution) fnAwaitingExecution();
  }, wait);

  return (...args) => {
    if (waitElapsed) func(...args);
    else fnAwaitingExecution = () => func(...args);
  };
};

/**
 * React hook to control the toolbar active item state.
 * @param {number} [wait=500]
 * @param {number} [minWait=0]
 * @return {[null|string, Function]}
 */
export default function useActiveItemState(wait = 500, minWait = 0) {
  const [activeItem, setActiveItem] = useState(null);

  const setActiveItemDebounced = useRef(debounce(setActiveItem, wait));
  const setActiveItemMinDelay = useRef(minDelay(setActiveItem, minWait));

  useUnmount(setActiveItemDebounced.current.cancel);

  return [
    activeItem,
    (newState, immediate = false) => {
      if (!immediate && !newState) {
        // If closing a dropdown, debounce it to leave a grace period where
        // it would still stay open.
        setActiveItemDebounced.current(newState);
      } else {
        // If opening a new dropdown, we want to reflect that immediately.
        // Any pending state changes are cleared.
        setActiveItemMinDelay.current(newState);
        setActiveItemDebounced.current.cancel();
      }
    },
  ];
}
