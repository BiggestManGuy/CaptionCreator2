/**
 *
 * SelectionBox
 *
 */

import { flow, clamp } from 'lodash/fp';
import ReactDOM from 'react-dom';
import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import SelectionBoxPortal, {
  SELECTION_BOX_PORTAL_ID,
} from './SelectionBoxPortal';
import SelectionBoxRegion from './SelectionBoxRegion';
import SelectionBoxHandle from './SelectionBoxHandle';

/**
 * Find element in sorted array that is within given bounds.
 * @param {number[]} array - Sorted array in ascending order.
 * @param {number} lower - Lower bounds.
 * @param {number} upper - Upper bounds.
 * @returns {number|null} - Element in array or null of none found.
 */
const sortedInRange = (array, lower, upper) => {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);

    if (lower <= array[mid] && upper >= array[mid]) {
      return array[mid];
    }

    if (lower < array[mid]) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }

  return null;
};

/**
 * Sets a value to a given bound if that value is within the threshold.
 * @curried
 * @param {number} threshold - Snap threshold.
 * @param {number[]} boundaries - Array of numbers is ascending order.
 * @param {number[]} offsets - Offsets to apply to val.
 * @param {number} val - Value to check.
 * @returns {number} - The value set to a matching bound, or the value if none.
 */
const snapTo = (threshold = 10) => (boundaries = []) => (
  offsets = [0],
) => val => {
  for (let i = 0; i < offsets.length; i += 1) {
    const offset = offsets[i];
    const lower = val + offset - threshold;
    const upper = val + offset + threshold;

    const snapPoint = sortedInRange(boundaries, lower, upper);
    if (snapPoint !== null) return snapPoint - offset;
  }

  return val;
};

function SelectionBox({
  isActive = false,
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  minX = 0,
  minY = 0,
  minWidth = 1,
  minHeight = 1,
  maxX = Infinity,
  maxY = Infinity,
  maxWidth = Infinity,
  maxHeight = Infinity,
  scale = 1,
  snapBoundariesX = [],
  snapBoundariesY = [],
  snapThreshold = 10,
  allowMove = true,
  allowResizeWidth = true,
  allowResizeHeight = true,
  realX = x,
  realY = y,
  onMove = () => {},
  onResize = () => {},
  children,
}) {
  // We need to track internal states before any transformations are applied.
  const deltaX = useRef(0);
  const deltaY = useRef(0);
  const deltaW = useRef(0);
  const deltaH = useRef(0);

  const snapToThreshold = snapTo(snapThreshold);

  const onRegionDragStart = () => {
    deltaX.current = 0;
    deltaY.current = 0;
  };

  // Moving the selection box.
  const onRegionDrag = (dX, dY) => {
    deltaX.current += dX;
    deltaY.current += dY;

    const newX = flow(
      snapToThreshold(snapBoundariesX)([0, width]),
      clamp(minX)(maxX),
    )(x + deltaX.current);

    const newY = flow(
      snapToThreshold(snapBoundariesY)([0, height]),
      clamp(minY)(maxY),
    )(y + deltaY.current);

    deltaX.current -= newX - x;
    deltaY.current -= newY - y;

    onMove(newX, newY);
  };

  const onHandleDragStart = () => {
    deltaW.current = 0;
    deltaH.current = 0;
  };

  // Resizing the selection box.
  const onHandleDrag = (dX, dY, anchor) => {
    deltaW.current += dX;
    deltaH.current += dY;

    let newX = x;
    let newY = y;
    let newW = clamp(minWidth)(maxWidth)(width + deltaW.current);
    let newH = clamp(minHeight)(maxHeight)(height + deltaH.current);

    // Origin is top-left of selection box. Resizing from the right and bottom
    // work as expected, however left and top need to also move the selection
    // to remain fixed while the size changes.
    // This also affects the snap behaviour as top and left need to snap based
    // on their new position.

    if (anchor.right) {
      newW = snapToThreshold(snapBoundariesX)([x])(newW);
    }
    if (anchor.left) {
      newX = flow(
        snapToThreshold(snapBoundariesX)(),
        clamp(minX)(maxX),
      )(x + (width - newW));
      newW = width + (x - newX);
    }

    if (anchor.bottom) {
      newH = snapToThreshold(snapBoundariesY)([y])(newH);
    }
    if (anchor.top) {
      newY = flow(
        snapToThreshold(snapBoundariesY)(),
        clamp(minY)(maxY),
      )(y + (height - newH));
      newH = height + (y - newY);
    }

    deltaW.current -= newW - width;
    deltaH.current -= newH - height;

    onMove(newX, newY);
    onResize(newW, newH);
  };

  const getHandleAnchors = () => {
    const anchors = [];

    if (allowResizeWidth) {
      anchors.push({ right: true }, { left: true });
    }
    if (allowResizeHeight) {
      anchors.push({ top: true }, { bottom: true });
    }
    if (allowResizeWidth && allowResizeHeight) {
      anchors.push(
        { top: true, left: true },
        { top: true, right: true },
        { bottom: true, right: true },
        { bottom: true, left: true },
      );
    }

    return anchors;
  };

  return (
    <>
      {isActive &&
        ReactDOM.createPortal(
          <SelectionBoxRegion
            x={realX}
            y={realY}
            width={width}
            height={height}
            scale={scale}
            allowMove={allowMove}
            onDrag={onRegionDrag}
            onDragStart={onRegionDragStart}
          >
            {getHandleAnchors().map(anchor => (
              <SelectionBoxHandle
                {...anchor}
                key={Object.keys(anchor)}
                scale={scale}
                onDrag={onHandleDrag}
                onDragStart={onHandleDragStart}
              />
            ))}
          </SelectionBoxRegion>,
          document.getElementById(SELECTION_BOX_PORTAL_ID) || document.body,
        )}
      {children}
    </>
  );
}

SelectionBox.propTypes = {
  isActive: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  minX: PropTypes.number,
  minY: PropTypes.number,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxX: PropTypes.number,
  maxY: PropTypes.number,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  scale: PropTypes.number,
  snapBoundariesX: PropTypes.arrayOf(PropTypes.number),
  snapBoundariesY: PropTypes.arrayOf(PropTypes.number),
  snapThreshold: PropTypes.number,
  allowMove: PropTypes.bool,
  allowResizeWidth: PropTypes.bool,
  allowResizeHeight: PropTypes.bool,
  realX: PropTypes.number,
  realY: PropTypes.number,
  onMove: PropTypes.func,
  onResize: PropTypes.func,
  children: PropTypes.node,
};

export { SelectionBoxPortal };
export default memo(SelectionBox);
