/**
 *
 * CaptionLayer
 *
 */

import isEqual from 'shallowequal';
import { flatMap, sortBy, omit } from 'lodash';
import React, { memo, useRef } from 'react';
import { usePrevious } from 'react-use';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import filterStyledProps from 'utils/filterStyledProps';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { toBackground } from 'components/BackgroundInput';
import SelectionBox from 'components/SelectionBox';
import FormattableArea from 'containers/CaptionFormats';

import { S_TOP, S_LEFT } from 'containers/CaptionFormats/constants';

import { makeSelectFormatBoxBounds } from 'containers/CaptionFormats/selectors';
import makeSelectLayers, {
  makeSelectLayerIDs,
  makeSelectLayerX,
  makeSelectLayerY,
  makeSelectLayerWidth,
  makeSelectLayerHeight,
  makeSelectLayerOrder,
  makeSelectLayerBackground,
  makeSelectIsActiveLayer,
  makeSelectLayerScale,
} from './selectors';
import {
  updateLayerWidth,
  updateLayerHeight,
  updateLayerX,
  updateLayerY,
} from './actions';

const Container = styled(FormattableArea)
  .withConfig(filterStyledProps(['x', 'y', 'width', 'height', 'zIndex'], true))
  .attrs(props => ({
    style: {
      top: props.y,
      left: props.x,
      width: props.width,
      height: props.height,
      zIndex: props.zIndex,
      background: toBackground(props.background),
    },
  }))`
  position: absolute;
  overflow: hidden;
`;

/**
 * Calculates the snap boundaries of a layer.
 * The boundaries are sorted to allow search optimisations.
 * @param {string} id - ID of layer.
 * @param {Object[]} layers - All layer objects.
 * @returns {{ x: number[], y: number[] }}
 */
const getSnapBoundaries = (id, layers) => {
  const otherLayers = layers.filter(layer => layer.id !== id);
  return {
    x: sortBy(flatMap(otherLayers, ({ x, width }) => [x, x + width])),
    y: sortBy(flatMap(otherLayers, ({ y, height }) => [y, y + height])),
  };
};

export function CaptionLayer({
  children,
  id,
  isActive = false,
  numLayers,
  x,
  y,
  width,
  height,
  order,
  background = {},
  scale = 1,
  xOffset = 0,
  yOffset = 0,
  layers = [],
  selectionBoxProps = {},
  onResize = () => {},
  onMove = () => {},
  ...props
}) {
  const wasActive = usePrevious(isActive);
  const snapBoundaries = useRef([]);

  // We only need to (re)calculate snap boundaries when the layer becomes
  // active i.e. when the user will be moving it around.
  if (!wasActive && isActive) {
    snapBoundaries.current = getSnapBoundaries(id, layers);
  }

  return (
    <SelectionBox
      isActive={isActive}
      x={x}
      y={y}
      width={width}
      height={height}
      scale={scale}
      snapBoundariesX={snapBoundaries.current.x}
      snapBoundariesY={snapBoundaries.current.y}
      realX={x + xOffset}
      realY={y + yOffset}
      onMove={onMove}
      onResize={onResize}
      {...selectionBoxProps}
    >
      <Container
        formatID={id}
        x={Math.round(x)}
        y={Math.round(y)}
        width={Math.round(width)}
        height={Math.round(height)}
        zIndex={numLayers - order}
        background={background}
        {...props}
      >
        {children}
      </Container>
    </SelectionBox>
  );
}

CaptionLayer.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  isActive: PropTypes.bool,
  numLayers: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  order: PropTypes.number,
  background: PropTypes.object,
  scale: PropTypes.number,
  xOffset: PropTypes.number,
  yOffset: PropTypes.number,
  layers: PropTypes.arrayOf(PropTypes.object),
  selectionBoxProps: PropTypes.object,
  onResize: PropTypes.func,
  onMove: PropTypes.func,
};

const makeMapStateToProps = () => {
  const selectIsActiveLayer = makeSelectIsActiveLayer();
  const selectLayerIDs = makeSelectLayerIDs();
  const selectLayerX = makeSelectLayerX();
  const selectLayerY = makeSelectLayerY();
  const selectLayerWidth = makeSelectLayerWidth();
  const selectLayerHeight = makeSelectLayerHeight();
  const selectLayerOrder = makeSelectLayerOrder();
  const selectLayerBackground = makeSelectLayerBackground();
  const selectXOffset = makeSelectFormatBoxBounds([S_LEFT]);
  const selectYOffset = makeSelectFormatBoxBounds([S_TOP]);
  const selectLayerScale = makeSelectLayerScale();
  const selectLayers = makeSelectLayers();

  return (state, { id }) => ({
    isActive: selectIsActiveLayer(state, { id }),
    numLayers: selectLayerIDs(state).length,
    x: selectLayerX(state, { id }),
    y: selectLayerY(state, { id }),
    width: selectLayerWidth(state, { id }),
    height: selectLayerHeight(state, { id }),
    order: selectLayerOrder(state, { id }),
    background: selectLayerBackground(state, { id }),
    scale: selectLayerScale(state),
    xOffset: selectXOffset(state)[0],
    yOffset: selectYOffset(state)[0],
    layers: selectLayers(state),
  });
};

function mapDispatchToProps(dispatch, { id, onResize }) {
  return {
    onResize: (width, height) => {
      if (onResize) {
        onResize(width, height);
      } else {
        dispatch(updateLayerWidth(id, width));
        dispatch(updateLayerHeight(id, height));
      }
    },
    onMove: (x, y) => {
      dispatch(updateLayerX(id, x));
      dispatch(updateLayerY(id, y));
    },
    dispatch,
  };
}

const withConnect = connect(
  makeMapStateToProps(),
  mapDispatchToProps,
);

export default compose(
  withConnect,
  component =>
    // Don't rerender when other layers change, we only need this prop for
    // calculating the snap boundaries.
    memo(component, (prevProps, nextProps) =>
      isEqual(omit(prevProps, ['layers']), omit(nextProps, ['layers'])),
    ),
)(CaptionLayer);
