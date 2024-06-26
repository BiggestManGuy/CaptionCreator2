import { noop, identity } from 'lodash';
import { useCallback, useRef } from 'react';
import useEvent from 'react-use/lib/useEvent';

export default function useDragAction({
  sensitivity = 1,
  transform = identity,
  onDrag = noop,
  onDragStart = noop,
}) {
  const isDragging = useRef(false);
  const prevCoords = useRef({ x: null, y: null });
  const transformRef = useRef(transform);
  const onDragRef = useRef(onDrag);

  // Store reference to function for global event handler performance.
  transformRef.current = transform;
  onDragRef.current = onDrag;

  const onMouseMove = useCallback(evt => {
    if (isDragging.current) {
      const { clientX, clientY } = evt;

      const { x: deltaX, y: deltaY } = transformRef.current({
        x: clientX - prevCoords.current.x,
        y: clientY - prevCoords.current.y,
      });

      const xThreshold = Math.abs(deltaX) >= sensitivity;
      const yThreshold = Math.abs(deltaY) >= sensitivity;

      if (xThreshold) {
        prevCoords.current.x = clientX;
      }

      if (yThreshold) {
        prevCoords.current.y = clientY;
      }

      if (xThreshold || yThreshold) {
        onDragRef.current(deltaX, deltaY);
      }
    }
  }, []);

  const onDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEvent('mousemove', onMouseMove, window, { passive: true });
  useEvent('mouseup', onDragEnd);
  useEvent('mouseleave', onDragEnd);

  return useCallback(
    evt => {
      if (evt.button === 0) {
        evt.preventDefault();

        prevCoords.current.x = evt.clientX;
        prevCoords.current.y = evt.clientY;

        isDragging.current = true;

        onDragStart();
      }
    },
    [onDragStart],
  );
}
