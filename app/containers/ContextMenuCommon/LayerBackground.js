import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import BackgroundInput from 'components/BackgroundInput';

import { updateLayerBackground } from 'containers/CaptionLayers/actions';
import { makeSelectLayerBackground } from 'containers/CaptionLayers/selectors';

export function LayerBackground({ background, onUpdateBackground }) {
  return <BackgroundInput value={background} onUpdate={onUpdateBackground} />;
}

LayerBackground.propTypes = {
  background: PropTypes.object,
  onUpdateBackground: PropTypes.func,
};

function makeMapStateToProps() {
  const selectLayerBackground = makeSelectLayerBackground();

  return (state, { id }) => ({
    background: selectLayerBackground(state, { id }),
  });
}

function mapDispatchToProps(dispatch, { id }) {
  return {
    onUpdateBackground: bg => dispatch(updateLayerBackground(id, bg)),
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
)(LayerBackground);
