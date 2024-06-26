/**
 *
 * CaptionImages
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import useInjectLayerReducer from 'containers/CaptionLayers/useInjectLayerReducer';
import { CaptionPersistStorage } from 'containers/CaptionPersistController';
import { useInjectPersistedReducer } from 'utils/injectPersistedReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectImageIDs } from './selectors';
import reducer from './reducer';
import saga from './saga';

import CaptionImage from './CaptionImage';

export function CaptionImages({ imageIDs }) {
  useInjectLayerReducer();

  const isLoaded = useInjectPersistedReducer({
    key: 'captionImages',
    reducer,
    storage: CaptionPersistStorage,
  });

  useInjectSaga({ key: 'captionImages', saga });

  if (isLoaded) {
    return imageIDs.map(id => <CaptionImage id={id} key={id} />);
  }

  return null;
}

CaptionImages.propTypes = {
  imageIds: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = createStructuredSelector({
  imageIDs: makeSelectImageIDs(),
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
  memo,
)(CaptionImages);
