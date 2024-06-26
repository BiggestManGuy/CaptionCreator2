import { flow } from 'lodash/fp';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import filterStyledProps from 'utils/filterStyledProps';
import colors from 'styles/colors';

import useDragAction from './useDragAction';

const scaleValue = value => props => props.scale * value;
const translateX = props => {
  if (props.left) return -100;
  if (props.right) return 0;
  return -50;
};
const translateY = props => {
  if (props.top) return -100;
  if (props.bottom) return 0;
  return -50;
};

const Handle = styled.div.withConfig(filterStyledProps(['scale']))`
  position: absolute;
  top: ${props => (props.top ? '0' : '')};
  top: ${props => (props.bottom ? '100%' : '')};
  top: ${props => (!props.top && !props.bottom ? '50%' : '')};
  left: ${props => (props.left ? '0' : '')};
  left: ${props => (props.right ? '100%' : '')};
  left: ${props => (!props.left && !props.right ? '50%' : '')};
  width: ${scaleValue(14)}px;
  height: ${scaleValue(14)}px;
  border: ${scaleValue(1)}px solid white;
  background: ${colors.secondary};
  transform: translateX(${translateX}%) translateY(${translateY}%);
  pointer-events: auto;
  cursor: ${props => {
    if ((props.top && props.left) || (props.bottom && props.right)) {
      return 'nwse-resize';
    }
    if ((props.top && props.right) || (props.bottom && props.left)) {
      return 'nesw-resize';
    }
    if (props.top || props.bottom) {
      return 'ns-resize';
    }
    if (props.left || props.right) {
      return 'ew-resize';
    }
    return 'auto';
  }};
`;

function SelectionBoxHandle({
  top = false,
  right = false,
  bottom = false,
  left = false,
  scale = 1,
  sensitivity = 1,
  onDrag = () => {},
  onDragStart = () => {},
}) {
  /**
   * Translates the absolute movement delta into one thats relative to the
   * handle position.
   * E.g. Dragging left-to-right from left handle vs from right means a decrease
   * or increase in size respectively.
   * @param {{ x: number, y: number }} deltas
   * @returns {{ x: number, y: number }}
   */
  const relativeDelta = ({ x: deltaX, y: deltaY }) => {
    let relX = 0;
    let relY = 0;

    if (top) relY = -deltaY;
    if (bottom) relY = deltaY;
    if (left) relX = -deltaX;
    if (right) relX = deltaX;

    return { x: relX, y: relY };
  };

  const startDrag = useDragAction({
    transform: flow(
      relativeDelta,
      ({ x, y }) => ({ x: x * scale, y: y * scale }),
    ),
    sensitivity,
    onDrag: (x, y) => onDrag(x, y, { top, bottom, left, right }),
    onDragStart,
  });

  return (
    <Handle
      {...{ top, right, bottom, left }}
      scale={scale}
      onMouseDown={startDrag}
    />
  );
}

SelectionBoxHandle.propTypes = {
  top: PropTypes.bool,
  right: PropTypes.bool,
  bottom: PropTypes.bool,
  left: PropTypes.bool,
  scale: PropTypes.number,
  sensitivity: PropTypes.number,
  onDrag: PropTypes.func,
  onDragStart: PropTypes.func,
};

export default SelectionBoxHandle;
