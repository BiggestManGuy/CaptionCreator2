import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import filterStyledProps from 'utils/filterStyledProps';
import colors from 'styles/colors';

import useDragAction from './useDragAction';

const scaleValue = value => props => props.scale * value;

const Region = styled.div
  .withConfig(filterStyledProps(['width', 'height', 'x', 'y', 'scale']))
  .attrs(props => ({
    style: {
      width: props.width,
      height: props.height,
      top: props.y,
      left: props.x,
    },
  }))`
  position: absolute;
  box-shadow: 0 0 0 ${scaleValue(1)}px white,
    0 0 0 ${scaleValue(3)}px ${colors.secondary}, 0 0 0 ${scaleValue(
  4,
)}px white;
  pointer-events: ${props => (props.allowMove ? 'auto' : 'none')};
  cursor: ${props => (props.allowMove ? 'move' : 'auto')};
  z-index: 999;
`;

function SelectionBoxRegion({
  x,
  y,
  width,
  height,
  scale = 1,
  allowMove = true,
  sensitivity = 1,
  onDrag = () => {},
  onDragStart = () => {},
  children,
}) {
  const startDrag = useDragAction({
    sensitivity,
    transform: ({ x: dX, y: dY }) => ({ x: dX * scale, y: dY * scale }),
    onDrag,
    onDragStart,
  });

  return (
    <Region
      x={x}
      y={y}
      width={width}
      height={height}
      scale={scale}
      allowMove={allowMove}
      onMouseDown={evt => {
        if (evt.target === evt.currentTarget) startDrag(evt);
      }}
    >
      {children}
    </Region>
  );
}

SelectionBoxRegion.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  scale: PropTypes.number,
  allowMove: PropTypes.bool,
  sensitivity: PropTypes.number,
  onDrag: PropTypes.func,
  onDragStart: PropTypes.func,
  children: PropTypes.node,
};

export default SelectionBoxRegion;
