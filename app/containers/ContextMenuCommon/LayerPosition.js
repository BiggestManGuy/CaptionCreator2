import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Input from 'components/Input';

import { updateLayerX, updateLayerY } from 'containers/CaptionLayers/actions';
import {
  makeSelectLayerX,
  makeSelectLayerY,
} from 'containers/CaptionLayers/selectors';

export function LayerPosition({ pos = 'x', val = 0, onUpdatePos = () => {} }) {
  return (
    <Input
      label={`${pos.toUpperCase()}-Position`}
      value={Math.round(val)}
      min={0}
      type="number"
      align="right"
      sanitize={Math.floor}
      addonRight="px"
      onChange={onUpdatePos}
    />
  );
}

LayerPosition.propTypes = {
  pos: PropTypes.oneOf(['x', 'y']),
  val: PropTypes.number,
  onUpdatePos: PropTypes.func,
};

function makeMapStateToProps() {
  const selector = {
    x: makeSelectLayerX(),
    y: makeSelectLayerY(),
  };

  return (state, { id, pos }) => ({
    val: selector[pos](state, { id }),
  });
}

function mapDispatchToProps(dispatch, { id, pos }) {
  const action = {
    x: updateLayerX,
    y: updateLayerY,
  };

  return {
    onUpdatePos: x => dispatch(action[pos](id, x)),
    dispatch,
  };
}

const withConnect = connect(
  makeMapStateToProps(),
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(LayerPosition);
