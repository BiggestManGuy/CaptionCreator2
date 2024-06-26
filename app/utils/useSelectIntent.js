import { useRef, useCallback } from 'react';

/**
 * Hook for determining if the user *really* selected an element.
 * The event must've started from one of the target elements (not bubbled up).
 * @param {Function} onSelect - Callback on select.
 * @returns {Function} A ref callback to attach to any target elements.
 */
export default onSelect => {
  const targets = useRef([]);
  const shouldDispatchEvent = useRef(false);

  const onEventStart = evt => {
    shouldDispatchEvent.current =
      evt.button === 0 && targets.current.includes(evt.target);
  };

  const onEventEnd = evt => {
    if (shouldDispatchEvent.current) {
      onSelect(evt);
    }
  };

  return useCallback(ref => {
    if (ref) {
      targets.current.push(ref);

      ref.addEventListener('mousedown', onEventStart);
      ref.addEventListener('touchstart', onEventStart);
      ref.addEventListener('mouseup', onEventEnd);
      ref.addEventListener('touchend', onEventEnd);
    }
  }, []);
};
